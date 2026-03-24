export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Thank You!</h1>
      <p className="text-slate-500 text-center max-w-md mb-8">
        You have been successfully added to our mailing list.
        Watch our for emails from us to know more about our research and publications
      </p>
      <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
        Go to Homepage
      </a>
    </div>
  );
}