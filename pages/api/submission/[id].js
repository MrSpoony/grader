const models = require("@lib/server");
const {
    Submission,
    TestcaseStatus,
    Testgroup,
    Task,
    Testcase,
    Testgrouptype
} = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        query: { id },
        method
    } = req;
    const submission = await Submission.findByPk(id);
    if (!submission) {
        res.status(404).json({message: "Submission not found" });
        return;
    }
    if ((req.session?.user?.id !== submission.user_id &&
        !req.session?.user?.roles.find(role => {
            return role.role === "admin" || role.role === "leader";
        }))) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    switch (method) {
    case "GET": {
        let sampleCases = await Submission.findByPk(id, {
            include: [
                { 
                    model: TestcaseStatus, as: "testcase_statuses",
                    include: [
                        { model: Testcase, as: "testcase",
                            include: [
                                {
                                    model: Testgroup, as: "testgroup",
                                    include: [
                                        {
                                            model: Testgrouptype,
                                            as: "testgrouptype",
                                            where: {
                                                type: "sample"
                                            },
                                            required: false,
                                            right: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        });
        let realCases = await Submission.findByPk(id, {
            include: [
                { 
                    model: TestcaseStatus, as: "testcase_statuses",
                    attributes: [
                        "id",
                        "status_id",
                        "testcase_id",
                        "submission_id"
                    ],
                    include: [
                        { model: Testcase, as: "testcase",
                            attributes: ["testgroup_id"],
                            include: [
                                {
                                    model: Testgroup, as: "testgroup",
                                    include: [
                                        {
                                            model: Testgrouptype,
                                            as: "testgrouptype",
                                            where: {
                                                type: "real"
                                            },
                                            required: false,
                                            right: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { model: Task, as: "task" },
            ]
        });
        sampleCases = sampleCases.get({ plain: true });
        realCases = realCases.get({ plain: true });
        let everything = {
            ...sampleCases,
        };
        everything.testcase_statuses = [
            ...everything.testcase_statuses,
            ...realCases.testcase_statuses
        ];
        res.status(200).json(everything);
    }
        break;
    case "DELETE":
        if (!req.session.user.roles.find(role => {
            return role.role === "admin" || role.role === "leader";
        })) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        res.status(200).json(await Submission.destroy({ where: { id }}));
        break;
    case "PUT":
        res.status(200).json(await Submission.update(
            req.body,
            { where: { id } }
        ));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
