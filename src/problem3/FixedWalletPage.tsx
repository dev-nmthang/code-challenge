/*
***
  Please check the refactor-summary.md file for the details of the changes I made.
***
*/

import React, { useMemo } from "react";
import WalletRow from "./WalletRow";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
};

// Mock hooks
const useWalletBalances = (): WalletBalance[] => {
  return [];
};

const usePrices = (): Record<string, number> => {
  return {};
};

// Mock classes
const classes = {
  row: "wallet-row-class",
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fixed logic: only include balances with priority > -99 AND amount > 0
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // Fixed: handle equal priorities case
        if (leftPriority > rightPriority) return -1;
        if (rightPriority > leftPriority) return 1;
        return 0;
      })
      .map((balance: WalletBalance): FormattedWalletBalance => {
        const usdValue = prices[balance.currency] * balance.amount;
        return {
          ...balance,
          formatted: balance.amount.toFixed(2),
          usdValue,
        };
      });
  }, [balances, prices]);

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    )
  );

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
