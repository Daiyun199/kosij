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
  
  export interface Order {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: any;
    orderId: number;
    fullName: string;
    phoneNumber: string;
    deliveryAddress: string;
    paidAmount: number;
    remaining: number;
    totalOrderAmount: number;
    commissionPercentage: number;
    totalCommission: number;
    totalAfterCommission: number;
    note: string;
    expectedDeliveryDate: string;
    orderStatus: string;
    tripBookingId: number;
    createdTime: string;
    deliveryStaffId: number;
    deliveryStaffName: string;
    cancellationReason: string;
    confirmedUrl: string;
    orderDetails: OrderDetail[];
  }
  