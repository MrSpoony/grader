import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";
const bcrypt = require("bcrypt");
const models = require("@lib/server");
const { User } = models.default;

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        body: { username, password, email },
        method,
    } = req;
    switch (method) {
    case "POST":
        let user = await User.findOne( { where: { username }, include: [{ model: Role, as: "role_id_roles" }]});
        if (user === null) user.findOne( { where: { email }, include: [{ model: Role, as: "role_id_roles" }]}); 
        if (user === null) {
            res.status(404).json({ message: "User not found!"});
            return;
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                res.status(500).json({ message: err || "Something went wrong while decrypting the password!"});
                return;
            }
            if (!result) {
                res.status(500).json({ message: "The password does not match!"});
                return;
            }
        });
        req.session.user = {
            id: user.id,
            username: user.username,
            roles: user.role_id_roles
        };
        await req.session.save();
        res.send({ session: req.session });
    default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
