export interface Passenger {
  id: number;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  nationality: string;
  email: string;
  phoneNumber: string;
  passport: string;
  ageGroup: string;
  isRepresentative: boolean;
  hasVisa: boolean;
  tripBookingId: number;
  tripBookingStatus: string;
  isCheckIn: boolean;
  isCheckOut: boolean;
}
