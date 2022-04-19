const models = require("@lib/server");
const { Submission } = models.default;


export default async function handler(req, res) {
    const {
        body: { user_id, compilation, code, task_id },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(JSON.stringify(await Submission.findAll()));
        break;
    case "POST":
        res.status(200).json(await Submission.create({ user_id, compilation, code, task_id }));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
