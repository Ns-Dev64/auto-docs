import { Elysia } from "elysia";
import authMiddleware from "../middlewares/authMiddleware";
import { getUserRepos } from "../controllers/git";

const gitRouter = new Elysia({prefix: "/git"});

gitRouter
    .use(authMiddleware)
    .get("/repos",getUserRepos)


export default gitRouter