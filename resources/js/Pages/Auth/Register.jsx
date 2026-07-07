import GuestLayout from "@/Layout/GuestLayout";
import TextInput from "@/Components/TextInput";
import SubmitButton from "@/Components/SubmitButton";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

const Register = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        role: "petugas",
        password: "",
        password_confirmation: "",
    });

    const [isShow, setIsShow] = useState(true);

    const togglePassword = () => {
        setIsShow(!isShow);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <>
            {(errors.auth ||
                errors.email ||
                errors.password ||
                errors.name) && (
                <div className="p-2 mb-3 mt-2 border border-red-200 bg-red-50 rounded-xl">
                    <p className="text-xs text-center text-red-700">
                        {errors.auth ||
                            errors.email ||
                            errors.password ||
                            errors.name}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <TextInput
                    label="Nama Lengkap"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    icon="fas fa-user"
                    type="text"
                    id="name"
                    placeholder="Masukkan nama lengkap Anda"
                    className="focus:border-emerald-600 focus:ring-emerald-600"
                />

                {/* Email */}
                <TextInput
                    label="Email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    icon="fas fa-envelope"
                    type="email"
                    id="email"
                    placeholder="Masukkan email Anda"
                    className="focus:border-emerald-600 focus:ring-emerald-600"
                />

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Role
                    </label>
                    <div className="relative">
                        <i className="fas fa-user-shield absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <select
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none"
                        >
                            <option value="petugas">Petugas / Kasir</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {errors.role && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.role}
                        </p>
                    )}
                </div>

                {/* Password */}
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
                    placeholder="Masukkan password Anda"
                    className="focus:border-emerald-600 focus:ring-emerald-600"
                />

                {/* Confirm Password */}
                <TextInput
                    label="Konfirmasi Password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    icon="fas fa-check-circle"
                    isPassword={true}
                    type={isShow ? "password" : "text"}
                    id="password_confirmation"
                    isShow={isShow}
                    togglePassword={togglePassword}
                    placeholder="Konfirmasi password Anda"
                    className="focus:border-emerald-600 focus:ring-emerald-600"
                />

                {/* Register Button */}
                <SubmitButton
                    icon="fas fa-user-plus"
                    loading={processing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Daftar
                </SubmitButton>

                {/* Login Link */}
                <div className="flex items-center justify-center text-sm">
                    <p className="text-slate-600 text-xs">
                        Sudah punya akun?
                        <Link
                            href={route("login")}
                            className="text-emerald-600 hover:text-emerald-700 font-semibold ml-1 transition-colors"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
};

Register.layout = (page) => <GuestLayout children={page} />;

export default Register;
