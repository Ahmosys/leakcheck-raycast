import { BreachResult } from "@/types/breach";

export interface ApiResponse {
  success: boolean;
  quota: number;
  found: number;
  result: BreachResult[];
}

export interface Preferences {
  apiKey: string;
} 