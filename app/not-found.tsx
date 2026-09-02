import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#008080] text-zinc-900 p-4">
      <div className="w-full max-w-md bg-[#c0c0c0] border-2 border-white shadow-2xl p-4">
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex items-center justify-between text-xs font-bold mb-4">
          <span>Error 404 - Page Not Found</span>
        </div>
        <div className="p-4 bg-white border border-zinc-500 mb-4 text-xs space-y-2">
          <p className="font-bold text-sm">File not found in Microsoft Clip Gallery</p>
          <p className="text-zinc-600">
            The requested resource could not be located in the 57,000+ vector clipart library.
          </p>
        </div>
        <div className="flex justify-end">
          <Link
            href="/"
            className="px-4 py-1.5 bg-[#c0c0c0] hover:bg-zinc-300 text-black border-2 border-t-white border-l-white border-b-zinc-800 border-r-zinc-800 font-bold text-xs"
          >
            Return to Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
