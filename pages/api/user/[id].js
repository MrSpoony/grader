const models = require("@lib/server");
const { User, Submission, Role } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);


export  async function handler(req, res) {
    if (req.session === undefined) {
        res.status(401).json({ message: "Unauthorized"});
        return;
    }
    if (req.session.user === undefined) {
        res.status(401).json({ message: "Unauthorized"});
        return;
    }
    if (req.session.user.id !== id ||
        !req.sesssion.user.roles.find(role => role.role === "admin")) {
        res.status(401).json({ message: "Unauthorized"});
        return;
    }
    const {
        query: { id },
        method
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await User.findByPk(id, { include: [
            { model: Submission, as: "submissions" },
            { model: Role, as: "role_id_roles"}
        ] }));
        break;
    case "DELETE":
        res.status(200).json(await User.destroy({ where: { id }}));
        break;
    case "PUT":
        res.status(200).json(await User.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
