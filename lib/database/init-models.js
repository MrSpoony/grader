var DataTypes = require("sequelize").DataTypes;
var _Status = require("./Status");
var _Submission = require("./Submission");
var _Task = require("./Task");
var _Testcase = require("./Testcase");
var _TestcaseStatus = require("./TestcaseStatus");
var _Testgroup = require("./Testgroup");
var _Testgrouptype = require("./Testgrouptype");
var _User = require("./User");

function initModels(sequelize) {
  var Status = _Status(sequelize, DataTypes);
  var Submission = _Submission(sequelize, DataTypes);
  var Task = _Task(sequelize, DataTypes);
  var Testcase = _Testcase(sequelize, DataTypes);
  var TestcaseStatus = _TestcaseStatus(sequelize, DataTypes);
  var Testgroup = _Testgroup(sequelize, DataTypes);
  var Testgrouptype = _Testgrouptype(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Submission.belongsTo(Status, { as: "compilation_status", foreignKey: "compilation"});
  Status.hasMany(Submission, { as: "submissions", foreignKey: "compilation"});
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

  return {
    Status,
    Submission,
    Task,
    Testcase,
    TestcaseStatus,
    Testgroup,
    Testgrouptype,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
