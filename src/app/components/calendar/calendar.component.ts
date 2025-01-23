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
    private router: Router
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
  interface Slot {
    time: Date;
    booked: boolean;
    available: boolean;
    doctorId: number | null;
    patientName?: string;
  }
  
  interface DaySlots {
    date: Date;
    slots: Slot[];
  }
  
  const startWeek = startOfWeek(this.viewDate, { weekStartsOn: 1 });

  // Initialize weekly slots with default structure
  this.weeklySlots = [] as DaySlots[]; // Explicitly define the type of weeklySlots

  for (let day = 0; day < 7; day++) {
    const currentDate = addDays(startWeek, day);
    const daySlots: Slot[] = []; // Explicitly define type for daySlots

    let time = new Date(currentDate.setHours(this.startHour, 0, 0, 0));
    while (time.getHours() < this.endHour) {
      daySlots.push({
        time: new Date(time),
        booked: false,
        available: false,
        doctorId: null,
      });
      time = new Date(time.getTime() + this.timeSlotInterval * 60000); // Increment by 30 minutes
    }

    this.weeklySlots.push({
      date: currentDate,
      slots: daySlots,
    });
  }

  // Fetch availability and update weekly slots
  this.availabilityService.getAllDoctorSlots().subscribe((availability: any[]) => {
    availability.forEach((avail) => {
      const availDate = new Date(avail.date).toDateString();
      this.weeklySlots.forEach((day) => {
        if (new Date(day.date).toDateString() === availDate) {
          day.slots.forEach((slot: Slot) => {
            const matchingSlot = avail.slots.find(
              (aSlot: any) => new Date(aSlot.time).getTime() === slot.time.getTime()
            );
            if (matchingSlot) {
              slot.available = true;
              slot.doctorId = avail.doctorId;
            }
          });
        }
      });
    });
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
        this.weeklySlots = availabilities;
      });
    }
  }

  bookSlot(slot: any) {
    if (!slot.past && !slot.booked) {
      const patientId = this.authService.getUserId();
      const patientName = prompt('Enter Patient Name:');
      if (patientId && patientName) {
        this.appointmentService
          .bookAppointment({ ...slot, patientId, patientName })
          .subscribe(() => {
            slot.booked = true;
            slot.patientName = patientName;
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
    console.log('Submitting availability:', availability); // Loguj dane do wysłania
    this.availabilityService.createAvailability(availability).subscribe(
      () => {
        alert('Availability successfully created.');
        this.generateWeeklySlots();
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
    let time = new Date(this.viewDate.setHours(this.startHour, 0, 0, 0)); // start at `startHour`
  
    while (time.getHours() < this.endHour) {
      slots.push(new Date(time)); // Add the time to the slots array
      time = new Date(time.getTime() + this.timeSlotInterval * 60000); // Increment by `timeSlotInterval` minutes
    }
  
    return slots;
  }
  

  getSlotPatientName(day: any, slotTime: Date): string | null {
    const slot = day.slots.find((s: any) => s.time.getTime() === slotTime.getTime());
    return slot?.patientName || null;
  }
  
  canBookSlot(day: any, slotTime: Date): boolean {
    const slot = day.slots.find((s: any) => s.time.getTime() === slotTime.getTime());
    return slot && !slot.booked && !slot.past;
  }
  bookSlotIfAvailable(day: any, slotTime: Date) {
    const slot = day.slots.find((s: any) => s.time.getTime() === slotTime.getTime());
    if (this.canBookSlot(day, slotTime)) {
      this.bookSlot(slot);
    }
  }
  getSlot(day: any, timeSlot: Date): any {
   

    if (!day || !day.slots) {
      return null; // Return null if day or slots are undefined
    }
    return day.slots.find((s: any) => new Date(s.time).getTime() === timeSlot.getTime()) || null;
    }
  
    openBookingForm(slot: any): void {
      console.log('Opening booking form for slot:', slot); // Debug log
      this.router.navigate(['/booking'], {
        queryParams: { slot: JSON.stringify(slot) },
      });
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
      });
    }
    
    cancelBooking(): void {
      this.selectedSlot = null; // Ukryj formularz
    }
    
  
}

