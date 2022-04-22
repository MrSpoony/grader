const models = require("@lib/server");
const { Testgroup, Testcase } = models.default;
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
    case "GET": {
        const testgroup = await Testgroup.findByPk(id);
        if (testgroup.testgrouptype_id === 1) {
            console.log("something");
            res.status(200).json(await Testgroup.findByPk(id, {
                include: [
                    { model: Testcase, as: "testcases" }
                ]
            }));
            return;
        }
        res.status(200).json(testgroup);
    }
        break;
    case "DELETE":
        if (!handleUnauthorized()) return;
        res.status(200).json(await Testgroup.destroy({ where: { id }}));
        break;
    case "PUT":
        if (!handleUnauthorized()) return;
        res.status(200).json(await Testgroup.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
