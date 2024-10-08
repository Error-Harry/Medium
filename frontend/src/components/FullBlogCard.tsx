import { useEffect, useState } from "react";
import { BlogWithoutId } from "../hooks";
import { Avatar } from "./BlogCard";
import axios from "axios";

function FullBlogCard({
  blog,
  blogId,
}: {
  blog: BlogWithoutId;
  blogId: string;
}) {
  const [editableTitle, setEditableTitle] = useState(blog?.title || "");
  const [editableContent, setEditableContent] = useState(blog?.content || "");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    setEditableTitle(blog?.title || "");
    setEditableContent(blog?.content || "");
  }, [blog]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/blog`,
        {
          id: blogId,
          title: editableTitle,
          content: editableContent,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setSuccessMessage("Blog updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating blog:", error);
      setSuccessMessage("Failed to update the blog.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  const handleBlur = () => {
    handleUpdate();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpdate();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <input
          type="text"
          value={editableTitle}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-4xl font-bold text-center text-gray-900 mb-4 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Title goes here"
        />
        <textarea
          value={editableContent}
          onChange={handleContentChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={10}
          className="text-lg leading-relaxed w-full border border-gray-300 rounded-md p-4 text-center focus:outline-none focus:border-blue-500"
          placeholder="Your content goes here..."
        />
      </div>
      {successMessage && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-lg shadow-md">
          {successMessage}
        </div>
      )}
      <div className="absolute bottom-8 right-8 flex items-center space-x-4 bg-white p-3 shadow-lg rounded-full">
        <Avatar name={blog?.author.name || "User"} />
        <div className="text-lg font-semibold text-gray-900">
          {blog?.author.name}
        </div>
      </div>
    </div>
  );
}

export default FullBlogCard;
