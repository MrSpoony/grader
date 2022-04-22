/* eslint-disable max-len */
const models = require("@lib/server");
const { TestcaseStatus, Submission, Status, Role, Task, Testcase, Testgroup, Testgrouptype, User, sequelize } = models.default;

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
    case "GET": {
        const t = await sequelize.transaction();
        try {
            await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;", { raw: true });
            const opts = [{ where: {}, truncate: true, cascade: true }, { transaction: t }];
            await Status        .destroy(...opts);
            await Role          .destroy(...opts);
            await Task          .destroy(...opts);
            await Testcase      .destroy(...opts);
            await Testgroup     .destroy(...opts);
            await Testgrouptype .destroy(...opts);
            await User          .destroy(...opts);
            await TestcaseStatus.destroy(...opts);
            await Submission    .destroy(...opts);
            await t             .commit();
            await res           .status(200).json({message: "Everything is deleted"});
        } catch (e) {
            await t.rollback();
            await res.status(500).json({message: "Something went wrong please look at the log: " + e.message });
        } finally {
            sequelize.query("SET GLOBAL FOREIGN_KEY_CHECKS = 1;", { raw: true });
        }

    }
        break;
    default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
