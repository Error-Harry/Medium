import { useBlogs } from "../hooks";
import BlogCard from "../components/BlogCard";
import { Skeleton } from "../components/Skeleton";

function Blogs() {
  const { loading, blogs, setRefresh } = useBlogs();

  const publishedBlogs = blogs.filter((blog) => blog.published);

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
          {publishedBlogs.length > 0 ? (
            publishedBlogs.map((blog) => (
              <BlogCard
                id={blog.id}
                key={blog.id}
                authorName={blog.author.name}
                authorEmail={blog.author.email}
                title={blog.title}
                content={blog.content}
                createdAt={blog.createdAt}
                published={blog.published}
                setRefresh={setRefresh}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 text-2xl font-semibold my-20">
              No published blogs available.
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Blogs;
