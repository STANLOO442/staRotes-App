"use strict";
/**import {  DataTypes, Model } from 'sequelize';
import sequelizeDb from '../config/db.config';
const { v4: uuidv4 } = require('uuid');


class User extends Model {
  
  public fullname: string | undefined;
  public email!: string;
  public gender!: string;
  public phone!: string | undefined;
  public address!: string;
  
}

User.init(

  {
    id: {
      type: DataTypes.UUID, // Set the data type to UUID
      defaultValue: () => uuidv4(), // Generate a UUID for new records
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize: sequelizeDb, // We need to pass the connection instance
    modelName: 'User' // We need to choose the model name
  });

User.hasMany(Note, { foreignKey: 'userId'});
Note.belongsTo(User);


export default User;**/ 
