const quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    text: "Life is 10% what happens to us and 90% how we react to it.",
    author: "Charles R. Swindoll",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
];

const Quote = () => {
  return (
    <div className="h-full flex items-center justify-center p-10 bg-white shadow-lg rounded-lg">
      <div className="max-w-xs text-center">
        <p className="text-lg italic text-gray-800 mb-4">
          "{quotes[Math.floor(Math.random() * quotes.length)].text}"
        </p>
        <p className="text-sm font-semibold text-gray-600">
          - {quotes[Math.floor(Math.random() * quotes.length)].author}
        </p>
      </div>
    </div>
  );
};

export default Quote;
