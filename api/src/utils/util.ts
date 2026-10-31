import z from "zod";

export const idParamScehma = z.object({
    id:z.string().uuid()
})