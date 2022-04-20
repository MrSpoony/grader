const models = require("@lib/server");
const { User, Submission, Role } = models.default;


export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await User.findAll({ include: [
            { model: Submission, as: "submissions" },
            { model: Role, as: "role_id_roles"}
        ] }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
