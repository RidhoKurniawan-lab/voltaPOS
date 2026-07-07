<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_and_is_redirected_to_dashboard(): void
    {
        $user = User::factory()->create([
            'password' => 'password123',
            'role' => 'admin',
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_petugas_can_login_and_is_redirected_to_cashier_page(): void
    {
        $user = User::factory()->create([
            'password' => 'password123',
            'role' => 'petugas',
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('sales.create'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create([
            'role' => 'petugas',
        ]);

        $response = $this->actingAs($user)->post(route('logout'));

        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
