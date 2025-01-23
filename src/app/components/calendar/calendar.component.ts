import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AvailabilityService } from '../../services/availability.service';
import { AppointmentService } from '../../services/appointment.service';
import { addDays, startOfWeek, addMinutes, startOfDay } from 'date-fns';
import { from } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from '../booking/booking.component';
import { Appointment } from '../../models/appointment.model';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BookingComponent],
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date(); // Aktualny tydzień
  weeklySlots: any[] = []; // Sloty tygodniowe
  timeSlotInterval: number = 30; // Interwały czasowe w minutach
  startHour: number = 8; // Godzina początkowa
  endHour: number = 14; // Godzina końcowa
  selectedSlot: any = null; // Selected slot for booking
  role: string = ''; // Rola użytkownika (doctor lub patient)
  availabilityForm: any = {
    doctorId: null,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [],
    repeat: false,
  };

  constructor(
    private authService: AuthService,
    private availabilityService: AvailabilityService,
    private appointmentService: AppointmentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.role = this.authService.getUserRole();
    console.log('User Role:', this.role);
    this.generateWeeklySlots();
    if (this.role === 'doctor') {
      const roleId = this.authService.getRoleId();
      this.availabilityForm.doctorId = roleId;
      this.loadDoctorAvailability();
    } else if (this.role === 'patient') {
      console.log('Role is patient, fetching all doctor slots');
      this.availabilityService.getAllDoctorSlots().subscribe((slots) => {
        this.weeklySlots = slots;
      });
    } else {
      console.warn('Unknown role or not logged in');
    }
  }
  
  
//  generateWeeklySlots() {
//    const startWeek = startOfWeek(this.viewDate, { weekStartsOn: 1 });
//  
//    // Define the explicit type for slots
//    const slots: {
//      date: Date;
//      slots: { time: Date; booked: boolean; doctorId: string | null; patientName: string | null }[];
//    }[] = [];
//  
//    for (let day = 0; day < 7; day++) {
//      const currentDay = addDays(startWeek, day);
//  
//      // Explicitly define the type for daySlots
//      const daySlots: { time: Date; booked: boolean; doctorId: string | null; patientName: string | null }[] = [];
//      let time = startOfDay(currentDay);
//  
//      // Generate slots in intervals of `timeSlotInterval` minutes
//      while (time.getHours() < this.endHour) {
//        daySlots.push({
//          time: new Date(time),
//          booked: false,
//          doctorId: null,
//          patientName: null,
//        });
//        time = addMinutes(time, this.timeSlotInterval);
//      }
//  
//      slots.push({ date: currentDay, slots: daySlots });
//    }
//  
//    // Fetch all doctor slots and update the weekly slots
//    this.availabilityService.getAllDoctorSlots().subscribe((availability: any[]) => {
//      availability.forEach((avail) => {
//        slots.forEach((day) => {
//          if (new Date(avail.date).toDateString() === new Date(day.date).toDateString()) {
//            day.slots.forEach((slot) => {
//              const isAvailable = avail.slots.some(
//                (aSlot: any) => new Date(aSlot.time).getTime() === slot.time.getTime()
//              );
//              if (isAvailable) {
//                slot.booked = false;
//                slot.doctorId = avail.doctorId;
//              }
//            });
//          }
//        });
//      });
//  
//      this.weeklySlots = slots; // Update the component's weeklySlots property
//    });
//  }
  
