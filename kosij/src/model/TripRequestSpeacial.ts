/* eslint-disable @typescript-eslint/no-explicit-any */
import { KoiVariety } from "./KoiVariety";

export type TripRequestScpeacial = {
  tripBookingId: number;
  numberOfPassengers: number;
  nights: number;
  departureDate: string;
  departurePoint: string;
  affordableBudget: number;
  nameContact: string;
  emailContact: string;
  phoneContact: string;
  note: string;
  requestStatus: string;
  modifiedNote: string;
  feedback: string;
  customerAccountId: string;
  customerUserName: string;
  customerFullName: string;
  tripRequestVariety: KoiVariety[];
  customizedTripResponse: {
    id: any;
  };
  quotationResponse?: {
    quotationDetail?: {
      ageGroup?: string;
      quantity?: number;
      unitPrice?: number;
      totalAmount?: number;
    }[];
    totalAmountPreDiscount?: number;
    discountPercentage?: string;
    discountAmount?: number;
    totalAmountAfterDiscount?: number;
    visaDetail?: {
      quantity?: number;
      unitPrice?: number;
    };
    grandTotalAmount?: number;
  };
};
