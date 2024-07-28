interface WalletBalance {
  currency: string;
  amount: number;
}

// Formatted-"WalletBalance" should be extended from WalletBalance
// and no nee to define the same properties exited in WalletBalance
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

//error syntax for define Props's type
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // look like all case are type string --> blockchain type should be string
  const getPriority = (blockchain: any): number => {
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

  // shorten the filter and sort
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // WalletBalance doesn't have property blockchain --> based on getPriority it should be currency
        const balancePriority = getPriority(balance.blockchain);
        // lhsPriority was not defined --> balancePriority
        if (lhsPriority > -99) {
          // not sure this filter only get balance with amount <= 0 ??
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });

    // sortedBalances does not depend on prices --> remove it
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(), //toFixed required 1 number parameter
    };
  });

  // look like rows should be rendered by formattedBalances --> replace sortedBalances with formattedBalances
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index} // key should be more unique --> index + balance.formatted
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
