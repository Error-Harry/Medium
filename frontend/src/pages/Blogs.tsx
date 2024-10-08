import BlogCard from "../components/BlogCard";
import { Skeleton } from "../components/Skeleton";
import { useBlogs } from "../hooks";

function Blogs() {
  const { loading, blogs } = useBlogs();
  return (
    <>
      {loading ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto mt-20 space-y-6">
          {blogs &&
            blogs.map((blog) => (
              <BlogCard
                id={blog.id}
                key={blog.id}
                authorName={blog.author.name}
                title={blog.title}
                content={blog.content}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default Blogs;
