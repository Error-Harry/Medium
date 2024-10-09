import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compareSync, hashSync } from "bcrypt-edge";
import { sign, verify } from "hono/jwt";
import { signinInput, signupInput, updateUserInput } from "@error_harry/medium-validation";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.use("/auth/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  try {
    const response = await verify(authHeader, c.env.JWT_SECRET);
    if (!response.id) {
      c.status(403);
      return c.json({ msg: "Unauthorized request" }, 403);
    }
    await next();
  } catch (error) {
    c.status(401);
    return c.json({ msg: "Invalid or expired token" }, 401);
  }
});

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
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ error: "User already exists" });
    }

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
    c.status(500);
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

userRouter.post("/userinfo", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { id } = await c.req.json();

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }

    return c.json(
      {
        msg: "User details retrieved successfully",
        user: {
          email: user.email,
          name: user.name,
        },
      },
      200
    );
  } catch (error) {
    c.status(500);
    return c.json({ error: "Error while fetching user details" });
  }
});

userRouter.put("/auth/update", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updateUserInput.safeParse(body);

  if (!success) {
    c.status(400);
    return c.json({ msg: "Invalid inputs" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: body.id },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: body.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.password && { password: hashSync(body.password, 8) }),
      },
    });

    return c.json(
      {
        msg: "User updated successfully",
        user: {
          email: updatedUser.email,
          name: updatedUser.name,
        },
      },
      200
    );
  } catch (error) {
    c.status(500);
    return c.json({ error: "Error while updating user" });
  }
});

userRouter.delete("/auth/delete", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { id } = await c.req.json();
  if (!id) {
    c.status(400);
    return c.json({ error: "User ID is required" });
  }

  try {
    const deleteResponse = await prisma.$transaction([
      prisma.post.deleteMany({ where: { authorId: id } }),
      prisma.user.delete({ where: { id: id } }),
    ]);

    if (deleteResponse) {
      return c.json({ msg: "User and their posts deleted successfully" }, 200);
    }
    await prisma.$disconnect();
  } catch (error) {
    await prisma.$disconnect();
    console.error("Delete user error:", error);
    return c.json({ error: "Error while deleting user" }, 500);
  }
});
