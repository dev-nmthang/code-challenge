import { useState } from "react";
import { useSwap } from "@/hooks/useSwap";

const CurrencySwapForm = () => {
  const [focusedInput, setFocusedInput] = useState(null);

  const {
    fromAmount,
    toAmount,
    fromCurrency,
    toCurrency,
    loading,
    error,
    success,
    tokens,
    handleFromAmountChange,
    setFromCurrency,
    setToCurrency,
    handleSwap,
    handleSubmit,
    getExchangeRate,
  } = useSwap();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form className="currency-swap-form" onSubmit={onSubmit}>
      <h2 className="currency-swap-form__title">Swap Tokens</h2>

      {/* From */}
      <div className="currency-swap-form__input-group">
        <label className="currency-swap-form__label">From</label>
        <div
          className={`currency-swap-form__input-container ${
            focusedInput === "from"
              ? "currency-swap-form__input-container--focused"
              : ""
          }`}
        >
          <input
            type="text"
            className="currency-swap-form__input"
            placeholder="0.0"
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
            onFocus={() => setFocusedInput("from")}
            onBlur={() => setFocusedInput(null)}
          />
          <div className="currency-swap-form__select-wrapper">
            <select
              className="currency-swap-form__select"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="">Select token</option>
              {tokens.map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="currency-swap-form__swap-section">
        <button
          type="button"
          className="currency-swap-form__swap-button"
          onClick={handleSwap}
          disabled={!fromCurrency || !toCurrency}
        >
          ↕
        </button>
      </div>

      {/* To */}
      <div className="currency-swap-form__input-group">
        <label className="currency-swap-form__label">To</label>
        <div
          className={`currency-swap-form__input-container ${
            focusedInput === "to"
              ? "currency-swap-form__input-container--focused"
              : ""
          }`}
        >
          <input
            type="text"
            className="currency-swap-form__input currency-swap-form__input--readonly"
            placeholder="0.0"
            value={toAmount}
            readOnly
            onFocus={() => setFocusedInput("to")}
            onBlur={() => setFocusedInput(null)}
          />
          <div className="currency-swap-form__select-wrapper">
            <select
              className="currency-swap-form__select"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="">Select token</option>
              {tokens.map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exchange Rate */}
      {getExchangeRate() && (
        <div className="currency-swap-form__rate-info">{getExchangeRate()}</div>
      )}

      {/* Messages */}
      {error && <div className="message message--error">{error}</div>}
      {success && <div className="message message--success">{success}</div>}

      {/* Submit */}
      <button
        type="submit"
        className={`currency-swap-form__submit-button ${
          loading ? "currency-swap-form__submit-button--loading" : ""
        } ${
          loading || !fromAmount || !fromCurrency || !toCurrency
            ? "currency-swap-form__submit-button--disabled"
            : ""
        }`}
        disabled={loading || !fromAmount || !fromCurrency || !toCurrency}
      >
        {loading ? "Processing..." : "Confirm Swap"}
      </button>
    </form>
  );
};

export default CurrencySwapForm;
