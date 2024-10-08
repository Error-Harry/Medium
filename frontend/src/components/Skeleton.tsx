export const Skeleton = () => {
  return (
    <div className="bg-white p-6 mt-20 rounded-lg shadow animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg border border-gray-200 animate-pulse">
        <div className="h-10 bg-gray-300 rounded mb-4"></div>
        <div className="h-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};
