const models = require("@lib/server");
const { TestcaseStatus } = models.default;


export default async function handler(req, res) {
    const {
        body: { testcase_id, status_id, submission_id },
        method,
    } = req;
    switch (method) {
    case "GET":
        res.status(200).json(JSON.stringify(await TestcaseStatus.findAll()));
        break;
    case "POST":
        res.status(200).json(await TestcaseStatus.create({ testcase_id, status_id, submission_id }));
        break;
    default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
