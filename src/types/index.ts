// types/database.ts
export interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    status: string;
    created_at: string;
  }

  declare global {
    interface Window {
        mixpanel: any;
    }
 }  