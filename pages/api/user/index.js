const models = require("@lib/server");
import config from "@lib/sessionConfig";
const { User, Submission, Role } = models.default;
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    if (!req.session ||
        !req.session.user ||
        !req.session.user.roles.filter(role => role.role === "admin")) {
        res.status(401).json({ message: "Unauthorized"});
        return;
    }
    const { method } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await User.findAll({ include: [
            { model: Submission, as: "submissions" },
            { model: Role, as: "role_id_roles"}
        ] }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
