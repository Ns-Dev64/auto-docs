import type { User } from "../generated/prisma/client";

export const status = ({user}:{
    user: User
})=>{
    return {
        user: {
            id: user.id,
            fullName: user.userName,
            email: user.email,
            createdAt: user.createdAt
        }
    };
}
