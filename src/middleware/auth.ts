import type { NextFunction, Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";

declare global{
    namespace Express{
      interface Request{
        user?:{id:string}
      }
    }
}

export const requireAuth:RequestHandler = (req,_res,next)=>{
    const header = req.headers.authorization
    if(!header?.startsWith("Bearer ")) throw new HttpError(401,'Malformed Token')
    try{
      const payload = jwt.verify(header.slice(7),process.env.JWTSECRET!) as jwt.JwtPayload;
      req.user = {id:payload.sub as string}
      next();
}catch{
  throw new HttpError(401,"Invalid or expired token")
}}
