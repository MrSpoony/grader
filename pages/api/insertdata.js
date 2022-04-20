const models = require("@lib/server");
const { User, Status, Task, Testcase, Testgroup, Testgrouptype } = models.default;

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET":
        await User         .create({ username: "Spoony", email: "spoony@test.ch", password: "test" });
        await Status       .create({ status: "Success" });
        await Status       .create({ status: "Warning" });
        await Status       .create({ status: "Error" });
        await Status       .create({ status: "RE" });
        await Status       .create({ status: "WA" });
        await Status       .create({ status: "TLE" });
        await Status       .create({ status: "SIG" });
        await Task         .create({ name: "Testtask", statement: "Teststatement" });
        await Testgrouptype.create({ type: "sample"});
        await Testgrouptype.create({ type: "real"});
        await Testgroup    .create({ testgrouptype_id: 1, task_id: 1 });
        await Testgroup    .create({ testgrouptype_id: 2, task_id: 1 });
        await Testcase     .create({ testgroup_id: 1, input: "1 2", output: "3"});
        await Testcase     .create({ testgroup_id: 1, input: "4 2", output: "6"});
        await Testcase     .create({ testgroup_id: 2, input: "10000 2", output: "10002"});
        await Testcase     .create({ testgroup_id: 2, input: "4914372514 4914372514", output: "9828745028"});
        res                .status(200).json({message: "Everyting is created!"});
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
