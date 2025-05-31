export interface Product {
    collection: string;
    description: string;
    id: string;
    image_url: string;
    is_listed: boolean;
    name: string;
    owner: string;
    price: string;
    product_id: string;
    quantity: string;
}

export interface ProductsResponse {
    page: number;
    pageSize: number;
    total: number;
    products: Product[];
}