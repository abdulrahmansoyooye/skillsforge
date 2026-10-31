import z from "zod";

export const categoryScehma = z.object({
    name:z.string().trim().min(1).max(50)
})

