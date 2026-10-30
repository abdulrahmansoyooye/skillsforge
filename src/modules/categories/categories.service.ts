import { success } from "zod";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/httpError.js"
import { isUniqueViolation } from "../../utils/prismaErrors.js";

export async function list(userId:string){
   return await prisma.category.findMany({
        where:{
            userId
        },
        orderBy:{
            name:'asc'
        }
    })
}

export async function getOwned(userId:string,id:string){
   const category = await prisma.category.findFirst({
        where:{
            id,
            userId
        },
        orderBy:{
            name:'asc'
        }
    })
    if(!category) throw new HttpError(404,"Category not found");
    return category
}

export async function create(userId:string,name:string){
   try{
       await prisma.category.create({
        data:{
            userId,
            name
        }
    })
    return {success:true, message:"Category created sucessfully"}
   }catch(error){
      console.log(error)
      if(isUniqueViolation(error) ) throw new HttpError(409,"Category already exist")
      throw new HttpError(400,"An Error occured")
   }
}

export async function remove(userId:string,id:string){
   await getOwned(userId,id)
    await prisma.category.delete({ where:{id } })
    return {success:true, message:"Category deleted sucessfully"}

}

export async function update(userId:string,id:string,name:string){
    await getOwned(userId,id)
  
  const updatedCategroy =  await prisma.category.update({
        where:{
            id,
        },
        data:{
            name
        }
    })
    return {success:true, message:"Category updated sucessfully", updatedCategroy}
}