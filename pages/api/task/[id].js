const models = require("@lib/server");

export default async function handler(req, res) {
    const {
        query: { id },
        method
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(await models.default.Task.findByPk(id));
        break;
    // case "PUT":
    //     res.status(200).json(await models.default.Task.create({ name, statement}));
    //     break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
