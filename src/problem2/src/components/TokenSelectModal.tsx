import React, { useState, useMemo } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import TokenIcon from './TokenIcon';
import type { Token } from '../types';

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  onSelectToken: (currency: string) => void;
  title: string;
  selectedToken?: string;
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onSelectToken,
  title,
  selectedToken
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;
    return tokens.filter(token =>
      token.currency.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tokens, searchQuery]);

  const popularTokens = useMemo(() => {
    return [...tokens].sort((a, b) => b.price - a.price).slice(0, 4);
  }, [tokens]);

  const handleSelectToken = (currency: string) => {
    onSelectToken(currency);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={handleClose}>
            <MdClose />
          </button>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search name / address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="popular-tokens-section">
          <h4>Popular tokens</h4>
          <div className="popular-tokens-grid">
            {popularTokens.map(token => (
              <button
                key={token.currency}
                className={`popular-token-button ${selectedToken === token.currency ? 'selected' : ''}`}
                onClick={() => handleSelectToken(token.currency)}
              >
                <TokenIcon currency={token.currency} size={24} />
                <span>{token.currency}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="token-list">
          {filteredTokens.map(token => (
            <button
              key={token.currency}
              className={`token-item ${selectedToken === token.currency ? 'selected' : ''}`}
              onClick={() => handleSelectToken(token.currency)}
            >
              <div className="token-info">
                <TokenIcon currency={token.currency} size={32} />
                <div className="token-details">
                  <span className="token-name">{token.currency}</span>
                  <span className="token-description">{token.currency} Token</span>
                </div>
              </div>
              <div className="token-price">
                ${token.price.toFixed(6)}
              </div>
            </button>
          ))}
        </div>

        {filteredTokens.length === 0 && (
          <div className="no-results">
            <p>No tokens found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenSelectModal; 