"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">Quiet Hours</Link>
        <div className="space-x-4">
          <Link href="/blocks" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          <Link href="/signup" className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Signup</Link>
        </div>
      </div>
    </nav>
  );
}
