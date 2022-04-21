/* eslint-disable max-len */
const models = require("@lib/server");
const { Status, Role, Task, Testcase, Testgroup, Testgrouptype, User, sequelize } = models.default;

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET": {
        const t = await sequelize.transaction();
        try {
            await Role          .create({ role: "admin"}, { transaction: t });
            await Role          .create({ role: "leader"}, { transaction: t });
            await Role          .create({ role: "participant"}, { transaction: t });
            const u = await User.create({ username: "admin", email: "admin@admin.ch", password: "$2b$10$hsEstAHJYNQj5gnhhDT.PumKuXV7ufKekRMnOcIssuYNV8Sqb41aO" }, { transaction: t });
            await u             .addRole_id_roles([1], { transaction: t });
            await Status        .create({ status: "Success" }, { transaction: t });
            await Status        .create({ status: "Warning" }, { transaction: t });
            await Status        .create({ status: "Error" }, { transaction: t });
            await Status        .create({ status: "RE" }, { transaction: t });
            await Status        .create({ status: "WA" }, { transaction: t });
            await Status        .create({ status: "TLE" }, { transaction: t });
            await Status        .create({ status: "SIG" }, { transaction: t });
            await Status        .create({ status: "Pending" }, { transaction: t });
            await Task          .create({ name: "Addition", statement: "You get two numbers and you have to print out the sum of those" }, { transaction: t });
            await Testgrouptype .create({ type: "sample"}, { transaction: t });
            await Testgrouptype .create({ type: "real"}, { transaction: t });
            await Testgroup     .create({ testgrouptype_id: 1, task_id: 1, points: 30, limits: "10^6" }, { transaction: t });
            await Testgroup     .create({ testgrouptype_id: 2, task_id: 1, points: 50, limits: "10^10" }, { transaction: t });
            await Testcase      .create({ testgroup_id: 1, input: "1 2", output: "3"}, { transaction: t });
            await Testcase      .create({ testgroup_id: 1, input: "4 2", output: "6"}, { transaction: t });
            await Testcase      .create({ testgroup_id: 2, input: "10000 2", output: "10002"}, { transaction: t });
            await Testcase      .create({ testgroup_id: 2, input: "4914372514 4914372514", output: "9828745028"}, { transaction: t });
            await t             .commit();
            await res           .status(200).json({message: "Everyting is created!"});
        } catch (e) {
            await t.rollback();
            await res.status(500).json({message: "Something went wrong please look at the log: " + e.message });
        }
    }
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
