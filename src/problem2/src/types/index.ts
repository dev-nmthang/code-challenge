export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

export interface Token {
  currency: string;
  price: number;
}

export interface SwapFormData {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}
