# Currency Swap React App

A simple and clean currency swap application built with React + Vite.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

1. **Clone and navigate to the project**
   ```bash
   cd src/problem2/currency-swap-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Go to `http://localhost:5173`
   - The app will automatically reload when you make changes

## How to Use

1. **Select "From" currency** - Choose the cryptocurrency you want to swap from
2. **Enter amount** - Type the amount you want to swap
3. **Select "To" currency** - Choose the cryptocurrency you want to receive
4. **View exchange rate** - See the current exchange rate between currencies
5. **Swap currencies** - Click the ↕ button to quickly swap currencies
6. **Confirm swap** - Click "Confirm Swap" to execute the transaction

## Project Structure

```
src/
├── components/
│   └── CurrencySwapForm.jsx    # Main swap form component
├── hooks/
│   └── useSwap.js              # Custom hook for swap logic
├── styles/
│   ├── variables.css           # Design tokens (colors, spacing, etc.)
│   ├── App.css                 # Component styles
│   └── index.css               # Global styles
├── App.jsx                     # Main app component
└── main.jsx                    # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The app fetches cryptocurrency prices from:
- **Endpoint**: `https://interview.switcheo.com/prices.json`
- **Method**: GET
- **Response**: Array of currency objects with prices

## Technical Details

- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **Custom hooks** for clean separation of logic
- **CSS Custom Properties** for theming
- **Path aliases** (`@/`) for clean imports
