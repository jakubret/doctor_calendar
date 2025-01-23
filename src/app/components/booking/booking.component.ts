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
    this.route.queryParams.subscribe((params) => {
      const slotData = params['slot'];
      if (slotData) {
        this.slot = JSON.parse(slotData); // Parsujemy dane slotu z queryParams
      }
    });
  }

  confirmBooking() {
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
