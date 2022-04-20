const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Task", {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        statement: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: "task",
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
        ]
    });
};
