import { Elysia } from "elysia";
import authMiddleware from "../middlewares/authMiddleware";
import oauthMiddleware from "../middlewares/oauth";
import { status } from "../controllers/auth";

const authRouter = new Elysia({prefix: "/auth"});

//oauth 2.0 routes
authRouter.use(oauthMiddleware);


authRouter
    .use(authMiddleware)
    .get("/status",status);


export default authRouter