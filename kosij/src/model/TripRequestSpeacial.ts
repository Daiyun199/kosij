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
  listKoiVarietyRequests: KoiVariety[];
  customizedTripResponse: {
    id: any;
  };
};
