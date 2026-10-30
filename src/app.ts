import cors from "cors"
import express, { type NextFunction, type Request } from "express"
export const app = express();
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml';
import { authRouter } from "./modules/auth/auth.routes.js";
import fs from 'fs'
import path from "path";
import { categoriesRouter } from "./modules/categories/categories.routes.js";
import { expensesRouter } from "./modules/expenses/expenses.routes.js";
import morgan from 'morgan'
import { errorHanlder } from "./middleware/errorHandler.js";
import { HttpError } from "./utils/httpError.js";
app.use(cors());
app.use(express.json());
const specPath = path.join(process.cwd(),"src/docs/openapi.yml")
const spec = YAML.parse(
   fs.readFileSync( specPath,"utf-8")
)
if(!spec || typeof spec !== 'object' ||!spec.openapi){
    throw new Error(`Invalid OpenApi spec at ${specPath}: file is empty or missinf the "openapi" key`)
}
app.use("/api",swaggerUi.serve,swaggerUi.setup(spec))

app.get("/health",(_req,res)=>res.json({status:"ok"}));
app.use(morgan("dev"))
app.use("/auth",authRouter)
app.use("/categories",categoriesRouter)
app.use("/expenses",expensesRouter)
app.use((req:Request,_res,next:NextFunction)=>{
    next(new HttpError(404,`Route not found: ${req.method} ${req.originalUrl}`))
})
app.use(errorHanlder)