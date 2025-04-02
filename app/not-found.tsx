// app/not-found.tsx
import Link from 'next/link';
import { Metadata } from 'next';

// Define metadata for the page
export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for could not be found.',
};

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8 max-w-md mx-auto">
                {/* 404 Header */}
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

                {/* Error Message */}
                <h2 className="text-2xl font-semibold text-tcolor mb-4">
                    Oops! Page Not Found
                </h2>

                {/* Description */}
                <p className="text-muted mb-6">
                    It seems we've hit a dead end. The page you're looking for might have been moved or doesn't exist.
                </p>

                {/* Back to Home Button */}
                <Link
                    href="/"
                    className="inline-block bg-accent text-tcolor font-medium py-2 px-6 rounded-lg hover:bg-secondary transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;