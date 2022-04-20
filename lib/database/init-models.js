var DataTypes = require("sequelize").DataTypes;
var _Role = require("./Role");
var _Status = require("./Status");
var _Submission = require("./Submission");
var _Task = require("./Task");
var _Testcase = require("./Testcase");
var _TestcaseStatus = require("./TestcaseStatus");
var _Testgroup = require("./Testgroup");
var _Testgrouptype = require("./Testgrouptype");
var _User = require("./User");
var _UserHasRole = require("./UserHasRole");

function initModels(sequelize) {
    var Role = _Role(sequelize, DataTypes);
    var Status = _Status(sequelize, DataTypes);
    var Submission = _Submission(sequelize, DataTypes);
    var Task = _Task(sequelize, DataTypes);
    var Testcase = _Testcase(sequelize, DataTypes);
    var TestcaseStatus = _TestcaseStatus(sequelize, DataTypes);
    var Testgroup = _Testgroup(sequelize, DataTypes);
    var Testgrouptype = _Testgrouptype(sequelize, DataTypes);
    var User = _User(sequelize, DataTypes);
    var UserHasRole = _UserHasRole(sequelize, DataTypes);

    Role.belongsToMany(User, { as: 'user_id_users', through: UserHasRole, foreignKey: "role_id", otherKey: "user_id" });
    User.belongsToMany(Role, { as: 'role_id_roles', through: UserHasRole, foreignKey: "user_id", otherKey: "role_id" });
    UserHasRole.belongsTo(Role, { as: "role", foreignKey: "role_id"});
    Role.hasMany(UserHasRole, { as: "user_has_roles", foreignKey: "role_id"});
    Submission.belongsTo(Status, { as: "compilation_status_status", foreignKey: "compilation_status"});
    Status.hasMany(Submission, { as: "submissions", foreignKey: "compilation_status"});
    TestcaseStatus.belongsTo(Status, { as: "status", foreignKey: "status_id"});
    Status.hasMany(TestcaseStatus, { as: "testcase_statuses", foreignKey: "status_id"});
    TestcaseStatus.belongsTo(Submission, { as: "submission", foreignKey: "submission_id"});
    Submission.hasMany(TestcaseStatus, { as: "testcase_statuses", foreignKey: "submission_id"});
    Submission.belongsTo(Task, { as: "task", foreignKey: "task_id"});
    Task.hasMany(Submission, { as: "submissions", foreignKey: "task_id"});
    Testgroup.belongsTo(Task, { as: "task", foreignKey: "task_id"});
    Task.hasMany(Testgroup, { as: "testgroups", foreignKey: "task_id"});
    TestcaseStatus.belongsTo(Testcase, { as: "testcase", foreignKey: "testcase_id"});
    Testcase.hasMany(TestcaseStatus, { as: "testcase_statuses", foreignKey: "testcase_id"});
    Testcase.belongsTo(Testgroup, { as: "testgroup", foreignKey: "testgroup_id"});
    Testgroup.hasMany(Testcase, { as: "testcases", foreignKey: "testgroup_id"});
    Testgroup.belongsTo(Testgrouptype, { as: "testgrouptype", foreignKey: "testgrouptype_id"});
    Testgrouptype.hasMany(Testgroup, { as: "testgroups", foreignKey: "testgrouptype_id"});
    Submission.belongsTo(User, { as: "user", foreignKey: "user_id"});
    User.hasMany(Submission, { as: "submissions", foreignKey: "user_id"});
    UserHasRole.belongsTo(User, { as: "user", foreignKey: "user_id"});
    User.hasMany(UserHasRole, { as: "user_has_roles", foreignKey: "user_id"});

    return {
        Role,
        Status,
        Submission,
        Task,
        Testcase,
        TestcaseStatus,
        Testgroup,
        Testgrouptype,
        User,
        UserHasRole,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
