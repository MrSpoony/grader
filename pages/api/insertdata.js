/* eslint-disable max-len */
const models = require("@lib/server");
const { Status, Role, Task, Testcase, Testgroup, Testgrouptype, User, sequelize } = models.default;

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET": {
        const t = await sequelize.transaction();
        try {
            const tr = { transaction: t };
            await Role          .create({ role: "admin"}, tr);
            await Role          .create({ role: "leader"}, tr);
            await Role          .create({ role: "participant"}, tr);
            const u = await User.create({ username: "admin", email: "admin@admin.ch", password: "$2b$10$hsEstAHJYNQj5gnhhDT.PumKuXV7ufKekRMnOcIssuYNV8Sqb41aO" }, tr);
            await u             .addRole_id_roles([1], tr);
            await Status        .create({ status: "Success" }, tr);
            await Status        .create({ status: "Warning" }, tr);
            await Status        .create({ status: "Error" }, tr);
            await Status        .create({ status: "RE" }, tr);
            await Status        .create({ status: "WA" }, tr);
            await Status        .create({ status: "TLE" }, tr);
            await Status        .create({ status: "SIG" }, tr);
            await Status        .create({ status: "Pending" }, tr);
            await Testgrouptype .create({ type: "sample"}, tr);
            await Testgrouptype .create({ type: "real"}, tr);
            await Task          .create({ name: "Addition", statement: `
Addition:
Given two numbers a and b, calculate a + b.

Input:
The input consists of two lines, the first one contains an integer a, the second one an integer b.

Output:
Print a single line with the value a + b.` }, tr);
            await Task          .create({ name: "Lis", statement: `
Longest increasing subsequence:

Given a list of integers a1, ..., aN, compute the length of the longest strictly increasing subsequence of them. (A subsequence does not necessarily have to be contiguous.)

Input:
The first line of the input contains a non-negative integer N – the length of the sequence.
The second line contains the sequence consisting of N integers ai.

Output
Print a single integer – the length of the longest increasing subsequence.` }, tr);
            await Testgroup     .create({ testgrouptype_id: 1, task_id: 1,                                      points: 0, limits: ""}, tr);
            await Testgroup     .create({ testgrouptype_id: 2, task_id: 1,                                      points: 50, limits: "0 <= a, b, a + b <= 10^9" }, tr);
            await Testgroup     .create({ testgrouptype_id: 2, task_id: 1,                                      points: 50, limits: "0 <= a, b, a + b <= 10^19" }, tr);
            await Testgroup     .create({ testgrouptype_id: 1, task_id: 2,                                      points: 0, limits: ""}, tr);
            await Testgroup     .create({ testgrouptype_id: 2, task_id: 2,                                      points: 50, limits: "1 <= N <= 20"}, tr);
            await Testgroup     .create({ testgrouptype_id: 2, task_id: 2,                                      points: 50, limits: "1 <= N <= 1000"}, tr);
            await Testcase      .create({ testgroup_id: 1,     input: "2\n3",                                   output: "5" }, tr);
            await Testcase      .create({ testgroup_id: 1,     input: "700000000000000000\n300000000000000000", output: "1000000000000000000" }, tr);
            await Testcase      .create({ testgroup_id: 2,     input: "1 2",                                    output: "3"}, tr);
            await Testcase      .create({ testgroup_id: 2,     input: "4 2",                                    output: "6"}, tr);
            await Testcase      .create({ testgroup_id: 2,     input: "1000000000\n23957899",                   output: "1023957899"}, tr);
            await Testcase      .create({ testgroup_id: 3,     input: "587584993025834548\n889593788789900299", output: "1477178781815734784"}, tr);
            await Testcase      .create({ testgroup_id: 3,     input: "700000000000000000\n0",                  output: "700000000000000000"}, tr);
            await Testcase      .create({ testgroup_id: 3,     input: "0\n0",                                   output: "0"}, tr);
            await Testcase      .create({ testgroup_id: 4,     input: "3\n1 3 2",                               output: "2"}, tr);
            await Testcase      .create({ testgroup_id: 4,     input: "6\n3 3 3 2 2 1",                         output: "1"}, tr);
            await Testcase      .create({ testgroup_id: 4,     input: "6\n3 1 2 6 4 5",                         output: "1"}, tr);
            await Testcase      .create({ testgroup_id: 5,     input: "6\n3 1 2 6 4 5",                         output: "1"}, tr);
            await Testcase      .create({ testgroup_id: 6,     input: "7\n1 6 9 2 4 5 6",                       output: "1"}, tr);
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
