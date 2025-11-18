export interface Order {
    id: number;
    user_id: number;
    total: number;
    status: string;
    created_at: string;
    updated_at: string;
    name?: string;
    quantity?: number; 
}