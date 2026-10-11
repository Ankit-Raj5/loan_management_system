import app from "./app";
import { isCloudinaryConfigured } from "./config/cloudinary";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { printRoutes } from "./utils/routeRegistry";

// Connects to MongoDB, starts the HTTP server and prints all registered routes
const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    printRoutes(app);
    if (!isCloudinaryConfigured) console.warn("Cloudinary is not configured: salary slip uploads will fail until CLOUDINARY_* is set in .env");
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
