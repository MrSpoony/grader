const models = require("@lib/server");
const { User, Submission, Role } = models.default;

export default async function handler(req, res) {
    const {
        query: { id },
        method
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await User.findByPk(id, { include: [
            { model: Submission, as: "submissions" },
            { model: Role, as: "role_id_roles"}
        ] }));
        break;
    case "DELETE":
        res.status(200).json(await User.destroy({ where: { id }}));
        break;
    case "PUT":
        res.status(200).json(await User.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}