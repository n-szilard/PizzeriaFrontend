export interface Order {
    id?: number;
    userId: number;
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    name?: string;
    quantity?: number; 
    payment?: string;
    shipping?:string;
    comment?: string;
}