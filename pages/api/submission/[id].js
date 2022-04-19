const models = require("@lib/server");
const { Submission } = models.default;

export default async function handler(req, res) {
    const {
        query: { id },
        method
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Submission.findByPk(id));
        break;
    case "DELETE":
        res.status(200).json(await Submission.destroy({ where: { id }}));
        break;
    case "PUT":
        res.status(200).json(await Submission.update(req.body, { where: { id } }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
