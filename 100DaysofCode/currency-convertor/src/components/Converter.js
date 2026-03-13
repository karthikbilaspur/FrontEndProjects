import { useState, useEffect } from "react";

function Converter() {

  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then(res => res.json())
      .then(data => setCurrencies(Object.keys(data.rates)))
      .catch(() => setError("Failed to load currencies"));
  }, []);

  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount, convertCurrency]);

  const convertCurrency = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );

      const data = await res.json();

      const rate = data.rates[toCurrency];

      setResult((amount * rate).toFixed(2));

      setLoading(false);
    } catch {
      setError("Conversion failed");
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

      <h2 className="text-2xl font-bold text-center mb-6">
        💱 Currency Converter
      </h2>

      <input
        type="number"
        className="w-full border p-3 rounded mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="flex items-center gap-3 mb-4">

        <select
          className="border p-2 rounded w-full"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <button
          onClick={swapCurrencies}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
        >
          ⇄
        </button>

        <select
          className="border p-2 rounded w-full"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

      </div>

      {loading && (
        <p className="text-center text-gray-500">
          Converting...
        </p>
      )}

      {error && (
        <p className="text-center text-red-500">
          {error}
        </p>
      )}

      {result && !loading && (
        <h3 className="text-center text-xl font-semibold mt-4">
          {amount} {fromCurrency} = {result} {toCurrency}
        </h3>
      )}

    </div>
  );
}

export default Converter;