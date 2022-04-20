import config from "@lib/sessionConfig";
const util = require("util");
const { Op } = require("sequelize");
import { withIronSessionApiRoute } from "iron-session/next";
const bcrypt = require("bcrypt");
const models = require("@lib/server");
const { User, Role } = models.default;

const hashPassword = (pass, salt) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(pass, salt, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
};


export default withIronSessionApiRoute(handler, config);

export async function handler(req, res) {
    const {
        body: { username, email, password, roles },
        method,
    } = req;
    switch (method) {
    case "POST": {
        let user = await User.findOne( { where: { username } });
        if (user !== null) res.status(400).json({ message: "Username already in use!"});
        user = await User.findOne( { where: { email } });
        if (user !== null) res.status(401).json({ message: "Email already in use!"});
        const rolesWithId = await Role.findAll( {
            where: {
                role: {
                    [Op.in]: roles
                }
            }
        });

        const hash = await hashPassword(password, 10);
        const newUser = await User.create({ username, email, password: hash});
        newUser.addRole_id_Roles(rolesWithId);
        res.status(200).json(newUser);

    }
        break;
    default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
