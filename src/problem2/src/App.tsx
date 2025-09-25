import { useState, useEffect, useMemo } from "react";
import { useTokenPrices } from "./hooks/useTokenPrices";
import TokenIcon from "./components/TokenIcon";
import TokenSelectModal from "./components/TokenSelectModal";
import { MdSwapVert, MdKeyboardArrowDown } from "react-icons/md";
import type { Token } from "./types";
import "./App.css";

const calculateExchangeRate = (
  fromToken: Token,
  toToken: Token,
  amount: number
): number => {
  if (!fromToken || !toToken || amount <= 0) return 0;
  
  return (amount * fromToken.price) / toToken.price;
};

const App = () => {
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: tokens, isLoading, error } = useTokenPrices();

  const selectedFromToken = useMemo(
    () => tokens?.find((token) => token.currency === fromToken),
    [tokens, fromToken]
  );

  const selectedToToken = useMemo(
    () => tokens?.find((token) => token.currency === toToken),
    [tokens, toToken]
  );

  useEffect(() => {
    if (
      selectedFromToken &&
      selectedToToken &&
      fromAmount &&
      !isNaN(Number(fromAmount))
    ) {
      const calculatedAmount = calculateExchangeRate(
        selectedFromToken,
        selectedToToken,
        Number(fromAmount)
      );
      setToAmount(calculatedAmount.toFixed(6));
    } else {
      setToAmount("");
    }
  }, [selectedFromToken, selectedToToken, fromAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      setShowSuccess(true);
      setFromAmount("");
      setToAmount("");
      setFromToken("");
      setToToken("");

      setTimeout(() => setShowSuccess(false), 2000);
    }, 1000);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tokens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <p>Error loading tokens</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  const isDisabled =
    !fromToken || !toToken || !fromAmount || !toAmount || isSwapping;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>
            Swap anytime,
            <br />
            anywhere.
          </h1>
        </header>

        <div className="swap-card">
          <form onSubmit={handleSubmit}>
            <div className="token-input-section">
              <div className="section-header">
                <span className="section-label">From</span>
              </div>
              <div className="token-input-container">
                <input
                  className="amount-input"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.0"
                />
                <div
                  className="token-select"
                  onClick={() => setIsFromModalOpen(true)}
                >
                  {fromToken ? (
                    <div className="selected-token">
                      <TokenIcon currency={fromToken} size={24} />
                      <span className="token-symbol">{fromToken}</span>
                      <MdKeyboardArrowDown className="dropdown-icon" />
                    </div>
                  ) : (
                    <div className="select-token">
                      <span>Select token</span>
                      <MdKeyboardArrowDown className="dropdown-icon" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="swap-button-container">
              <button
                type="button"
                className="swap-button"
                onClick={handleSwapTokens}
              >
                <MdSwapVert />
              </button>
            </div>

            <div className="token-input-section">
              <div className="section-header">
                <span className="section-label">To</span>
              </div>
              <div className="token-input-container">
                <input
                  className="amount-input"
                  value={toAmount}
                  placeholder="0.0"
                  readOnly
                />
                <div
                  className="token-select"
                  onClick={() => setIsToModalOpen(true)}
                >
                  {toToken ? (
                    <div className="selected-token">
                      <TokenIcon currency={toToken} size={24} />
                      <span className="token-symbol">{toToken}</span>
                      <MdKeyboardArrowDown className="dropdown-icon" />
                    </div>
                  ) : (
                    <div className="select-token">
                      <span>Select token</span>
                      <MdKeyboardArrowDown className="dropdown-icon" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedFromToken && selectedToToken && fromAmount && toAmount && (
              <div className="exchange-rate">
                <div className="rate-info">
                  <span>
                    1 {fromToken} ={" "}
                    {(selectedFromToken.price / selectedToToken.price).toFixed(
                      6
                    )}{" "}
                    {toToken}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="swap-confirm-button"
              disabled={isDisabled}
            >
              {isSwapping ? (
                <div className="button-loading">
                  <div className="button-spinner"></div>
                  <span>Swapping...</span>
                </div>
              ) : !fromToken || !toToken ? (
                "Select tokens"
              ) : !fromAmount ? (
                "Enter amount"
              ) : (
                "Swap"
              )}
            </button>
          </form>
        </div>
      </div>

      {tokens && (
        <>
          <TokenSelectModal
            isOpen={isFromModalOpen}
            onClose={() => setIsFromModalOpen(false)}
            tokens={tokens}
            onSelectToken={setFromToken}
            title="From"
            selectedToken={fromToken}
          />
          <TokenSelectModal
            isOpen={isToModalOpen}
            onClose={() => setIsToModalOpen(false)}
            tokens={tokens}
            onSelectToken={setToToken}
            title="To"
            selectedToken={toToken}
          />
        </>
      )}

      {showSuccess && (
        <div className="success-overlay">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Swap Successful!</h3>
            <p>Your tokens have been swapped successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
