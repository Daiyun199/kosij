/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Feedback {
  id: number;
  tripBookingId: number;
  farmId: number;
  customerName: string;
  customerAvatar: string;
  feedbackType: string;
  rating: number;
  review: string;
}
export interface TourData {
  id: any;
  title: string;
  tourCode: string;
  duration: string;
  type: string;
  price: { adult: string; children1_11: string; children12_plus: string };
  departurePoints: string;
  tourStatus: string;
  destinationPoints: string;
  itinerary: string[];
  tripList: { id: string; departureDate: string }[];
  imageUrl: string;
  tourPriceIncludes: string[];
  tourPriceNotIncludes: string[];
  cancelPolicy: string;
  depositPolicy: string;
  promotionPolicy: string;
  numberOfTrips: number;
  isDeleted: boolean;
  feedbacks: Feedback[];
}
