import { Router } from "express"
import { categoryScehma } from "./categories.schema.js"
import * as service from "./categories.service.js"
import { idParamScehma } from "../../utils/util.js"
import { requireAuth } from "../../middleware/auth.js"
export const categoriesRouter = Router()

categoriesRouter.use(requireAuth)

categoriesRouter.get("/",async (req,res) => {
    const {name} = categoryScehma.parse(req.body)
    res.status(200).json(await service.list(req.user!.id))
})
categoriesRouter.get("/:id",async (req,res) => {
    const {id} = idParamScehma.parse(req.params)
    res.status(200).json(await service.getOwned(req.user!.id,id))
})
categoriesRouter.post("/",async (req,res) => {
    const {name} = categoryScehma.parse(req.body)
    res.status(201).json(await service.create(req.user!.id,name))
})


categoriesRouter.patch("/",async (req,res) => {
    const {id} = idParamScehma.parse(req.params)
    const {name} = categoryScehma.parse(req.body)
    res.status(200).json(await service.update(req.user!.id,id,name))
})


categoriesRouter.delete("/",async (req,res) => {
    const {id} = idParamScehma.parse(req.body)
    await service.remove(req.user!.id,id)
    res.status(204)
})
