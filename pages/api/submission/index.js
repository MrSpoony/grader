const models = require("@lib/server");
const { Submission } = models.default;


export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Submission.findAll());
        break;
    case "POST":
        res.redirect("/api/register");
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
