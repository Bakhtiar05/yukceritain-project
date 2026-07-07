'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Layout Error:", error);
  }, [error]);

  return (
    <div className="p-8 text-red-600 bg-red-50 border border-red-200 rounded-lg m-4">
      <h2 className="text-xl font-bold mb-4">Terjadi Kesalahan di Halaman Admin</h2>
      <p className="font-mono text-sm bg-white p-4 rounded border whitespace-pre-wrap">
        {error.message}
      </p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        onClick={() => reset()}
      >
        Coba Lagi
      </button>
    </div>
  );
}
