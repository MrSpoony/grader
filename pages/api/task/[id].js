const models = require("@lib/server");
const { Task } = models.default;
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
    switch (method) {
    case "GET":
        res.status(200).json(await Task.findByPk(id));
        break;
    case "DELETE":
        if (handleNotAdminOrLeader()) return;
        res.status(200).json(await Task.destroy({ where: { id }}));
        break;
    case "PUT":
        if (handleNotAdminOrLeader()) return;
        res.status(200).json(await Task.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
