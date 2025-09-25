import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the hook with simple implementation
jest.mock('./hooks/useTokenPrices', () => ({
  useTokenPrices: () => ({
    data: [
      { currency: 'BTC', price: 50000 },
      { currency: 'ETH', price: 3000 },
      { currency: 'USD', price: 1 },
      { currency: 'USDT', price: 1 }
    ],
    isLoading: false,
    error: null
  })
}));

describe('App', () => {
  test('opens token selection modal', () => {
    render(<App />);
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    expect(screen.getByPlaceholderText('Search name / address')).toBeInTheDocument();
  });

  test('validates amount input accepts numbers only', () => {
    render(<App />);
    const amountInput = screen.getAllByPlaceholderText('0.0')[0];
    
    fireEvent.change(amountInput, { target: { value: '100' } });
    expect(amountInput).toHaveValue('100');
    
    fireEvent.change(amountInput, { target: { value: 'abc' } });
    expect(amountInput).toHaveValue('100');
  });

  test('submit button is disabled initially', () => {
    render(<App />);
    const submitButton = screen.getByRole('button', { name: /swap/i });
    expect(submitButton).toBeDisabled();
  });


  test('swap button is disabled when same tokens selected', async () => {
    render(<App />);
    
    // Select BTC for from token
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    // Wait for modal and select BTC
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search name / address')).toBeInTheDocument();
    });
    
    const popularTokenButtons = screen.getAllByRole('button');
    const btcPopularButton = popularTokenButtons.find(button => 
      button.textContent?.includes('BTC') && button.className.includes('popular-token-button')
    );
    
    expect(btcPopularButton).toBeTruthy();
    fireEvent.click(btcPopularButton!);
    
    // Wait for modal to close and BTC to be selected
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Search name / address')).not.toBeInTheDocument();
      expect(screen.getByText('BTC')).toBeInTheDocument();
    });
    
    // Now click the remaining "Select token" button for the "To" field
    const remainingSelectButton = screen.getByText('Select token');
    fireEvent.click(remainingSelectButton);
    
    // Wait for modal to open again
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search name / address')).toBeInTheDocument();
    });
    
    // Select BTC again for the "To" token
    const popularTokenButtons2 = screen.getAllByRole('button');
    const btcPopularButton2 = popularTokenButtons2.find(button => 
      button.textContent?.includes('BTC') && button.className.includes('popular-token-button')
    );
    
    expect(btcPopularButton2).toBeTruthy();
    fireEvent.click(btcPopularButton2!);
    
    // Wait for modal to close and check if swap button is disabled
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Search name / address')).not.toBeInTheDocument();
      
      // Find swap button and check if disabled
      const swapButtons = screen.getAllByRole('button');
      const swapButton = swapButtons.find(button => 
        button.className.includes('swap-button')
      );
      
      expect(swapButton).toBeDisabled();
    });
  });

  test('closes modal when clicking close button', () => {
    render(<App />);
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    expect(screen.getByPlaceholderText('Search name / address')).toBeInTheDocument();
    
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    
    expect(screen.queryByPlaceholderText('Search name / address')).not.toBeInTheDocument();
  });

  test('displays popular tokens in modal', () => {
    render(<App />);
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    expect(screen.getByText('Popular tokens')).toBeInTheDocument();
    expect(screen.getAllByText('BTC')).toHaveLength(2); // Popular + list
    expect(screen.getAllByText('ETH')).toHaveLength(2); // Popular + list
  });

  test('filters tokens based on search query', () => {
    render(<App />);
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    const searchInput = screen.getByPlaceholderText('Search name / address');
    fireEvent.change(searchInput, { target: { value: 'BTC' } });
    
    // Should still show BTC in results
    expect(screen.getAllByText('BTC').length).toBeGreaterThan(0);
  });

  test('selects token from popular tokens and closes modal', async () => {
    render(<App />);
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    // Click on popular token (first BTC button)
    const popularTokenButtons = screen.getAllByRole('button');
    const btcPopularButton = popularTokenButtons.find(button => 
      button.textContent?.includes('BTC') && button.className.includes('popular-token-button')
    );
    
    if (btcPopularButton) {
      fireEvent.click(btcPopularButton);
      
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search name / address')).not.toBeInTheDocument();
      });
    }
  });

  test('swap button exists and is clickable', () => {
    render(<App />);
    
    // Find the swap button (middle button with SVG)
    const swapButtons = screen.getAllByRole('button');
    const swapButton = swapButtons.find(button => 
      (button as HTMLButtonElement).type === 'button' && button.className.includes('swap-button')
    );
    
    expect(swapButton).toBeInTheDocument();
    if (swapButton) {
      fireEvent.click(swapButton);
      // Should not throw error
      expect(swapButton).toBeInTheDocument();
    }
  });

  test('handles decimal amounts correctly', () => {
    render(<App />);
    const amountInput = screen.getAllByPlaceholderText('0.0')[0];
    
    fireEvent.change(amountInput, { target: { value: '0.5' } });
    expect(amountInput).toHaveValue('0.5');
    
    fireEvent.change(amountInput, { target: { value: '123.456' } });
    expect(amountInput).toHaveValue('123.456');
  });

  test('prevents negative amounts', () => {
    render(<App />);
    const amountInput = screen.getAllByPlaceholderText('0.0')[0];
    
    fireEvent.change(amountInput, { target: { value: '100' } });
    expect(amountInput).toHaveValue('100');
    
    fireEvent.change(amountInput, { target: { value: '-50' } });
    expect(amountInput).toHaveValue('100'); // Should not change to negative
  });

  test('modal overlay exists when modal is open', () => {
    render(<App />);
    
    // Modal should not be visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Open modal
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    // Modal overlay should be present
    const modal = document.querySelector('.modal-overlay');
    expect(modal).toBeInTheDocument();
  });

  test('search input is functional', () => {
    render(<App />);
    
    // Open modal
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    const searchInput = screen.getByPlaceholderText('Search name / address');
    
    // Type in search
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput).toHaveValue('test');
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput).toHaveValue('');
  });

  test('form inputs have correct attributes', () => {
    render(<App />);
    
    const amountInputs = screen.getAllByPlaceholderText('0.0');
    
    // From input should be editable
    expect(amountInputs[0]).not.toHaveAttribute('readonly');
    
    // To input should be readonly
    expect(amountInputs[1]).toHaveAttribute('readonly');
  });

  test('displays correct number of token options', () => {
    render(<App />);
    
    // Open modal
    const selectButtons = screen.getAllByText('Select token');
    fireEvent.click(selectButtons[0]);
    
    // Should show 4 popular tokens
    const popularSection = document.querySelector('.popular-tokens-grid');
    expect(popularSection?.children).toHaveLength(4);
    
    // Should show 4 tokens in main list
    const tokenList = document.querySelector('.token-list');
    expect(tokenList?.children).toHaveLength(4);
  });
});
