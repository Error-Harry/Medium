import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compareSync, hashSync } from "bcrypt-edge";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@error_harry/medium-validation";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      msg: "Invalid inputs",
    });
  }
  const hashedPassword = hashSync(body.password, 8);
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        ...(body.name && { name: body.name }),
      },
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json(
      {
        msg: "User signed up successfully",
        jwt: token,
      },
      201
    );
  } catch (error) {
    c.status(400);
    return c.json({ error: "Error while signing up" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      msg: "Invalid inputs",
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }

    if (!compareSync(body.password, user.password)) {
      c.status(401);
      return c.json({ error: "Wrong password" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ msg: "User signed in successfully", jwt: token }, 200);
  } catch (error) {
    c.status(500);
    return c.json({ error: "Error while logging in" });
  }
});
