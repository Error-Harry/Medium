import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  authorName: string;
  title: string;
  content: string;
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

function BlogCard({ id, authorName, title, content }: BlogCardProps) {
  const titleLimit = 50;
  const contentLimit = 200;

  const truncatedTitle =
    title.length > titleLimit ? `${title.slice(0, titleLimit)}...` : title;
  const truncatedContent =
    content.length > contentLimit
      ? `${content.slice(0, contentLimit)}...`
      : content;

  return (
    <Link to={`/blog/${id}`}>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start space-x-4">
          <Avatar name={authorName} />
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{authorName}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mt-2">
              {truncatedTitle}
            </h2>
            <p className="text-gray-700 mt-1">{truncatedContent}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
