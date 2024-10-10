import { useBlogs } from "../hooks";
import BlogCard from "../components/BlogCard";
import { Skeleton } from "../components/Skeleton";
import { useSearch } from "../context/SearchContext";
import Pagination from "../components/Pagination";
import { useState } from "react";

function Blogs() {
  const { loading, blogs, setRefresh } = useBlogs();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const { searchQuery } = useSearch();

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.published &&
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
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
        <div className="max-w-3xl mx-auto mt-20 space-y-6">
          {paginatedBlogs.length > 0 ? (
            paginatedBlogs.map((blog) => (
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
      {paginatedBlogs.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </>
  );
}

export default Blogs;
