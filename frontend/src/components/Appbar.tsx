import { Avatar } from "./BlogCard";

function Appbar() {
  const userName = "Harsh Nargide";

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow">
      <div className="text-lg font-bold text-gray-800">Medium | Blog App</div>
      <Avatar name={userName} />
    </div>
  );
}

export default Appbar;
