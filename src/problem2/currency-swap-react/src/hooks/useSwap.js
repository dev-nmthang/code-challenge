import { useState, useEffect } from "react";

export const useSwap = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [prices, setPrices] = useState({});
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch prices and extract available tokens from API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json"
        );
        const data = await response.json();

        const priceMap = {};
        const availableTokens = [];

        data.forEach((item) => {
          if (item.price && item.currency) {
            priceMap[item.currency] = Number(item.price);
            // Only add unique tokens that have valid prices
            if (!availableTokens.includes(item.currency)) {
              availableTokens.push(item.currency);
            }
          }
        });

        setPrices(priceMap);
        setTokens(availableTokens.sort()); // Sort alphabetically for better UX
      } catch (err) {
        console.error("Failed to fetch prices:", err);
        // Fallback to empty array if API fails
        setTokens([]);
      }
    };

    fetchPrices();
  }, []);

  // Calculate output amount when input changes
  useEffect(() => {
    // Check if we have valid input and prices
    const inputAmount = Number(fromAmount);
    const fromPrice = prices[fromCurrency];
    const toPrice = prices[toCurrency];

    // Calculate only if all values are valid numbers
    if (
      fromAmount !== "" &&
      !isNaN(inputAmount) &&
      inputAmount > 0 &&
      fromPrice &&
      toPrice
    ) {
      const exchangeRate = fromPrice / toPrice;
      const calculatedAmount = inputAmount * exchangeRate;
      setToAmount(calculatedAmount.toFixed(6));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromCurrency, toCurrency, prices]);

  const handleFromAmountChange = (value) => {
    // Allow empty string, decimal numbers (including leading zeros like "0.001")
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
      setError("");
      setSuccess("");
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount || "");
  };

  const handleSubmit = async () => {
    const inputAmount = Number(fromAmount);

    if (!fromAmount || isNaN(inputAmount) || inputAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (fromCurrency === toCurrency) {
      setError("Please select different currencies");
      return;
    }

    if (!prices[fromCurrency] || !prices[toCurrency]) {
      setError("Price information not available for selected currencies");
      return;
    }

    setLoading(true);
    setError("");

    // Mock API call
    setTimeout(() => {
      setSuccess(
        `Successfully swapped ${fromAmount} ${fromCurrency} to ${toAmount} ${toCurrency}`
      );
      setFromAmount("");
      setToAmount("");
      setLoading(false);
    }, 1500);
  };

  const getExchangeRate = () => {
    const fromPrice = prices[fromCurrency];
    const toPrice = prices[toCurrency];

    if (fromPrice && toPrice) {
      const rate = fromPrice / toPrice;
      return `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
    }
    return null;
  };

  return {
    // State
    fromAmount,
    toAmount,
    fromCurrency,
    toCurrency,
    loading,
    error,
    success,
    tokens,

    // Actions
    handleFromAmountChange,
    setFromCurrency,
    setToCurrency,
    handleSwap,
    handleSubmit,
    getExchangeRate,
  };
};
