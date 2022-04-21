const models = require("@lib/server");
const { Submission } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        query: { id },
        method
    } = req;
    const submission = await Submission.findByPk(id);
    if (!submission) {
        res.status(404).json({message: "Submission not found" });
        return;
    }
    if (!req.session ||
        !req.session.user||
        (req.session.user.id !== submission.user_id &&
        !req.session.user.roles.find(role => {
            return role.role === "admin" || role.role === "leader";
        }))) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    switch (method) {
    case "GET":
        res.status(200).json(await Submission.findByPk(id));
        break;
    case "DELETE":
        if (!req.session.user.roles.find(role => {
            return role.role === "admin" || role.role === "leader";
        })) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        res.status(200).json(await Submission.destroy({ where: { id }}));
        break;
    case "PUT":
        res.status(200).json(await Submission.update(
            req.body,
            { where: { id } }
        ));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
