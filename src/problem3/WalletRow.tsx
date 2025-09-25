import React from 'react';

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

const WalletRow: React.FC<WalletRowProps> = ({ className, amount, usdValue, formattedAmount }) => {
  return (
    <div className={className}>
      
      <span className="amount">{amount}</span>
      <span className="formatted-amount">{formattedAmount}</span>
      <span className="usd-value">${usdValue.toFixed(2)}</span>
    </div>
  );
};

export default WalletRow;
export type { WalletRowProps };
