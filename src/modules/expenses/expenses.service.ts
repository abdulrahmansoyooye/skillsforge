import { promise, type lte } from "zod";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/httpError.js";
import * as categories from "../categories/categories.service.js";
import type { listExpensesQuery } from "./expenses.schema.js";
type ExpenseInput = {
  title: string;
  amount: number;
  date: Date;
  paymentMethod: "CASH" | "CARD" | "TRANSFER" | "OTHER";
  categoryId?: string | null ;
};
export async function summary(userId: string, month?:string) {
  const where = {
    userId,
    ...(month && {
      date:{
        gte:month,
        lt:month
      }
    })
  };

  const [totals, groups] = await Promise.all([
    prisma.expense.aggregate({ where, _sum: { amount: true }, _count: true }),
    prisma.expense.groupBy({
      by: "categoryId",
      where,
      _sum: { amount: true },
      _count: true,
      orderBy:{
        _sum:{amount:'desc'}
      }
    }),
  ]);
   const ids = groups.map((g)=>g.categoryId).filter((id)=> id !== null);
   const cats = await prisma.category.findMany({
    where:{userId, id:{in:ids}},
    select:{id:true,name:true}
   })
  const names=new Map(cats.map((c)=>[c.id,c.name]))
 return{
  month:month ?? null,
  totalSpent: totals._sum.amount?.toString() ?? "0",
  expenseCount:totals._count,
  byCategory:groups.map((g)=>({
    categoryId:g.categoryId,
    categoryName: g.categoryId ? names.get(g.categoryId) : "Uncategorized",
    total:g._sum.amount?.toString() ?? "0",
    count:g._count
  }))
 }

  
}
export async function list(userId: string, q: listExpensesQuery) {
  const where = {
    userId,
    ...(q.category && { categoryId: q.category }),
    ...(q.paymentMethod && { paymentMethod: q.paymentMethod }),
    ...((q.from || q.to) && {
      date: {
        ...(q.from && { gte: q.from }),
        ...(q.to && { lte: q.to }),
      },
    }),
  };
  const [data, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: [{ [q.sortBy]: q.order }, { id: "asc" }],
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: { category: { select: { id: true, name: true } } },
    }),
    prisma.expense.count({ where }),
  ]);
  return {
    data,
    meta: {
      total,
      page: q.page,
      limit: q.limit,
      totalPages: Math.ceil(total / q.limit),
    },
  };
}

export async function getOwned(userId: string, id: string) {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!expense) throw new HttpError(404, "Expense not found");
  return expense;
}


export async function create(userId: string, data: ExpenseInput) {
  if (data.categoryId) await categories.getOwned(userId, data.categoryId);
  return prisma.expense.create({ data: { ...data, userId } });
}

export async function update(userId: string, data: Partial<ExpenseInput>, id: string) {
  await getOwned(userId, id);
  if (data.categoryId) await categories.getOwned(userId, data.categoryId);
  return prisma.expense.update({ where: { id }, data });
}


export async function remove(userId: string, id: string) {
  await getOwned(userId, id);

  return prisma.expense.delete({ where: { id } });
}
