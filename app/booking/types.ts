export interface Instructor {
  id: string;
  title: string | null;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration: number;
  price: number; // kroner
  color: string | null;
  minNoticeHours: number;
  maxAdvanceDays: number;
  allowStripe: boolean;
  allowVipps: boolean;
  instructors: Instructor[];
}
