import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
interface Blog {
  content: string;
  title: string;
  id: string;
  author: {
    id: string;
    name: string;
  };
}

export type BlogWithoutId = Omit<Blog, "id">;

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setBlogs(res.data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch blogs:", error);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    blogs,
  };
};

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogWithoutId>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setBlog(res.data.blog);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch blog:", error);
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    blog,
  };
};
