import { useParams } from "react-router-dom";
import { BlogWithoutId, useBlog } from "../hooks";
import FullBlogCard from "../components/FullBlogCard";
import { SkeletonLoader } from "../components/Skeleton";

function Blog() {
  const { id } = useParams();
  const { loading, blog } = useBlog({ id: id || "" });

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <FullBlogCard blog={blog as BlogWithoutId} blogId={id || ""} />
      )}
    </>
  );
}

export default Blog;
