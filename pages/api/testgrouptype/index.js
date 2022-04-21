const models = require("@lib/server");
const { Testgrouptype } = models.default;


export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await Testgrouptype.findAll());
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
