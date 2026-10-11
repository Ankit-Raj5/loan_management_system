import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { User } from "../models/user.model";
import { hashPassword } from "../services/auth.service";
import { Role } from "../types/roles";

const SEED_USERS = [
  { name: "Admin User", email: "admin@lms.com", role: Role.ADMIN },
  { name: "Sales Executive", email: "sales@lms.com", role: Role.SALES },
  { name: "Sanction Executive", email: "sanction@lms.com", role: Role.SANCTION },
  { name: "Disbursement Executive", email: "disbursement@lms.com", role: Role.DISBURSEMENT },
  { name: "Collection Executive", email: "collection@lms.com", role: Role.COLLECTION },
  { name: "Test Borrower", email: "borrower@lms.com", role: Role.BORROWER },
];

const PASSWORD = "Password@123";

// Creates or resets one account per role with a known password
const seed = async () => {
  await connectDB();
  const password = await hashPassword(PASSWORD);
  for (const u of SEED_USERS) {
    await User.updateOne({ email: u.email }, { $set: { ...u, password, isActive: true } }, { upsert: true });
    console.log(`Seeded ${u.role.padEnd(12)} ${u.email}`);
  }
  console.log(`\nAll seeded accounts use password: ${PASSWORD}`);
  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error("Seeding failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
