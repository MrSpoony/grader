const models = require("@lib/server");
const { Role, User } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        query: { id },
        method
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Role.findByPk(id, { include: [{model: User, as: "user_id_users"}]}));
        break;
    case "DELETE":
        res.status(200).json(await Role.destroy({ where: { id }}));
        break;
    case "PUT":
        res.status(200).json(await Role.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
