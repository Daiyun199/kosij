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
    orderId: number;
    fullName: string;
    phoneNumber: string;
    deliveryAddress: string;
    paidAmount: number;
    remaining: number;
    totalAmount: number;
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
  