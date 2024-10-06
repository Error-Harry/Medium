import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.split(" ")[1];

  try {
    const response = await verify(token, c.env.JWT_SECRET);
    if (!response.id) {
      c.status(403);
      return c.json({ msg: "Unauthorized request" }, 403);
    }
    c.set("userId", response.id as string);
    await next();
  } catch (error) {
    c.status(401);
    return c.json({ msg: "Invalid or expired token" }, 401);
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });
    return c.json(
      {
        msg: "Blog created successfully",
        id: blog.id,
      },
      201
    );
  } catch (error) {
    return c.json({ msg: "Error while creating post" }, 500);
  }
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json(
      {
        msg: "Blog updated successfully",
        id: blog.id,
      },
      200
    );
  } catch (error) {
    return c.json({ msg: "Error while updating post" }, 404);
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany();
    return c.json(
      {
        msg: "Blogs fetched successfully",
        blogs,
      },
      200
    );
  } catch (error) {
    return c.json({ msg: "Error while fetching posts" }, 500);
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    if (!blog) {
      return c.json({ msg: "Blog not found" }, 404);
    }
    return c.json(
      {
        msg: "Blog fetched successfully",
        blog,
      },
      200
    );
  } catch (error) {
    return c.json({ msg: "Error while fetching post" }, 500);
  }
});
