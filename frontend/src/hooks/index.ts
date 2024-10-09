import { useEffect, useState } from "react";
import axios from "axios";
import { decodeJwt } from "jose";
import { BACKEND_URL } from "../../config";
export interface Blog {
  content: string;
  title: string;
  id: string;
  published: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

interface DecodedToken {
  id: string;
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

  return {
    loading,
    blogs,
    setRefresh,
  };
};

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();

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

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      try {
        const decoded: DecodedToken = decodeJwt(storedToken);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  return { token, userId };
};
