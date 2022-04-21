const models = require("@lib/server");
const { User } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

const handleUnauthorized = async (req, res) => {
    if (!req.session ||
        !req.session.user ||
        !req.session.user.roles.filter(role => {
            return role.role === "admin" || role.role === "leader";
        })) {
        res.status(401).json({ message: "unauthorized"});
        return false;
    }
};

export async function handler(req, res) {
    const {
        query: { id },
        method
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await User.findByPk(id));
        break;
    case "DELETE":
        if (!handleUnauthorized()) return;
        res.status(200).json(await User.destroy({ where: { id }}));
        break;
    case "PUT":
        if (!handleUnauthorized()) return;
        res.status(200).json(await User.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
