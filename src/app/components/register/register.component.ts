import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class RegisterComponent {
  username = '';
  password = '';
  role = 'patient'; // Domyślna rola

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.username || !this.password || !this.role) {
      console.error('All fields are required!');
      return;
    }
  
    this.authService.register({ username: this.username, password: this.password, role: this.role }).subscribe(
      (response: any) => {
        console.log('Registration successful:', response);
        alert(`Your ${this.role === 'doctor' ? 'Doctor' : 'Patient'} ID is: ${response.id}`); // Pokaż ID użytkownika
        this.router.navigate(['/login']);
      },
      (error) => console.error('Registration failed:', error)
    );
  }
  
}
