
import jwt from "jsonwebtoken"

export const getEnv = () :string =>{
    return Bun.env.NODE_ENV!;
}

export const generateToken = (payload: any, isRefresh: boolean = false) => {
    const secret = Bun.env.JWT_SECRET!;
    return jwt.sign(payload,secret,{
        expiresIn: isRefresh ? "3d" : "1d"
    });
}

export const getSecondsFromHours = (hours: number) => {
    return hours * 3600
}