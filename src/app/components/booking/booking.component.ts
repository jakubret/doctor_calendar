import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  slot: any = {};
  patientName: string = '';
  patientGender: string = '';
  patientAge: number | null = null;
  patientNotes: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const slotData = this.route.snapshot.queryParams['slot'];
    this.slot = slotData ? JSON.parse(slotData) : {};
  }

  confirmBooking() {
    // Wykonanie akcji potwierdzającej rezerwację
    console.log('Rezerwacja zatwierdzona:', {
      slot: this.slot,
      patientName: this.patientName,
      patientGender: this.patientGender,
      patientAge: this.patientAge,
      patientNotes: this.patientNotes,
    });

    alert('Rezerwacja zakończona sukcesem!');
    this.router.navigate(['/']); // Powrót do kalendarza
  }

  cancelBooking() {
    this.router.navigate(['/']); // Powrót do kalendarza bez zapisania
  }
}
