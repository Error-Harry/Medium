import { useParams } from "react-router-dom";
import { Blog as BlogType, useBlog } from "../hooks";
import FullBlogCard from "../components/FullBlogCard";
import { SkeletonLoader } from "../components/Skeleton";

function BlogPage() {
  const { id } = useParams();
  const { loading, blog } = useBlog({ id: id || "" });

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <FullBlogCard blog={blog as BlogType} blogId={id || ""} />
      )}
    </>
  );
}

export default BlogPage;
