export interface Appointment {
    doctorId: number;
    patientId: number;
    startDateTime: Date;
    endDateTime: Date;
    type: string;
    patientName: string;
    patientGender: string;
    patientAge: number;
    patientNotes: string;
  }
  