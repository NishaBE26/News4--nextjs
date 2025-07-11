'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AuthorClient = dynamic(() => import('./AuthorClient'), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense>
      <AuthorClient />
    </Suspense>
  );
}