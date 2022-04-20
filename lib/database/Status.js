const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Status', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: "status_UNIQUE"
        }
    }, {
        sequelize,
        tableName: 'status',
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
                name: "status_UNIQUE",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "status" },
                ]
            },
        ]
    });
};
