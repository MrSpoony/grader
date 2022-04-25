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
        res.status(401).json({ message: "unauthorized" });
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
        let testgroup;
        try {
            await Testgroup.findByPk(id);
        } catch (e) {
            try {
                await res.status(200).json({
                    message: e.message ||
                            "Something went wrong while trying to get the testgroup"
                });
            } catch (e) {
                console.log(e.message);
            }
        }
        if (testgroup.testgrouptype_id !== 1) {
            try {

                await res.status(200).json(testgroup);
            } catch (e) {
                console.log(e.message);
            }
            return;
        }
        console.log("something");
        try {

            testgroup = await Testgroup.findByPk(id, {
                include: [
                    { model: Testcase, as: "testcases" }
                ]
            });
        } catch (e) {
            try {
                await res.status(200).json({
                    message: e.message ||
                            "Something went wrong while trying to get the testgroup"
                });
            } catch (e) {
                console.log(e.message);
            }
        }
        try {
            await res.status(200).json();
        } catch (e) {
            console.log(e.message);
        }
    }
        break;
    case "DELETE":
        if (!handleUnauthorized()) return;
        await res.status(200).json(await Testgroup.destroy({ where: { id } }));
        break;
    case "PUT":
        if (!handleUnauthorized()) return;
        await res.status(200).json(await Testgroup.update(req.body, {
            where: { id }
        }));
        break;
    default:
        await res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
        await res.status(405).end(`Method ${method} Not Allowed`);
    }
}
