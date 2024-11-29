import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/https-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIResponse } from "@/types/global";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json({ succes: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIResponse;
  }
}

// create user
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User alredy exists");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error("Username alredy exists");
    }
    const newUser = await User.create(validatedData.data);

    return NextResponse.json({ succes: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIResponse;
  }
}
