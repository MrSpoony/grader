import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";
const bcrypt = require("bcrypt");
const models = require("@lib/server");
const { User } = models.default;

export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        body: { username, email, password },
        method,
    } = req;
    switch (method) {
    case "POST":
        let user = await User.findOne( { where: { username } });
        if (user !== null) res.status(400).json({ message: "Username already in use!"});
        user = await User.findOne( { where: { email } });
        if (user !== null) res.status(400).json({ message: "Email already in use!"});
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) res.status(500).json({message: err || "Something went wrong while hashing the password"});
            res.status(200).json(User.create({ username, email, password: hash}));
        });
    default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
