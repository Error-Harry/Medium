import Quote from "../components/Quote";
import Auth from "../components/Auth";

function Signin() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Auth type="signin" />
      </div>

      <div className="hidden lg:block w-1/2">
        <Quote />
      </div>
    </div>
  );
}

export default Signin;
