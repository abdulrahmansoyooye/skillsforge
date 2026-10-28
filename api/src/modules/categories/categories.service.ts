import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/httpError.js"

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
     return await prisma.category.create({
        data:{
            userId,
            name
        }
    })
   }catch(e){
      throw new HttpError(400,"An Error Occured")
   }
}

export async function remove(userId:string,id:string){
   await getOwned(userId,id)
   return await prisma.category.delete({ where:{id } })
}

export async function update(userId:string,id:string,name:string){
    await getOwned(id,userId)
  
   return await prisma.category.update({
        where:{
            id,
            
        },
        data:{
            name
        }
    })
}