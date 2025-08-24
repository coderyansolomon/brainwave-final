'use client';

import { useFormStatus } from 'react-dom';

export default function ConfirmButton({
  children,
  confirmText = 'Are you sure?',
  className = '',
}) {
  const { pending } = useFormStatus();

  const onClick = (e) => {
    if (pending) return;
    const ok = window.confirm(confirmText);
    if (!ok) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={pending}
      className={`${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? 'Deleting…' : children}
    </button>
  );
}
