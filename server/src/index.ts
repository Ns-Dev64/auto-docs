import { Elysia } from "elysia";
import errorHandler from "./middlewares/globalErrorHandler";
import { startAll } from "./start";
import authRouter from "./routes/auth";
import gitRouter from "./routes/git"

Bun.env.NODE_ENV = Bun.env.ENV || "dev";
const app = new Elysia({ prefix: "/api/v1" });
const port = Bun.env.PORT || 5001;

app.use(errorHandler);
app.use(authRouter);
app.use(gitRouter);

await startAll();
app.listen(port, () => console.info("Server running on port", port))