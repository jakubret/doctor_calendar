import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Availability } from '../models/availability.model';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private apiUrl = 'http://127.0.0.1:5000/api/availability';
  private api1 = 'http://127.0.0.1:5000/api';
  constructor(private http: HttpClient) {}

  getAvailability(doctorId: number): Observable<Availability[]> {
    const token = localStorage.getItem('token');

    return this.http.get<Availability[]>(`${this.apiUrl}/${doctorId}`,
      {      headers: { Authorization: `Bearer ${token}` },
    }
    );
  }

  createAvailability(availability: Availability): Observable<Availability> {
    
    const token = localStorage.getItem('token'); // Pobierz token z localStorage
  if (!token) {
    throw new Error('Token is missing');
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
    
    console.log('Sending availability to backend:', availability); // Loguj dane przed wysłaniem
    return this.http.post<Availability>(this.apiUrl, availability, { headers });
  }
  

  getWeeklySlots(date: Date): Observable<any[]> {
    const params = { date: date.toISOString() };
    return this.http.get<any[]>(`${this.apiUrl}/weekly-slots`, { params });
  }


  getDoctorSlots(doctorId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/slots/${doctorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  
  getAllDoctorSlots(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token is missing.');
    }
    return this.http.get<any[]>(`${this.api1}/all-slots`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  
  
}

