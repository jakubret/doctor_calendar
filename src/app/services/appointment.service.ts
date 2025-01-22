import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://127.0.0.1:5000/api/appointments';

  constructor(private http: HttpClient) {}

  bookAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, appointment);
  }

  getAppointments(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }
}

