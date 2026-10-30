import bcrypt from "bcrypt"
import { HttpError } from "../../utils/httpError.js";
import { prisma } from "../../config/prisma.js";
import  jwt from "jsonwebtoken";
export async function register (email:string,password:string){
  const passwordHash = await bcrypt.hash(password,10);
 
  try {
    const user = await prisma.user.create({data:{email,passwordHash}})
    return {id:user.id, email:user.email};
  } catch (error:) {
    if(error.code === "P2002") throw new HttpError(409,'Email already registered')
    throw error
  }
}

export async function login (email:string,password:string){
  const user = await prisma.user.findUnique({where:{email}})
  const valid = user && await bcrypt.compare(password,user.passwordHash);
 if(!user || !valid) throw new HttpError(401,"Invalid email or password")
   const token = jwt.sign({sub:user.id},process.env.JWT_SECRET!,{expiresIn:'1d'})
   return {token}
 
}