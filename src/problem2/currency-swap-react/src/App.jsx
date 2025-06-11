import CurrencySwapForm from "@/components/CurrencySwapForm";
import "@/styles/App.css";

function App() {
  return (
    <div className="currency-swap-app">
      <div className="container">
        <h1 className="app-title">Currency Swap</h1>
        <CurrencySwapForm />
      </div>
    </div>
  );
}

export default App;
