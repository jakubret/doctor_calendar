import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://127.0.0.1:5000/api/appointments';

  constructor(private http: HttpClient) {}

  bookAppointment(appointmentData: Appointment): Observable<Appointment> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Appointment>(`${this.apiUrl}/book`, appointmentData, { headers });
  }

  getAppointments(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

getBookingsForPatient(): Observable<any[]> {
  // This would typically make an HTTP GET request to your backend
  return this.http.get<any[]>(`${this.apiUrl}/bookings`);
}

}

