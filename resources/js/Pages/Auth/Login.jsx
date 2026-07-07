import GuestLayout from "@/Layout/GuestLayout";
import TextInput from "@/Components/TextInput";
import SubmitButton from "@/Components/SubmitButton";
import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const [isShow, setIsShow] = useState(true);

    const togglePassword = () => {
        setIsShow(!isShow);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <>
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                    Login ke Akun Anda
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Masukkan email dan password untuk mengakses dashboard POS.
                </p>
            </div>

            {(errors.auth || errors.email || errors.password) && (
                <div className="p-3 mb-4 border border-red-200 bg-red-50 rounded-2xl">
                    <p className="text-sm text-center text-red-700">
                        {errors.auth || errors.email || errors.password}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    icon="fas fa-envelope"
                    type="email"
                    id="email"
                    placeholder="Enter Your Email"
                    className="focus:border-emerald-600 focus:ring-emerald-600"
                />

                <TextInput
                    label="Password"
                    name="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    icon="fas fa-lock"
                    isPassword={true}
                    type={isShow ? "password" : "text"}
                    id="password"
                    isShow={isShow}
                    togglePassword={togglePassword}
                    placeholder="Enter Your Password"
                    className="focus:border-emerald-600 focus:ring-emerald-600"
                />

                <SubmitButton icon="fas fa-arrow-right" loading={processing}>
                    Login
                </SubmitButton>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-3.5 h-3.5 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-600 focus:ring-2"
                        />
                        <span className="text-xs text-slate-700">
                            Ingat saya
                        </span>
                    </label>
                    <a
                        href="#"
                        className="text-emerald-700 hover:text-emerald-600 text-xs font-medium transition-colors"
                    >
                        Lupa password?
                    </a>
                </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-500">
                    Akun baru hanya dapat dibuat oleh admin melalui dashboard
                    internal.
                </p>
                <Link
                    href={route("login")}
                    className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                    Tetap di halaman login
                </Link>
            </div>
        </>
    );
};

Login.layout = (page) => <GuestLayout children={page} />;

export default Login;
