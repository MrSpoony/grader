const models = require("@lib/server");
const { Testgroup, Testgrouptype } = models.default;


export default async function handler(req, res) {
    const {
        body: { type },
        method,
    } = req;
    switch (method) {
    case "GET":
            res.status(200).json(JSON.stringify(await Testgrouptype.findAll({ include: [{ model: Testgroup, as: "testgroups" }] })));
        break;
    case "POST":
        res.status(200).json(await Testgrouptype.create({ type }));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
