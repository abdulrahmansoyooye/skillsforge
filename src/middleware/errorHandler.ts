import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError.js";

export const errorHanlder : ErrorRequestHandler = (err,_req,res,_next)=>{
    // if(err instanceof ZodError){
    //     return res.status(400).json({
    //         error:"Validation failed",
    //         details:err.issues.map(i)=>({
    //             field:i.path.join("."),
    //             message:i.message
    //         })
    //     })
    // }
    if(err instanceof HttpError){
        return res.status(err.status).json({error:err.message})
    }
    console.error(err);
    res.status(500).json({error:"Internal server error"})
}