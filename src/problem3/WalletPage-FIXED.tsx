import React, { useMemo } from "react";
// add missing imports
import { BoxProps } from "";
import { useWalletBalances } from "";
import { usePrices } from "";
import { WalletRow } from "";
import { classes } from "";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property
}

// Extend WalletBalance to add specific fields without repeating properties
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

// change the name of the props to be more descriptive
interface WalletPageProps extends BoxProps {
  children?: React.ReactNode;
}

// Move this outside of the component to avoid re-creating it on every render
// this is a pure function that does not depend on the component
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

// destructure the props here to avoid a separate line to extract props.
const WalletPage: React.FC<WalletPageProps> = ({ children, ...rest }: WalletPageProps) => {
    // const { children, ...rest } = props; -> removed because it is already destructured above
  const balances = useWalletBalances();
  const prices = usePrices();

  // Combine sorting, filtering, and formatting into a single useMemo call
  const processedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);

        // original logic
        // if (lhsPriority > -99) {
        //     if (balance.amount <= 0) {
        //       return true;
        //     }
        //  }
        //  return false

        // Fixed logic: combine conditions to simplify but keep the same logic
        return balancePriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // original logic
        // if (leftPriority > rightPriority) {
        //     return -1;
        //   } else if (rightPriority > leftPriority) {
        //     return 1;
        //   }

        // Optimized logic: use subtraction to avoid conditional checks but keep the same logic
        return rightPriority - leftPriority;
      })
      .map((balance: WalletBalance): FormattedWalletBalance => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
          // move usdValue calculation outside of the map and inside pre-processing data
          usdValue: prices[balance.currency] * balance.amount,
        };
      });
  }, [balances, prices]);

  return (
    <div {...rest}>
      {/* no need to create a new rows array, just use processedBalances */}
      {/* more readable, less memory usage */}
      {processedBalances.map(
        (balance: FormattedWalletBalance, index: number) => {
          return (
            <WalletRow
              className={classes.row}
              // update key to be unique instead of index
              key={`${balance.currency}-${balance.blockchain}`}
              amount={balance.amount}
              usdValue={balance.usdValue}
              formattedAmount={balance.formatted}
            />
          );
        }
      )}
    </div>
  );
};


// export the component and the props type
export default WalletPage;
