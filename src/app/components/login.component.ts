import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="login-pattern"></div>
      </div>

      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <h1>Stadium Map</h1>
            <p>Футбольные стадионы Ташкента</p>
          </div>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="username">Имя пользователя</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                type="text"
                id="username"
                [(ngModel)]="credentials.username"
                name="username"
                placeholder="Введите имя пользователя"
                required
                class="form-input"
                [class.error]="errorMessage"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                [(ngModel)]="credentials.password"
                name="password"
                placeholder="Введите пароль"
                required
                class="form-input"
                [class.error]="errorMessage"
              >
              <button
                type="button"
                class="password-toggle"
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
              >
                <span class="toggle-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
              </button>
            </div>
          </div>

          @if (errorMessage) {
            <div class="error-message">
              <span class="error-icon">⚠️</span>
              {{ errorMessage }}
            </div>
          }

          <button
            type="submit"
            class="login-button"
            [disabled]="isLoading"
          >
            @if (isLoading) {
              <span class="button-content">
                <span class="loading-spinner"></span>
                Вход в систему...
              </span>
            } @else {
              <span class="button-content">
                <span class="button-icon">🚀</span>
                Войти в систему
              </span>
            }
          </button>
        </form>

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 50%, #388E3C 100%);
      padding: 20px;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
      position: relative;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 50%, #388E3C 100%);
      z-index: 1;
    }

    .login-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%);
      z-index: 2;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow:
        0 25px 50px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.2);
      padding: 48px;
      width: 100%;
      max-width: 600px;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .login-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }


    .login-logo h1 {
      color: #2E7D32;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .login-logo p {
      color: #4CAF50;
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      opacity: 0.8;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: #2E7D32;
      font-size: 14px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      font-size: 18px;
      z-index: 2;
      color: #4CAF50;
    }

    .password-toggle {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .password-toggle:hover {
      background: rgba(76, 175, 80, 0.1);
    }

    .password-toggle:focus {
      outline: none;
      background: rgba(76, 175, 80, 0.1);
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    .toggle-icon {
      font-size: 18px;
      color: #4CAF50;
      transition: all 0.2s ease;
    }

    .form-input {
      width: 100%;
      padding: 16px 48px 16px 48px;
      border: 2px solid #E8F5E8;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      background: #FAFAFA;
      color: #2E7D32;
      font-family: 'Poppins', sans-serif;
    }

    .form-input:focus {
      outline: none;
      border-color: #4CAF50;
      background: white;
      box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
      transform: translateY(-2px);
    }

    .form-input.error {
      border-color: #E53E3E;
      background: #FED7D7;
    }

    .form-input::placeholder {
      color: #81C784;
      font-weight: 400;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #E53E3E;
      font-size: 14px;
      font-weight: 500;
      padding: 12px 16px;
      background: #FED7D7;
      border-radius: 8px;
      border: 1px solid #FEB2B2;
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .error-icon {
      font-size: 16px;
    }

    .login-button {
      background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
      color: white;
      border: none;
      padding: 18px 32px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      margin-top: 8px;
      position: relative;
      overflow: hidden;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
      background: linear-gradient(135deg, #5CBF60 0%, #4CAF50 100%);
    }

    .login-button:active:not(:disabled) {
      transform: translateY(-1px);
    }

    .login-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .button-icon {
      font-size: 18px;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }


    @media (max-width: 480px) {
      .login-container {
        padding: 16px;
      }

      .login-card {
        padding: 32px 24px;
        max-width: 100%;
      }

      .login-logo h1 {
        font-size: 28px;
      }

      .form-input {
        padding: 14px 14px 14px 44px;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginCredentials = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    // Call serverless auth endpoint
    try {
      const success = await this.authService.login(this.credentials);
      if (success) {
        this.router.navigate(['/map']);
      } else {
        this.errorMessage = 'Неверное имя пользователя или пароль';
      }
    } catch (err) {
      this.errorMessage = 'Сбой при входе. Повторите попытку.';
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }
}
