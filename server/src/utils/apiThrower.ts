
export default class ApiError extends Error{

    public status: number;

    constructor(code: number, message: string){
        super(message);
        this.status = code;
    }

}