import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Plant Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The plant you're looking for doesn't exist in our garden.
        </p>
        <Link href="/">
          <Button>Return to Plants</Button>
        </Link>
      </div>
    </div>
  );
}