<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'auth' => 'Incorrect email or password.',
            ]);
        }
        $request->session()->regenerate();

        $redirectTo = $request->user()->role === 'admin'
            ? route('dashboard')
            : route('sales.create');

        return redirect()->intended($redirectTo)->with('success', 'You have successfully logged in.');
    }

    public function showRegister()
    {
        abort_unless(Auth::check() && Auth::user()->role === 'admin', 403, 'Unauthorized action.');

        return Inertia::render('Auth/Register');
    }

    public function register(RegisterRequest $request)
    {
        abort_unless(Auth::check() && Auth::user()->role === 'admin', 403, 'Unauthorized action.');

        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'petugas',
        ]);

        return redirect()->route('dashboard')->with('success', 'Karyawan baru berhasil didaftarkan.');
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'You have successfully logged out.');
    }
}
