import { useBlogs, useToken } from "../hooks";
import BlogCard from "../components/BlogCard";
import { Skeleton } from "../components/Skeleton";
import { useSearch } from "../context/SearchContext";
import { useState } from "react";
import Pagination from "../components/Pagination";

function MyBlogs() {
  const { loading, blogs, setRefresh } = useBlogs();
  const { userId } = useToken();
  const { searchQuery } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const myblogs = blogs.filter(
    (blog) =>
      blog.author.id === userId &&
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(myblogs.length / blogsPerPage);
  const paginatedMyBlogs = myblogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

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
          {paginatedMyBlogs.length > 0 ? (
            paginatedMyBlogs.map((blog) => (
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
      {paginatedMyBlogs.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </>
  );
}

export default MyBlogs;
