import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {
  createBlogInput,
  updateBlogInput,
} from "@error_harry/medium-validation";

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
  try {
    const response = await verify(authHeader, c.env.JWT_SECRET);
    if (!response.id) {
      return c.json({ msg: "Unauthorized request" }, 403);
    }
    c.set("userId", response.id as string);
    await next();
  } catch (error) {
    return c.json({ msg: "Invalid or expired token" }, 401);
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    return c.json(
      {
        msg: "Invalid inputs",
      },
      400
    );
  }
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
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    return c.json(
      {
        msg: "Invalid inputs",
      },
      400
    );
  }
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
    const blogs = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
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
      select: {
        id: true,
        content: true,
        title: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
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

blogRouter.get("/author/:authorId", async (c) => {
  const authorId = c.req.param("authorId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany({
      where: {
        authorId: authorId,
      },
      select: {
        content: true,
        title: true,
        id: true,
        createdAt: true,
      },
    });

    if (blogs.length === 0) {
      return c.json({ msg: "No blogs found for this author" }, 404);
    }

    return c.json(
      {
        msg: "Blogs fetched successfully",
        blogs,
      },
      200
    );
  } catch (error) {
    return c.json({ msg: "Error while fetching blogs" }, 500);
  }
});

blogRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!blog) {
      return c.json({ msg: "Blog not found" }, 404);
    }

    if (blog.authorId !== authorId) {
      return c.json({ msg: "Unauthorized to delete this blog" }, 403);
    }

    await prisma.post.delete({
      where: {
        id: id,
      },
    });

    return c.json({ msg: "Blog deleted successfully" }, 200);
  } catch (error) {
    return c.json({ msg: "Error while deleting post" }, 500);
  }
});
