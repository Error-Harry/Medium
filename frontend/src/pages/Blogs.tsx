import BlogCard from "../components/BlogCard";
import { useBlogs } from "../hooks";

function Blogs() {
  const { loading, blogs } = useBlogs();
  console.log(blogs);
  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {blogs &&
            blogs.map((blog, index) => (
              <BlogCard
                key={index}
                authorName={blog.author.name}
                title={blog.title}
                content={blog.content}
                publishedDate={"today"}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default Blogs;
