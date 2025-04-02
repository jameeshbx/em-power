// components/Loading.tsx
import { FC } from 'react'

// Define props interface for customization
interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' // Size variants
    color?: string // Tailwind color class (e.g., 'text-blue-600')
    message?: string // Optional loading message
    className?: string // Additional custom classes
}

// Loading component
export const Loading: FC<LoadingProps> = ({
    size = 'md',
    color = 'text-primary',
    message,
    className = '',
}) => {
    // Size mapping for the spinner
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    }

    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 ${className}`}
            aria-label="Loading"
        >
            {/* Spinner */}
            <div
                className={`
          ${sizeClasses[size]}
          ${color}
          animate-spin rounded-full border-4 border-t-transparent
        `}
            />
            {/* Optional message */}
            {message && <p className="text-primary text-sm md:text-base">{message}</p>}
        </div>
    )
}

// Optional: Default export with a centered full-screen variant
export const FullScreenLoading: FC<Omit<LoadingProps, 'className'>> = (props) => {
    return <Loading {...props} className="min-h-screen" />
}