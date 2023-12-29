// src/seed.ts
import { Sequelize } from "sequelize";
import sequelizeDb from "./config/db.config";
import User from "./model/user";


// Function to seed data
export const seed = async () => {
  try {
    // Sync models with the database
    await sequelizeDb.sync({ alter: true });

    // Seed a user
    const user = await User.create({
      fullname: "Victor Boniface",
      email: "bony@gmail.com",
      gender: "male",
      phone: "08031228966",
      address: "50, orchid road",
      password: "3450pro"
    });

    // Seed a note related to the user
 

    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

// Call the seed function
seed()
