import { useEffect, useState } from "react";
import { Blog, useToken } from "../hooks";
import { Avatar } from "./BlogCard";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { formatPublishedDate, timeAgo } from "../utils/timeFormatter";
import { useNavigate } from "react-router-dom";

function FullBlogCard({ blog, blogId }: { blog: Blog; blogId: string }) {
  const [editableTitle, setEditableTitle] = useState(blog?.title || "");
  const [editableContent, setEditableContent] = useState(blog?.content || "");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { userId } = useToken();
  const navigate = useNavigate();

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
        `${BACKEND_URL}/api/v1/blog`,
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

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setSuccessMessage("Blog deleted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Error deleting blog:", error);
      setSuccessMessage("Failed to delete the blog.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const handlePublish = async () => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/blog/publish`,
        { id: blogId, published: !blog.published },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setSuccessMessage(
        `Blog ${blog.published ? "unpublished" : "published"} successfully!`
      );
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error(
        `Error ${blog.published ? "unpublishing" : "publishing"} blog:`,
        error
      );
      setSuccessMessage(
        `Failed to ${blog.published ? "unpublish" : "publish"} the blog.`
      );
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        {userId === blog?.author.id ? (
          <>
            <input
              type="text"
              value={editableTitle}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-4xl font-bold text-center text-gray-900 mb-4 w-full focus:outline-none focus:border-blue-500"
              placeholder="Title goes here"
            />
            <textarea
              value={editableContent}
              onChange={handleContentChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              rows={12}
              className="w-full p-4 rounded-md text-lg leading-relaxed text-gray-700 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200 resize-none"
              placeholder="Your content goes here..."
            />
          </>
        ) : (
          <div>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              {blog?.title}
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 border-t border-gray-300 mt-5">
              {blog?.content}
            </p>
          </div>
        )}
        <div className="relative flex space-x-8">
          <div className="mt-4 text-sm text-gray-500 border-t border-gray-300">
            <span className="font-semibold mr-1">Published:</span>
            <span>
              {formatPublishedDate(blog?.createdAt)} ({timeAgo(blog?.createdAt)}
              )
            </span>
          </div>

          {userId === blog?.author.id && (
            <>
              <div className="mt-4">
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete Blog
                </button>
                {showConfirmDelete && (
                  <div className="absolute mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                    <p>Are you sure you want to delete this blog?</p>
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={handleDelete}
                        className="text-green-600 hover:text-green-800"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(false)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <button
                  onClick={handlePublish}
                  className="hover:text-red-600 text-green-800"
                >
                  {blog.published ? "Unpublish" : "Publish"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {successMessage && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-lg shadow-md">
          {successMessage}
        </div>
      )}
      <div className="absolute bottom-8 right-8 flex items-center space-x-5 bg-white px-5 py-3 shadow-lg rounded-full">
        <Avatar name={blog?.author.name || "User"} />
        <div className="flex flex-col">
          <div className="text-lg font-semibold text-gray-900">
            {blog?.author.name}
          </div>
          <div className="text-sm text-gray-500">{blog?.author.email}</div>
        </div>
      </div>
    </div>
  );
}

export default FullBlogCard;
