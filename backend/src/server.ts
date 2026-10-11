import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const start = async () => {
  await connectDB();
  app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`));
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
