const models = require("@lib/server");
const { Role } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        body: { role },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Role.findAll());
        break;
    case "POST":
        res.status(200).json(await Role.create({ role }));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
