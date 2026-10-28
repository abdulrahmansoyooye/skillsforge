import { Router, type Request, type Response } from "express";
import { validate } from "zod";
import { credentialsSchema } from "./auth.schema.js";
import * as service from "./auth.service.js"
export const authRouter = Router();

authRouter.post("/register",async(req:Request,res:Response)=>{
  const {email,password} = credentialsSchema.parse(req.body);
  res.status(201).json(await service.register(email,password));
})

authRouter.post("/login",async(req:Request,res:Response)=>{
    const {email,password} = credentialsSchema.parse(req.body);
  res.status(201).json(await service.login(email,password));
})