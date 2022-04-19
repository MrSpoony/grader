const models = require("@lib/server");
const { User, Submission } = models.default;


export default async function handler(req, res) {
    const {
        body: { username, email, password },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await User.findAll({ include: [{ model: Submission, as: "submissions" }] }));
        break;
    case "POST":
        res.status(200).json(await User.create({ username, email, password }));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
