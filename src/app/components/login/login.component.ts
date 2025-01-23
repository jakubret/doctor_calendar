import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      console.error('Username and password are required!');
      return;
    }
  
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role); // Zapisz rolę
        localStorage.setItem('roleId', response.roleId.toString()); // Przechowuj roleId
        this.router.navigate(['/calendar']);
      },
      (error) => console.error('Login failed:', error)
    );
  }
  logout() {
    this.authService.logout();  // Clear user token and other session data
    this.router.navigate(['/login']);  // Navigate to login page
  }
  navigateToRegister() {
    this.router.navigate(['/register']); // Ensure '/register' is the correct path as defined in your routing module
  }
  

}