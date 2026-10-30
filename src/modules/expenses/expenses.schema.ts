import z from "zod";

export const paymentMethods = ["CASH", "CARD", "TRANSFER", "OTHER"] as const;
const amount = z
  .number()
  .positive()
  .max(999_999_999.99)
  .refine((n) => Math.round(n * 100) / 100 === n);

export const createExpenseSchema = z.object({
  title: z.string().trim().min(1).max(100),
  amount,
  date: z.coerce.date(),
  paymentMethod: z.enum(paymentMethods),
  catergoryId: z.string().uuid().nullable().optional(),
});

export const listExpensesSchema = z.object({
  from:z.coerce.date().optional(),
  to:z.coerce.date().optional(),
  sortBy:z.enum(["date","amount"]).default('date'),
  order:z.enum(["asc","desc"]).default('desc'),
  page:z.coerce.number().int().min(1).default(1),
  limit:z.coerce.number().int().min(1).max(100).default(100),
  paymentMethod: z.enum(paymentMethods).optional(),
  category: z.string().uuid().optional(),
})
.refine((q)=>!q.from || !q.to || q.from <= q.to,{
    message:'"from" must not be after "to"',
    path:["from"]
});

export type listExpensesQuery = z.infer<typeof listExpensesSchema>
export const updateExpenseScehma = createExpenseSchema.partial();
