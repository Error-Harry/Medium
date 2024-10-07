function Quote() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg text-center">
        <blockquote className="text-2xl font-semibold italic text-gray-900">
          "The purpose of a writer is to keep civilization from destroying itself."
        </blockquote>
        <p className="mt-4 text-gray-500">— Albert Camus</p>
      </div>
    </div>
  );
}

export default Quote;
