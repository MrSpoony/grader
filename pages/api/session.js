import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";
const models = require("@lib/server");
const { User } = models.default;

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        if (!req.session.user) {
                res.status(399)
        }
            res.status(200).json({ session: req.session.user ? req.session : null })
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
