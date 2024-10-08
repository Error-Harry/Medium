import Quote from "../components/Quote";
import Auth from "../components/Auth";

function AuthPage({ type }: { type: "signup" | "signin" }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Auth type={type} />
      </div>

      <div className="hidden lg:block w-1/2">
        <Quote />
      </div>
    </div>
  );
}

export function Signin() {
  return <AuthPage type="signin" />;
}

export function Signup() {
  return <AuthPage type="signup" />;
}
