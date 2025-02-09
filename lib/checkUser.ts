import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Get user details from Clerk
    const user = await clerkClient.users.getUser(userId);
    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: userId,
        email: user.emailAddresses[0].emailAddress,
        name,
        imageUrl: user.imageUrl,
      },
    });

    return newUser;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in checkUser:", error.message);
    } else {
      console.log("An unknown error occurred in checkUser");
    }
    return null;
  }
};