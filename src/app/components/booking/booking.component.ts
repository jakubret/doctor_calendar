import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class BookingComponent implements OnInit {
  slot: any = {};
  bookings: any[] = [];
  patientName: string = '';
  patientGender: string = '';
  patientAge: number | null = null;
  patientNotes: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['slot']) {
        // Make sure to decode URI component correctly
        this.slot = JSON.parse(decodeURIComponent(params['slot']));
        console.log('Slot data loaded:', this.slot); // Check what's being loaded
      } else {
        console.log('No slot data available in query params');
      }
    });
  }

  loadBookings() {
    // Fetch bookings from the service
    this.appointmentService.getBookingsForPatient().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },
      error: (error) => {
        console.error('Failed to load bookings:', error);
      }
    });
  }

  confirmBooking() {
    const bookingData = {
      doctorId: this.slot.doctorId,
      patientId: 1, // Assuming you will fetch this from user session or token
      startDateTime: new Date(this.slot.time), // Assuming slot.time is the appointment start time
      endDateTime: new Date(new Date(this.slot.time).getTime() + 30 * 60000), // End time, e.g., 30 minutes after start
      type: 'Consultation', // Assuming a default type or fetched from somewhere else
      patientName: this.patientName,
      patientGender: this.patientGender,
      patientAge: this.patientAge,
      patientNotes: this.patientNotes,
    };
  
    console.log('Booking confirmed:', bookingData);
  
    // Call the service to send data to your backend
    this.appointmentService.bookAppointment(bookingData).subscribe({
      next: (response) => {
        alert('Booking confirmed successfully!');
        this.router.navigate(['/calendar']); // Navigate back to the calendar
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
        alert('Failed to confirm booking.');
      }
    });
  }
  
  

  cancelBooking() {
    this.router.navigate(['/calendar']); // Navigate back to the calendar without booking
  }
}
