interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

interface AvatarProps {
  name: string;
}
function BlogCard({
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex items-start space-x-4">
        <Avatar name={authorName} />
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{authorName}</span>
            <span>· {publishedDate}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mt-1">{title}</h2>
          <p className="text-gray-700 mt-1">{content}</p>
        </div>
      </div>
      <div className="text-gray-500 text-sm mt-4">Published {"2 min ago"}</div>
    </div>
  );
}

export default BlogCard;

export const Avatar = ({ name }: AvatarProps) => {
  const avatarInitial = name.charAt(0).toUpperCase();

  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold">
      {avatarInitial}
    </div>
  );
};
