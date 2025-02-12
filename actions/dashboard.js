"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Decimal } from "@prisma/client/runtime/library";

// export enum AccountType {
//   CURRENT = "CURRENT",
//   SAVINGS = "SAVINGS",
// }

// interface DataProps {
//   name: string;
//   balance: number;
//   isDefault: boolean;
//   type: AccountType;
// }

export async function createAccount(data) {
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

    // Convert balance to float before saving
    const balanceFloat = new Decimal(data.balance);

    const existingAccount = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const shouldBeDefault =
      existingAccount.length === 0 ? true : data.isDefault;

    // if this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        name: data.name,
        userId: user.id,
        type: data.type,
        balance: data.balance,
        isDefault: shouldBeDefault,
      },
    });
    return account
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export async function getUserAccount(){
  const {userId} = await auth();
  if(!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const accounts = db.account.findMany({
      where:{
        userId: user.id
      },
      orderBy:{createdAt : "desc"},
      include: {
        _count:{
          select:{
            transactions: true
          }
        }
      }
    })

    return accounts
}