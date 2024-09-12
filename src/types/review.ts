export interface Review {
  appointmentId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
}
