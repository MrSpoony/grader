const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('TestcaseStatus', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'status',
                key: 'id'
            }
        },
        testcase_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'testcase',
                key: 'id'
            }
        },
        submission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'submission',
                key: 'id'
            }
        }
    }, {
        sequelize,
        tableName: 'testcase_status',
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
                name: "fk_testcase_status_status1_idx",
                using: "BTREE",
                fields: [
                    { name: "status_id" },
                ]
            },
            {
                name: "fk_testcase_status_testcase1_idx",
                using: "BTREE",
                fields: [
                    { name: "testcase_id" },
                ]
            },
            {
                name: "fk_testcase_status_submission1_idx",
                using: "BTREE",
                fields: [
                    { name: "submission_id" },
                ]
            },
        ]
    });
};
