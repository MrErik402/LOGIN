export interface Order {
  id?: number;
  user_id: number;
  total?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  pizza_id: number;
  quantity: number;
  price?: number;
  pizza?: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
}

