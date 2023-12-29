// note.ts

import sequelize from '../config/db.config';
import { DataTypes, Model } from 'sequelize';

class Note extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public dueDate!: string;
  public status!: string;
  public userId!: string;
  public content!: string; // Add the content field

  // Other properties and methods...
}

Note.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT, // Use TEXT for longer content
      allowNull: true, // Make it nullable if not required
    },
  },
  {
    sequelize,
    modelName: 'Note',
  }
);

export default Note;
