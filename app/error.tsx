'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-neutral-400 mb-8">We apologize for the inconvenience.</p>
        <button
          onClick={() => reset()}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  )
}