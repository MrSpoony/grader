const models = require("@lib/server");
const { Role, User } = models.default;


export default async function handler(req, res) {
    const {
        body: { role },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Role.findAll({ include: [{model: User, as: "user_id_users"}]}));
        break;
    case "POST":
        res.status(200).json(await Role.create({ role }));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
