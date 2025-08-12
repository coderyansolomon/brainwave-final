'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({
  children,
  pendingText = 'Working…',
  className = '',
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={
        `inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium
         text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_20px_rgba(0,0,0,0.35)]
         transition focus:outline-none focus:ring-2 focus:ring-blue-400/70
         ${pending ? 'bg-blue-500/70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} ` + className
      }
    >
      {pending && (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"/>
        </svg>
      )}
      {pending ? pendingText : children}
    </button>
  );
}
