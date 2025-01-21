export interface Stock {
  symbol: string;
  name: string;
  price?: string;
  isLoading?: boolean;
  error?: string;
}