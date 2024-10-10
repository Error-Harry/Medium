import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import Publish from "./pages/Publish";
import Appbar from "./components/Appbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Signin, Signup } from "./pages/AuthPage";
import MyBlogs from "./pages/MyBlogs";
import Profile from "./pages/Profile";
import { SearchProvider } from "./context/SearchContext";

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

function Main() {
  const location = useLocation();

  const isAuthPage = () => {
    return location.pathname === "/signup" || location.pathname === "/signin";
  };

  return (
    <>
      <SearchProvider>
        {!isAuthPage() && <Appbar />}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/"
            element={<ProtectedRoute element={<Blogs />} />}
          />{" "}
          <Route
            path="/blog/:id"
            element={<ProtectedRoute element={<Blog />} />}
          />
          <Route
            path="/blogs"
            element={<ProtectedRoute element={<Blogs />} />}
          />
          <Route
            path="/publish"
            element={<ProtectedRoute element={<Publish />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/my-blogs"
            element={<ProtectedRoute element={<MyBlogs />} />}
          />
        </Routes>
      </SearchProvider>
    </>
  );
}

export default App;
