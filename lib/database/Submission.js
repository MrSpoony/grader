const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Submission', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'task',
                key: 'id'
            }
        },
        verdict: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'status',
                key: 'id'
            }
        },
        compilation_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'status',
                key: 'id'
            }
        },
        compilation_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'submission',
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
                name: "fk_submission_status1_idx",
                using: "BTREE",
                fields: [
                    { name: "compilation_status" },
                ]
            },
            {
                name: "fk_submission_user1_idx",
                using: "BTREE",
                fields: [
                    { name: "user_id" },
                ]
            },
            {
                name: "fk_submission_task1_idx",
                using: "BTREE",
                fields: [
                    { name: "task_id" },
                ]
            },
            {
                name: "fk_submission_status2_idx",
                using: "BTREE",
                fields: [
                    { name: "verdict" },
                ]
            },
        ]
    });
};
