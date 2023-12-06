// src/model/note.ts

/**import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';
const { v4: uuidv4 } = require('uuid');
import  User  from './user'; // Import the User model

class Note extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public dueDate!: Date;
  public status!: string;
  public userId!: string;
}

Note.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
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
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Note',
  }
);

// Define the association: Note belongs to a User
Note.belongsTo(User, { foreignKey: 'userId' });

export default Note;**/


