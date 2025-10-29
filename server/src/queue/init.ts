import { Queue } from "bullmq";

export const CONNECTION_STRING={
    host:"localhost",
    port:6379
}

export const initQueue=(name:string)=>{

    const queue=new Queue(name,{connection:CONNECTION_STRING});

    return queue
}

