"use strict";
// models/User.ts
/**import { Model, DataTypes } from 'sequelize';
import sequelizeDb from '../config/db.config';
import User from './user'
const { v4: uuidv4 } = require('uuid');

class Notes extends Model {
  
    public title!: string;
    public description!: string;
    public duedate!: string | number;
    public status: string | undefined;
   
  }
  
  Notes.init(

    {
      id: {
        type: DataTypes.UUID, // Set the data type to UUID
        defaultValue: () => uuidv4(), // Generate a UUID for new records
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duedate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID, // Assuming userId is of type UUID
        allowNull: false,
        references: {
          model: User,
          key: 'id', // Name of the primary key in the User model
        },
      },
    },
    {
        // Other model options go here
        sequelize: sequelizeDb, // We need to pass the connection instance
        modelName: 'User' // We need to choose the model name
      });

  
  export default Notes;**/ 
