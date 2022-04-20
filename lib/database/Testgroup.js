const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Testgroup", {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        testgrouptype_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "testgrouptype",
                key: "id"
            }
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "task",
                key: "id"
            }
        }
    }, {
        sequelize,
        tableName: "testgroup",
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "id_UNIQUE",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "fk_testgroup_testgrouptype_idx",
                using: "BTREE",
                fields: [
                    { name: "testgrouptype_id" },
                ]
            },
            {
                name: "fk_testgroup_task1_idx",
                using: "BTREE",
                fields: [
                    { name: "task_id" },
                ]
            },
        ]
    });
};
