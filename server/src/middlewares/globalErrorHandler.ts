import { Elysia } from "elysia";
import ApiError from "../utils/apiThrower";

const errorHandler = new Elysia()

    .onError({ as: 'global' }, ({ set, error, code }) => {

        console.error(error);

        if (error instanceof Error) {

            set.status = 500;

            return {
                message: error.message,
            }

        } else if (error instanceof ApiError) {

            set.status = error.status;

            return {
                message: error.message,

            }   

        } else {

            return {
                message: error,
                code
            }

        }

    });

export default errorHandler;
