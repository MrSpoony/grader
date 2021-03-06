const initModels = require("./database/init-models");
const Sequelize = require("sequelize");
const sequelize = new Sequelize("grader", "graderuser", "graderuserpassword", {
    host: "192.168.52.85",
    dialect: "mysql",
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

let models = initModels(sequelize);
models = {
    ...models,
    sequelize,
    Sequelize
};
module.exports.default = models;
// export default models;
