import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import Publish from "./pages/Publish";
import Appbar from "./components/Appbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Signin, Signup } from "./pages/AuthPage";

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
      {!isAuthPage() && <Appbar />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<ProtectedRoute element={<Blogs />} />} />{" "}
        <Route
          path="/blog/:id"
          element={<ProtectedRoute element={<Blog />} />}
        />
        <Route path="/blogs" element={<ProtectedRoute element={<Blogs />} />} />
        <Route
          path="/publish"
          element={<ProtectedRoute element={<Publish />} />}
        />
      </Routes>
    </>
  );
}

export default App;
