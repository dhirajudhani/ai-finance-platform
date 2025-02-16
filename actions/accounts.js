"use server"

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
  if (!obj) return obj;
  
  const serialized = { ...obj };
  
  // Convert known Decimal fields to numbers
  if (obj.amount) serialized.amount = obj.amount.toNumber();
  if (obj.balance) serialized.balance = obj.balance.toNumber();
  
  // Handle nested transactions if they exist
  if (obj.transactions) {
    serialized.transactions = obj.transactions.map(serializeDecimal);
  }
  
  return serialized;
};

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db.account.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });

    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id
      },
      data: { isDefault: true }
    });

    revalidatePath('/dashboard');

    return { 
      success: true, 
      data: serializeDecimal(account)
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAccountWithTransaction(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id
      },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },
        _count: {
          select: { transactions: true }
        }
      }
    });

    if (!account) {
      return null;
    }

    return serializeDecimal(account);
  } catch (error) {
    throw new Error(error.message);
  }
}