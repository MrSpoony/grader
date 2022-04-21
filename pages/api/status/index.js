const models = require("@lib/server");
const { Status } = models.default;
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Status.findAll());
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
