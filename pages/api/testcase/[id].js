const models = require("@lib/server");
const { Testcase } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    if (!req.session ||
        !req.session.user ||
        !req.sessino.user.roles.find(role => {
            return role.role === "admin" || role.role === "leader";
        })) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const {
        query: { id },
        method
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Testcase.findByPk(id));
        break;
    case "DELETE":
        res.status(200).json(await Testcase.destroy({ where: { id }}));
        break;
    case "PUT":
        res.status(200).json(await Testcase.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
