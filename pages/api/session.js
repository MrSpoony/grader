import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        if (!req.session.user) {
            res.status(400);
        }
        res.status(200).json({ session: req.session.user ? req.session : null });
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
