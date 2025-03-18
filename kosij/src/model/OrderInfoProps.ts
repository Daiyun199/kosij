export interface OrderDetailImage {
  id: number;
  imageUrl: string;
  orderDetailsId: number;
}

export interface OrderDetail {
  id: number;
  orderId: number;
  variety: string;
  quantity: number;
  length: number;
  weight: number;
  koiPrice: number;
  note: string;
  orderDetailImages: OrderDetailImage[];
}

export interface BoxVariety {
  varietyName: string;
}

export interface BoxAllocation {
  id: number;
  boxType: string;
  maxSize: number;
  quantity: number;
  cost: number;
  varieties: BoxVariety[];
}

export interface OrderData {
  id: number;
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  paidAmount: number;
  remaining: number;
  totalFishAmount: number;
  totalDeliveringAmount: number;
  totalOrderAmount: number;
  note: string;
  thirdPartyLogisticsInfo: string;
  expectedDeliveryDate: string;
  orderStatus: string;
  farmId: number;
  farmName: string;
  tripBookingId: number;
  createdTime: string;
  deliveryStaffId: number;
  deliveryStaffName: string;
  cancellationReason: string;
  confirmedUrl: string;
  orderDetails: OrderDetail[];
  boxAllocations: BoxAllocation[];
}
