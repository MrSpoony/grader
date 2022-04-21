const models = require("@lib/server");
const {
    TestcaseStatus,
    Submission,
    Testcase,
    Status,
    Testgroup,
    Testgrouptype
} = models.default;
const { Op } = require("sequelize");
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        if (req.session ||
            !req.session.user ||
            !req.session.user.roles.filter(role => {
                return role.role === "admin" || role.role === "leader";
            }) ||
            !await Submission.findOne({ where: { id: req.session.user.id } })) {
            res.status(401).json({ message: "unauthorized"});
            return false;
        }
        if (!req.session.user.roles.filter(role => {
            return role.role === "admin" || role.role === "leader";
        })) {
            const submission_ids = await Submission.findAll({
                where: { user_id: req.session.user.id }
            });
            let sampleCases = await TestcaseStatus.findAll({ 
                where: {
                    submission_id: {
                        [Op.in]: submission_ids
                    }
                },
                include: [
                    { model: Status, as: "status"},
                    {
                        model: Testcase,
                        as: "testcase",
                        include: [
                            {
                                model: Testgroup,
                                as: "testgroup",
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
            let testCases = await TestcaseStatus.findAll({ 
                where: {
                    submission_id: {
                        [Op.in]: submission_ids
                    }
                },
                include: [
                    { model: Status, as: "status"},
                    {
                        model: Testcase, as: "testcase",
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
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    { model: Submission, as: "submission"}
                ]
            });
            const everything ={...sampleCases, ...testCases};
            res.status(200).json(everything);
            return;
        }
        res.status(200).json(await TestcaseStatus.findAll({
            include: [
                { model: Status, as: "status"},
                { model: Testcase, as: "testcase"},
                { model: Submission, as: "submission"}
            ]

        }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
