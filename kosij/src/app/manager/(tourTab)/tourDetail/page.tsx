import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import TourDetail from "@/app/components/TourDetail/TourDetail";
import React from "react";

const tourData = {
  title: "Showa tour",
  tourCode: "TRP-2024/201",
  duration: "10 Days 9 Nights",
  type: "Scheduled",
  hotelService: "3+",
  imageUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6EjL-n0Yy3ZIcF0FjVrGGq2hPFjppq158RQ&s",
  price: {
    adult: "9,000,000 VND",
    children1_11: "5,000,000 VND",
    children12_plus: "7,000,000 VND",
  },
  departurePoints: "Tan Son Nhat International Airport (Ho Chi Minh City)",
  destinationPoints: "Narita International Airport (Tokyo)",
  tripList: [
    "2025-01-20",
    "2025-01-22",
    "2025-01-23",
    "2025-01-24",
    "2025-01-25",
  ],
  tourPriceIncludes: [
    "Accommodation in 3+ star hotels",
    "Meals: Breakfast, Lunch, and Dinner",
    "Transportation (Flights, buses)",
    "Local guides",
    "Entrance fees to tourist attractions",
  ],
  tourPriceNotIncludes: [
    "Personal expenses",
    "Optional tours",
    "Travel insurance",
    "Visa fees",
  ],
  cancelPolicy:
    "Cancellations made 15 days before departure will receive a full refund. 50% refund if canceled within 7 days of departure.",
  depositPolicy:
    "A 30% deposit is required upon booking. The balance is due 7 days before departure.",
  policy: [
    "1. General Terms",
    "1.1 Eligibility: The insured must be a resident of [Country] and aged between [18 to 75] years at the time of policy purchase.",
    "2. Coverage Benefits",
    "2.1 Emergency Medical Expenses: This policy provides coverage for medical expenses incurred due to an illness or injury during the trip, up to a limit of [$X].",
  ],
  itinerary: [
    "Koi Farm Asage - Koi Farm Minami - Marudo Koi Farm",
    "Koi Farm Asage - Koi Farm Minami - Marudo Koi Farm",
    "Koi Farm Asage - Koi Farm Minami - Marudo Koi Farm",
    "Koi Farm Asage - Koi Farm Minami - Marudo Koi Farm",
  ],
};

function Page() {
  return (
    <ManagerLayout title="Tour Detail">
      <TourDetail data={tourData} />
    </ManagerLayout>
  );
}

export default Page;
