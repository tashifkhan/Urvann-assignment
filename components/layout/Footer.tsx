import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Urvann</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your one-stop shop for beautiful, healthy plants that bring life
              to your space.
            </p>
            <div className="flex items-center space-x-3 mt-2 text-sm text-muted-foreground">
              <span>We deliver @:</span>
              <div className="space-x-2">
                <Link href="#" className="hover:underline">
                  Delhi
                </Link>
                <Link href="#" className="hover:underline">
                  Bangalore
                </Link>
                <Link href="#" className="hover:underline">
                  Noida
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Plants</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link
                href="#"
                className="block hover:text-primary transition-colors"
              >
                Indoor Plants
              </Link>
              <Link
                href="#"
                className="block hover:text-primary transition-colors"
              >
                Low Maintenance Plants
              </Link>
              <Link
                href="#"
                className="block hover:text-primary transition-colors"
              >
                Flowering Plants
              </Link>
              <Link
                href="#"
                className="block hover:text-primary transition-colors"
              >
                Succulents
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Help</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link
                href="#"
                className="block hover:text-primary transition-colors"
              >
                Get Help
              </Link>
              <Link
                href="#"
                className="block hover:text-primary transition-colors"
              >
                Shipping
              </Link>
              <Link
                href="#"
                className="block hover:text-primary transition-colors"
              >
                Returns
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to get Email Updates!
            </p>
            <form className="flex items-center space-x-2 mt-2">
              <input
                aria-label="Email"
                placeholder="Email"
                className="px-3 py-2 rounded border border-border bg-input text-foreground text-sm w-full"
              />
              <button className="bg-primary text-primary-foreground px-3 py-2 rounded text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Urvann Mini Store. Built for plant lovers.</p>
        </div>
      </div>
    </footer>
  );
}