generateWeeklySlots() {
  // Set the start of the week based on the current view date
  const startWeek = startOfWeek(this.viewDate, { weekStartsOn: 1 });
  const weeklySlots: any[] = [];

  // Initialize weekly structure with empty slots for each day of the week
  for (let day = 0; day < 7; day++) {
    const currentDate = addDays(startWeek, day);
    weeklySlots.push({
      date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      slots: [],
    });
  }

  // Fetch available slots from the backend
  this.availabilityService.getAllDoctorSlots().subscribe((availability: any[]) => {
    // Process each day's availability
    availability.forEach((avail) => {
      // Find the corresponding day in the weekly structure
      const day = weeklySlots.find(daySlot => daySlot.date === avail.date);

      if (day) {
        // Map each slot into the day structure
        avail.slots.forEach((slot: any) => {
          day.slots.push({
            time: new Date(slot.time).toISOString(), // Convert time to ISO string for consistency
            booked: slot.booked,
            doctorId: slot.doctorId,
            available: !slot.booked,
          });
        });
      }
    });

    // Update component state with the new weekly slots
    this.weeklySlots = weeklySlots;
    this.cdr.detectChanges(); // Trigger change detection to update the view
    console.log('Weekly slots updated:', this.weeklySlots); // Optional: Debugging output
  });
}




  

//  generateWeeklySlots() {
//    const startWeek = startOfWeek(this.viewDate, { weekStartsOn: 1 });
//    this.weeklySlots = [];
//
//    for (let day = 0; day < 7; day++) {
//      const currentDay = addDays(startWeek, day);
//      const slots = [];
//      let time = startOfDay(currentDay);
//      time = addMinutes(time, this.startHour * 60); // Rozpoczynaj od godziny startHour
//
//      while (time.getHours() < this.endHour) {
//        slots.push({
//          time: new Date(time),
//          booked: false,
//          past: time < new Date(),
//          patientName: null,
//        });
//        time = addMinutes(time, this.timeSlotInterval);
//      }
//      this.weeklySlots.push({ date: currentDay, slots });
//    }
//  }

loadDoctorAvailability() {
  const doctorId = this.authService.getUserId();
  if (doctorId) {
    this.availabilityService.getAvailability(doctorId).subscribe((availabilities) => {
      this.weeklySlots = this.generateWeeklySlotsFromAvailability(availabilities);
    });
  }
}

generateWeeklySlotsFromAvailability(availabilities: any[]): any[] {
  const startWeek = startOfWeek(this.viewDate, { weekStartsOn: 1 });
  const weeklySlots: any[] = [];

  for (let day = 0; day < 7; day++) {
    const currentDate = addDays(startWeek, day);
    const slotsForDay = availabilities.find(
      (availability) => new Date(availability.date).toDateString() === currentDate.toDateString()
    );

    const daySlots = [];
    let time = new Date(currentDate.setHours(this.startHour, 0, 0, 0));
    while (time.getHours() < this.endHour) {
      const matchingSlot = slotsForDay?.slots.find(
        (slot: any) => new Date(slot.time).getTime() === time.getTime()
      );

      daySlots.push({
        time: new Date(time),
        booked: matchingSlot ? matchingSlot.booked : false,
        doctorId: matchingSlot ? matchingSlot.doctorId : null,
        available: !!matchingSlot,
      });

      time = new Date(time.getTime() + this.timeSlotInterval * 60000);
    }

    weeklySlots.push({ date: currentDate, slots: daySlots });
  }
  console.log('Weekly Slots:', this.weeklySlots);

  return weeklySlots;
}


