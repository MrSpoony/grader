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
    let {
        query: { id },
        method
    } = req;
    const submission = await Submission.findByPk(id, {
        include: [{
            model: Task, as: "task",
            include: [{
                model: Testgroup, as: "testgroups",
            }]
        }]
    });
    if (!submission) {
        res.status(404).json({ message: "Submission not found" });
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

        let submission = await Submission.findByPk(id);
        let sampleCases = await Submission.findByPk(id, {
            include: [
                {
                    model: TestcaseStatus, as: "testcase_statuses",
                    required: false,
                    include: [{
                        model: Testcase, as: "testcase",
                        required: false,
                        include: [{
                            model: Testgroup, as: "testgroup",
                            required: false,
                            include: [{
                                model: Testgrouptype,
                                as: "testgrouptype",
                                where: {
                                    type: "sample"
                                },
                                required: false,
                                right: true
                            }
                            ]}
                        ]}
                    ]
                },
                { model: Task, as: "task" },
            ]
        });

        let realCases = await Submission.findByPk(id, {
            include: [
                {
                    model: TestcaseStatus, as: "testcase_statuses",
                    required: false,
                    attributes: [
                        "id",
                        "status_id",
                        "testcase_id",
                        "submission_id"
                    ],
                    include: [{
                        model: Testcase, as: "testcase",
                        required: false,
                        attributes: ["testgroup_id", "id"],
                        include: [{
                            model: Testgroup, as: "testgroup",
                            required: false,
                            include: [{
                                model: Testgrouptype,
                                as: "testgrouptype",
                                where: {
                                    type: "real"
                                },
                                required: false,
                                right: true
                            }]
                        }]
                    }]
                },
                { model: Task, as: "task" },
            ]
        });

        sampleCases = await sampleCases?.get({ plain: true });
        realCases = await realCases?.get({ plain: true });
        submission = await submission.get({ plain: true });
        let everything = {};
        if (!sampleCases) everything = submission;
        else everything = sampleCases;
        if (realCases?.testcase_statuses)
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
        for (let i = 0; i < 100; i++)
            console.log("testing");
        res.status(200).json(await Submission.destroy({ where: { id } }));
        break;
    case "PUT": {
        let maxScore = submission.task.testgroups.map(tg => {
            return tg.points;
        }, 0);
        maxScore = maxScore.reduce((a, b) => a + b);
        req.body.score = req.body.score < maxScore ? req.body.score : maxScore;
        req.body.score = req.body.score > 0 ? req.body.score : 0;
        console.log(req.body);
        res.status(200).json(await Submission.update(
            req.body,
            { where: { id } }
        ));
    }
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
