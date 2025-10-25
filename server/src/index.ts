import {Elysia} from "elysia";
import errorHandler from "./middlewares/globalErrorHandler";
import {startAll} from "./start";

const app = new Elysia({prefix:"/api/v1"});
const port = Bun.env.PORT || 5001;

app.use(errorHandler);


await startAll();
app.listen(5001, ()=> console.info("Server running on port",port))