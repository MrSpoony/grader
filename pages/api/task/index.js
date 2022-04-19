const models = require("@lib/server");
const { Task, Testgroup } = models.default;


export default async function handler(req, res) {
    const {
        body: { name, statement },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(JSON.stringify(await Task.findAll({ include: [{ model: Testgroup, as: "testgroups" }] })));
        break;
    case "POST":
        res.status(200).json(await Task.create({ name, statement}));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
