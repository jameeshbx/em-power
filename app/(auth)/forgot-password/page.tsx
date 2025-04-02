// app/forgot-password/page.tsx
import ForgotPasswordForm from "@/app/(auth)/forgot-password/ForgotPasswordForm"

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6">
                <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
                <ForgotPasswordForm />
            </div>
        </div>
    );
}