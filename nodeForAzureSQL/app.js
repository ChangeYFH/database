const fs = require('fs');
const { Sequelize, Model, DataTypes } = require('sequelize');
const config = require('./config');

async function main() {
  const sequelize = await new Sequelize(config);

  sequelize.sync();

  (async function() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();

  class Model2Lob extends Model {
    static async createBLOB(path) {
      const imageData = fs.readFileSync(path);
      await Model2Lob.create({
        BLOB: imageData
      });
    }
    static async queryBLOB() {
      const data = await Model2Lob.findAll();
      data.forEach(item => {
        console.log(`${item.dataValues.id}-${item.dataValues.BLOB.toString()}`);
      });
    }
    static async clearBLOB() {
      await Model2Lob.destroy({
        truncate: true
      });
    }
  }

  Model2Lob.init({
    id:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    BLOB: DataTypes.BLOB,
  },{
    sequelize: sequelize,
    tableName: 'lobTable'
  });

  if (process.argv[2] === 'create') {
    await Model2Lob.createBLOB('data/input.txt');
  } else if (process.argv[2] === 'query') {
    await Model2Lob.queryBLOB();
  } else if (process.argv[2] === 'clear') {
    await Model2Lob.clearBLOB();
  }
}

main();

