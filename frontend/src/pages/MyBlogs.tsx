import { useBlogs, useToken } from "../hooks";
import BlogCard from "../components/BlogCard";
import { Skeleton } from "../components/Skeleton";

function MyBlogs() {
  const { loading, blogs, setRefresh } = useBlogs();
  const { userId } = useToken();

  const myblogs = blogs.filter((blog) => blog.author.id === userId);

  return (
    <>
      {loading ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myblogs.length > 0 ? (
            myblogs.map((blog) => (
              <BlogCard
                id={blog.id}
                key={blog.id}
                authorName={blog.author.name}
                authorEmail={blog.author.email}
                title={blog.title}
                content={blog.content}
                published={blog.published}
                createdAt={blog.createdAt}
                setRefresh={setRefresh}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 text-2xl font-semibold my-20">
              No published blogs available.
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MyBlogs;
