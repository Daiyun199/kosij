export interface TripBookingProps {
  tripBooking: {
    id: string;
    tourName: string;
    bookingTime: string;
    tripType: string;
    departureDate: string;
    tripBookingStatus: string;
    inboundTicketUrl?: string;
    outboundTicketUrl?: string;
    paidAmount: number;
    remaining: number;
    totalAmount: number;
    cancellationReason?: string | null;
  };
}
