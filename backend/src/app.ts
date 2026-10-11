import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import routes from "./routes";
import { mountRouter } from "./utils/routeRegistry";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
if (env.nodeEnv !== "test") app.use(morgan("dev"));

mountRouter(app, "/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
