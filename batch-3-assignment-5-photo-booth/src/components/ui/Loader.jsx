const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center py-10 text-center text-gray-600 dark:text-slate-300">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 dark:border-slate-800 border-t-blue-500 mb-3"></div>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Loader;
