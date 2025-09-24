import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { appConfig } from '../config/app.config';

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'stadium_map_auth_token';
  private readonly TOKEN_EXPIRY_KEY = 'stadium_map_token_expiry';
  private readonly TOKEN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  /**
   * Generate a random authentication token
   */
  private generateToken(): string {
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const extraRandom = Math.random().toString(36).substring(2, 15);
    return btoa(`${timestamp}_${randomPart}_${extraRandom}`).replace(/[+/=]/g, '');
  }

  /**
   * Check if user is currently authenticated
   */
  private checkAuthStatus(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (token && expiry) {
      const now = Date.now();
      const tokenExpiry = parseInt(expiry, 10);

      if (now < tokenExpiry) {
        this.isAuthenticatedSubject.next(true);
      } else {
        this.clearAuth();
      }
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * Authenticate user with credentials
   */
  login(credentials: LoginCredentials): boolean {
    const { username, password } = credentials;

    // Check against app config credentials
    if (username === appConfig.authUsername && password === appConfig.authPassword) {
      const token = this.generateToken();
      const expiry = Date.now() + this.TOKEN_DURATION;

      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toString());

      this.isAuthenticatedSubject.next(true);
      return true;
    }

    return false;
  }

  /**
   * Logout user and clear authentication
   */
  logout(): void {
    this.clearAuth();
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Clear authentication data from localStorage
   */
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Get current authentication status
   */
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if token is valid and not expired
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
      return false;
    }

    const now = Date.now();
    const tokenExpiry = parseInt(expiry, 10);

    return now < tokenExpiry;
  }
}
