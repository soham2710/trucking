// app/leads/types.ts
export interface LeadItem {
    id: number;
    lead_id: number;
    quantity: number;
    packaging_type: string;
    freight_class: string;
    length: number;
    width: number;
    height: number;
    weight: number;
  }
  
  export interface Lead {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name?: string;
    shipping_type: 'ltl' | 'ftl';
    equipment_type?: string;
    total_weight?: number;
    declared_value?: number;
    pickup_zip_code: string;
    pickup_date?: string;
    pickup_is_residential: boolean;
    pickup_needs_liftgate: boolean;
    pickup_limited_access: boolean;
    delivery_zip_code: string;
    delivery_is_residential: boolean;
    delivery_needs_liftgate: boolean;
    delivery_limited_access: boolean;
    status: string;
    created_at: string;
    items?: LeadItem[];
  }