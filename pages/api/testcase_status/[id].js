const models = require("@lib/server");
const {
    TestcaseStatus,
    Status,
    Testcase,
    Testgrouptype,
    Submission,
    Testgroup
} = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

const handleNotAdminOrLeader = async (req, res) => {
    if (!req.session.user.roles.find(role => {
        return role.role === "admin" || role.role === "leader";
    })) {
        res.status(401).json({ message: "Unauthorized" });
        return true;
    }
    return false;
};

export async function handler(req, res) {
    const {
        query: { id },
        method
    } = req;
    if (!req.session || !req.session.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    switch (method) {
    case "GET": {
        const caseStatus = await TestcaseStatus.findByPk(id, {
            include: [{ model: Submission, as: "submission" }]
        });
        if (!caseStatus) {
            res.status(404).json({ message: "TestcaseStatus not found" });
        } else if (caseStatus.submission.user_id !== req.session.user.id ||
            !req.session.user.roles.find(role => {
                return role.role === "admin" || role.role === "leader";
            } )) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const realCase = await TestcaseStatus.findByPk(id, {
            include: [
                { model: Status, as: "status"},
                {
                    model: Testcase, as: "testcase",
                    include: [
                        {
                            model: Testgroup, as: "testgroup",
                            include: [
                                {
                                    model: Testgrouptype,
                                    as: "testgrouptype",
                                    where: {
                                        type: "real"
                                    }
                                }
                            ]
                        }
                    ]
                },
                { model: Submission, as: "submission"}
            ]
        });
        const sampleCase = await TestcaseStatus.findByPk(id, {
            include: [
                { model: Status, as: "status"},
                {
                    model: Testcase, as: "testcase",
                    include: [
                        {
                            model: Testgroup, as: "testgroup",
                            include: [
                                {
                                    model: Testgrouptype,
                                    as: "testgrouptype",
                                    where: {
                                        type: "sample"
                                    }
                                }
                            ]
                        }
                    ]
                },
                { model: Submission, as: "submission"}
            ]
        }); 
        const rightCase = realCase ? realCase : sampleCase;
        res.status(200).json(rightCase);
    }
        break;
    case "DELETE":
        if (handleNotAdminOrLeader()) return;
        res.status(200).json(await TestcaseStatus.destroy({ where: { id }}));
        break;
    case "PUT":
        if (handleNotAdminOrLeader()) return;
        res.status(200).json(await TestcaseStatus.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
