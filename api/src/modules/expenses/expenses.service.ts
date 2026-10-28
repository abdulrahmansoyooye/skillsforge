import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../utils/httpError.js";
import * as categories from "../categories/categories.service.js";
import type { listExpensesQuery } from "./expenses.schema.js";
type ExpenseInput = {
  title: string;
  amount: number;
  date: Date;
  paymentMethod: "CASH" | "CARD" | "TRANSFER" | "OTHER";
  categoryId?: string | null | undefined;
};
export async function summary(userId: string) {
  const where = {
    userId,
  };

  const [total, group] = await Promise.all([
    prisma.expense.aggregate({ where, _sum: { amount: true }, _count: true }),
    prisma.expense.groupBy({
      by: "categoryId",
      where,
      _sum: { amount: true },
      _count: true,
    }),
  ]);


  
}
export async function list(userId: string, q: listExpensesQuery) {
  const where = {
    userId,
    ...(q.category && { categoryId: q.category }),
    ...(q.paymentMethod && { paymentMethod: q.paymentMethod }),
    ...((q.from || q.to) && {
      date: {
        ...(q.from && { gte: q.from }),
        ...(q.to && { gte: q.to }),
      },
    }),
  };
  const [data, total] = await prisma.$transaction([
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

export async function update(userId: string, data: ExpenseInput, id: string) {
  await getOwned(userId, id);
  if (data.categoryId) await categories.getOwned(userId, data.categoryId);
  return prisma.expense.update({ where: { id }, data });
}

export async function remove(userId: string, id: string) {
  await getOwned(userId, id);

  return prisma.expense.remove({ where: { userId } });
}
