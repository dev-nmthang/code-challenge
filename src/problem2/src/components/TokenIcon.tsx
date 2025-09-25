import React, { useState } from "react";

interface TokenIconProps {
  currency: string;
  size?: number;
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({
  currency,
  size = 24,
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);
  const iconUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    // Fallback to a colored circle with currency initials
    return (
      <div
        className={`token-icon-fallback ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${getColorForCurrency(
            currency
          )})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: size * 0.4,
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        {currency.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={`${currency} icon`}
      width={size}
      height={size}
      className={className}
      onError={handleError}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
};

// Generate consistent colors for currencies
const getColorForCurrency = (currency: string): string => {
  const colors = [
    "#6366f1, #8b5cf6",
    "#ec4899, #f97316",
    "#10b981, #059669",
    "#f59e0b, #d97706",
    "#ef4444, #dc2626",
    "#8b5cf6, #7c3aed",
    "#06b6d4, #0891b2",
    "#84cc16, #65a30d",
  ];

  const hash = currency
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default TokenIcon;
