const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Testcase', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    output: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    testgroup_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'testgroup',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'testcase',
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
        name: "fk_testcase_testgroup1_idx",
        using: "BTREE",
        fields: [
          { name: "testgroup_id" },
        ]
      },
    ]
  });
};
