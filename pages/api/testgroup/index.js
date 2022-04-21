const models = require("@lib/server");
const { Task, Testgroup, Testgrouptype } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        body: { testgrouptype, task, points, limits },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Testgroup.findAll());
        break;
    case "POST": {
        if (!req.session ||
                !req.session.user ||
                !req.session.user.roles.filter(role => {
                    return role.role === "admin" || role.role === "leader";
                })) {
            res.status(401).json({ message: "unauthorized"});
            return;
        }
        const task_id = await Task.findOne({
            where: { name: task.toLowerCase() }
        });
        if (!task_id) res.status(400).json({
            message: "The task you want to add does not exists. "
        });
        const testgrouptype_id = await Testgrouptype.findOne({
            where: { name: testgrouptype }
        });
        if (!testgrouptype_id) res.status(400).json({
            message: "The testgrouptype you want to add does not exists. "
        });
        res.status(200).json(await Testgroup.create({
            testgrouptype_id,
            task_id,
            points,
            limits
        }));
    }
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
