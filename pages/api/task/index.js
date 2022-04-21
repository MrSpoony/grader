const models = require("@lib/server");
const { Task, Testgroup } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        body: { name, statement },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Task.findAll({
            include: [{ model: Testgroup, as: "testgroups" }]
        }));
        break;
    case "POST": {
        if (!req.session ||
            !req.session.user ||
                !req.session.user.roles.find(role => {
                    return role.role === "leader" || role.role === "admin";
                })) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const realName = name.toLowerCase();
        res.status(200).json(await Task.create({ name: realName, statement }));
    }
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
