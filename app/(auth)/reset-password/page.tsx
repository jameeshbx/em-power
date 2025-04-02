// app/reset-password/page.tsx
import ResetPasswordForm from "@/app/(auth)/reset-password/ResetPasswordForm"

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string; email?: string } }) {
    const { token, email } = searchParams;

    if (!token || !email) {
        return <div>Invalid reset link</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6">
                <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                <ResetPasswordForm token={token} email={email} />
            </div>
        </div>
    );
}