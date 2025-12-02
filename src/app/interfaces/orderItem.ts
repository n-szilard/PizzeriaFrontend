export interface OrderItem {
    id?:number;
    orderId:number;
    pizzaId:number;
    quantity:number;
    price:number;
    createdAt?:string;
}