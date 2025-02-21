import { BreachResult } from "@/types/breach";

export interface SearchQuery {
  value: string;
  type: "email" | "username";
}

export interface ApiResponse {
  success: boolean;
  quota: number;
  found: number;
  result: BreachResult[];
  query: SearchQuery;
}

export interface Preferences {
  apiKey: string;
  monitoredEmail?: string;
}
