// app/reset-password/ResetPasswordForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/actions/auth";

type FormData = {
    password: string;
    confirmPassword: string;
};

export default function ResetPasswordForm({ token, email }: { token: string; email: string }) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const result = await resetPassword(email, token, data.password);
        if (result.success) {
            alert("Password reset successfully!");
            router.push("/login");
        } else {
            alert(result.error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="password" className="block text-sm font-medium">
                    New Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                    className="w-full p-2 border rounded"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", { required: "Please confirm your password" })}
                    className="w-full p-2 border rounded"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                Reset Password
            </button>
        </form>
    );
}