bookSlot(slot: any) {
  if (!slot.booked) {
    const patientId = this.authService.getUserId();
    const patientName = prompt('Enter Patient Name:');
    if (patientId && patientName) {
      this.appointmentService
        .bookAppointment({ ...slot, patientId, patientName })
        .subscribe(() => {
          alert('Appointment successfully booked!');
          slot.booked = true;
          this.cdr.detectChanges(); // Refresh the calendar
        });
    }
  }
}

  submitAvailability() {
    const doctorId = this.authService.getUserId();
    if (!doctorId) {
      console.error('Error: Doctor ID is missing or user is not logged in.');
      alert('You must be logged in as a doctor to submit availability.');
      return;
    }
  
    const role = this.authService.getUserRole();
    if (role !== 'doctor') {
      console.error('Error: Only doctors can submit availability.');
      alert('Only doctors can submit availability.');
      return;
    }
  
    const availability = { ...this.availabilityForm, doctorId };
    console.log('Submitting availability:', availability);
  
    this.availabilityService.createAvailability(availability).subscribe(
      () => {
        alert('Availability successfully created.');
        this.generateWeeklySlots(); // Odśwież kalendarz
        this.cdr.detectChanges();

        this.loadDoctorAvailability(); // Odśwież dane slotów po zapisaniu dostępności
      },
      (error) => {
        console.error('Error creating availability:', error);
        alert('Failed to create availability. Please try again.');
      }
    );
  }
  
  

  navigateWeeks(direction: number) {
    this.viewDate = addDays(this.viewDate, direction * 7);
    this.generateWeeklySlots();
    this.cdr.detectChanges();

  }

  getSlotClass(day: any, slotTime: Date): any {
    const slot = day.slots.find((s: any) => s.time.getTime() === slotTime.getTime());
    return {
      booked: slot?.booked || false,
      past: slot?.past || false,
    };
  }
  getTimeSlots(): Date[] {
  const slots: Date[] = [];
  let time = new Date(this.viewDate.setHours(this.startHour, 0, 0, 0)); // Start at `startHour`

  while (time.getHours() < this.endHour) {
    slots.push(new Date(time)); // Push time w ISO formacie
    time = new Date(time.getTime() + this.timeSlotInterval * 60000); // Increment by `timeSlotInterval`
  }

  return slots;
}

  
  
  

  getSlotPatientName(day: any, slotTime: Date): string | null {
    const slot = day.slots.find((s: any) => s.time.getTime() === slotTime.getTime());
    return slot?.patientName || null;
  }
  
  ccanBookSlot(day: any, timeSlot: Date): boolean {
    const slot = this.getSlot(day, timeSlot);
    return slot && slot.available && !slot.booked;
  }
  
  bookSlotIfAvailable(day: any, timeSlot: Date) {
    const slot = this.getSlot(day, timeSlot);
    if (slot && slot.available && !slot.booked) {
      this.bookSlot(slot);
    }
  }
 
  
  
  
  
  getSlot(day: any, timeSlot: Date): any {
    if (!day || !day.slots) {
      console.warn('Day or slots undefined:', { day, timeSlot });
      return null;
    }
  
    // Compare slot times in milliseconds to avoid ISO formatting issues
    return day.slots.find(
      (s: any) => new Date(s.time).getTime() === timeSlot.getTime()
    ) || null;
  }
  
  
  
  isSlotAvailable(day: any, timeSlot: Date): any {
    if (!day.slots) return null; // Brak slotów
    return day.slots.find((slot: any) => new Date(slot.time).toISOString() === timeSlot.toISOString()) || null;
  }
  
  
  
  
  
  
    openBookingForm(slot: any): void {
      if (slot && !slot.booked) {
        this.router.navigate(['/booking'], {
          queryParams: { slot: JSON.stringify(slot) }, // Przekazanie slotu jako queryParam
        });
      } else {
        alert('This slot is not available for booking.');
      }
    }
  
    confirmBooking(event: any): void {
      const bookingDetails: Appointment = {
        doctorId: event.slot.doctorId,
        patientId: this.authService.getUserId() as number,
        startDateTime: event.slot.time,
        endDateTime: new Date(event.slot.time.getTime() + this.timeSlotInterval * 60000),
        type: 'Consultation',
        patientName: event.patientName,
        patientGender: event.patientGender || 'Not Specified',
        patientAge: event.patientAge || 0,
        patientNotes: event.patientNotes || '',
      };
    
      this.appointmentService.bookAppointment(bookingDetails).subscribe(() => {
        alert('Appointment successfully booked!');
        this.selectedSlot.booked = true;
        this.selectedSlot = null;
        this.generateWeeklySlots();
        this.cdr.detectChanges();

      });
    }
    
    cancelBooking(): void {
      this.selectedSlot = null; // Ukryj formularz
    }
    
  
}

