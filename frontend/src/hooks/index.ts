import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  content: string;
  title: string;
  id: string;
  author: {
    name: string;
  };
}
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setBlogs(res.data.blogs);
        setLoading(false);
      });
  }, []);
  return {
    loading,
    blogs,
  };
};
