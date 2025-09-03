import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="btn">
        Return to Home
      </Link>
    </div>
  );
}





