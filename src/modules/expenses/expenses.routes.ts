import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { createExpenseSchema, listExpensesSchema } from "./expenses.schema.js"
import { idParamScehma } from "../../utils/util.js"
import * as service from "./expenses.service.js"
export const expensesRouter = Router()

expensesRouter.use(requireAuth)

expensesRouter.get("/",async (req,res) => {
    const query = listExpensesSchema.parse(req.query)
    res.status(200).json(await service.list(req.user!.id,query))
})
expensesRouter.get("/:id",async (req,res) => {
    const {id} = idParamScehma.parse(req.params)
    res.status(200).json(await service.getOwned(req.user!.id,id))
})
expensesRouter.post("/",async (req,res) => {
    const data = createExpenseSchema.parse(req.body)
    res.status(201).json(await service.create(req.user!.id,data))
})


expensesRouter.patch("/",async (req,res) => {
    const {id} = idParamScehma.parse(req.params)
    const data = createExpenseSchema.parse(req.body)
    res.status(200).json(await service.update(req.user!.id,data,id))
})


expensesRouter.delete("/",async (req,res) => {
    const {id} = idParamScehma.parse(req.body)
    await service.remove(req.user!.id,id)
    res.status(204)
})
