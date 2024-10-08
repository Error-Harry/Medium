import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { createBlogInput } from "@error_harry/medium-validation";

function Publish() {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validation = createBlogInput.safeParse(formData);

    if (!validation.success) {
      const errorMessages = validation.error.errors.map((err) => err.message);
      setErrorMessage(errorMessages.join(", "));
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/blog`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setSuccessMessage(response.data.msg);
      setFormData({ title: "", content: "" });

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.msg || "Error creating blog post");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Create Blog Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="text-2xl font-bold text-center text-gray-900 mb-4 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Title goes here"
            />
          </div>
          <div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="text-lg leading-relaxed w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:border-blue-500"
              placeholder="Your content goes here..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Publish
          </button>
        </form>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        {successMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-lg shadow-md">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default Publish;
