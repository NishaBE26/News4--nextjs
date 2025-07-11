'use client';
import dynamic from 'next/dynamic';

// Prevents SSR issues with useSearchParams
const AddNewPostClient = dynamic(() => import('./AddNewPostClient'), {
  ssr: false,
});

export default function Page() {
  return <AddNewPostClient />;
}
