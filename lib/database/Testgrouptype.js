const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Testgrouptype", {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: "type_UNIQUE"
        }
    }, {
        sequelize,
        tableName: "testgrouptype",
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
                name: "type_UNIQUE",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "type" },
                ]
            },
        ]
    });
};
