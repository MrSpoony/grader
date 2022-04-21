const models = require("@lib/server");
const { Submission } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        if (!req.session || !req.session.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        } else if (!req.session.user.roles.find(role => {
            return role.role === "admin" || role.role === "leader";
        })) {
            res.status(200).json(await Submission.findAll({
                where: {
                    user_id: req.session.user.id
                },
            }));
            return;
        } else {
            res.status(200).json(await Submission.findAll());
            break;
        }
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
