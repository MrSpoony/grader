const models = require("@lib/server");
const { Task, Testgroup, Testgrouptype } = models.default;


export default async function handler(req, res) {
    const {
        body: { testgrouptype_id, task_id },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(JSON.stringify(await Testgroup.findAll({ include: [{ model: Task, as: "task" }, { model: Testgrouptype, as: "testgrouptype"}] })));
        break;
    case "POST":
        res.status(200).json(await Testgroup.create({ testgrouptype_id, task_id }));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
