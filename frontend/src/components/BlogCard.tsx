import { Link, useLocation } from "react-router-dom";
import { timeAgo, formatPublishedDate } from "../utils/timeFormatter";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useState, useEffect, useRef } from "react";

interface BlogCardProps {
  id: string;
  authorName: string;
  authorEmail: string;
  title: string;
  content: string;
  createdAt: string;
  published: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AvatarProps {
  name: string;
  onClick?: () => void;
}

export const Avatar = ({ name, onClick }: AvatarProps) => {
  const avatarInitial = name.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-semibold cursor-pointer shadow-md"
    >
      {avatarInitial}
    </div>
  );
};

function BlogCard({
  id,
  authorName,
  authorEmail,
  title,
  content,
  createdAt,
  published,
  setRefresh,
}: BlogCardProps) {
  const location = useLocation();
  const isMyBlogsRoute = location.pathname.includes("my-blogs");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        confirmationRef.current &&
        !confirmationRef.current.contains(event.target as Node)
      ) {
        setShowConfirmDelete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handlePublish = async () => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/blog/publish`,
        { id, published: !published },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(
        `Error ${published ? "unpublishing" : "publishing"} blog:`,
        error
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between h-full">
      <Link to={`/blog/${id}`} className="flex-1">
        {isMyBlogsRoute ? (
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        ) : (
          <>
            <div className="flex items-start space-x-4">
              <Avatar name={authorName} />
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-bold text-gray-800">{authorName}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">
                    {authorEmail}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mt-2">
                  {title}
                </h2>
                <p className="text-gray-700 mt-1">
                  {content.length > 200
                    ? `${content.slice(0, 200)}...`
                    : content}
                </p>
              </div>
            </div>
          </>
        )}
      </Link>
      <div className="mt-4 text-sm text-gray-500">
        <span className="font-semibold mr-1">Published:</span>
        <span>
          {formatPublishedDate(createdAt)} ({timeAgo(createdAt)})
        </span>
      </div>
      {isMyBlogsRoute && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setShowConfirmDelete((prev) => !prev)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
          <button
            onClick={handlePublish}
            className="text-green-600 hover:text-green-800"
          >
            {published ? "Unpublish" : "Publish"}
          </button>
        </div>
      )}
      {showConfirmDelete && (
        <div
          ref={confirmationRef}
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-48"
        >
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
  );
}

export default BlogCard;
