/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TripData {
  requestId: any;
  id: string;
  tripType: string;
  departureDate: string;
  returnDate: string;
  maxGroupSize: number;
  minGroupSize: number;
  availableSlot: number;
  daysRemaining: number;
  pricingRate: string;
  registrationDaysBefore: number;
  registrationConditions: string;
  averageRating: number;
  tourStatus: string;
  salesStaffName: string;
  consultingStaffName: string;
  price: {
    adult: string;
    children1_11: string;
    children12_plus: string;
  };
  visaFee: number;
  tripStatus: string;
  tour: {
    title: string;
    tourCode?: string;
    duration: string;
    type?: string;
    imageUrl: string;
    departurePoint: string;
    destinationPoint: string;
    tourPriceIncludes: string[];
    tourPriceNotIncludes: string[];
    cancelPolicy: string;
    depositPolicy: string;
    promotionPolicy: string;
    itinerary: {
      day: number;
      itineraryName: string;
      itineraryDetails: {
        time: string;
        description: string;
        farmId: number | null;
        name: string | null;
      }[];
    }[];
  };
  customers: {
    tripBookingId: string;
    customerName: string;
    email: string;
    phoneNumber: string;
  };
  notes: {
    userName: string;
    note: string;
  };
}
