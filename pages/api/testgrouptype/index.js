const models = require("@lib/server");
const { Testgroup, Testgrouptype } = models.default;


export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Testgrouptype.findAll({
            include: [{ model: Testgroup, as: "testgroups" }]
        }));
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
