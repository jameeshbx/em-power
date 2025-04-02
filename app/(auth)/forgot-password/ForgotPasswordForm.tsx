// app/forgot-password/ForgotPasswordForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/actions/auth";

type FormData = {
    email: string;
};

export default function ForgotPasswordForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        const result = await forgotPassword(data.email);
        if (result.success) {
            console.log(result);
            alert("Password reset link sent to your email!");
            router.push("/login");
        } else {
            alert(result.error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full p-2 border rounded"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                Send Reset Link
            </button>
        </form>
    );
}