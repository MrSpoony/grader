const models = require("@lib/server");
const { Testcase, Testgroup } = models.default;


export default async function handler(req, res) {
    const {
        body: { input, output, testgroup_id },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(JSON.stringify(await Testcase.findAll({ include: [{ model: Testgroup, as: "testgroup" }] })));
        break;
    case "POST":
        res.status(200).json(await Testcase.create({ input, output, testgroup_id }));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
