export interface Availability {
  doctorId: number;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  repeat: boolean;
}
