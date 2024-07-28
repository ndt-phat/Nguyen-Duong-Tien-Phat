import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [fetching, setFetching] = useState(true);
  const [prices, setPrices] = useState([]);
  const [currency, setCurrency] = useState({ From: "", To: "" });
  const [sendValue, setSendValue] = useState();
  const [receivedValue, setReceivedValue] = useState();

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((data) => {
        const filteredPrices = [];
        // get newest prices based on date and currency
        data.forEach((pr) => {
          let isFound = false;
          for (let i = 0; i < filteredPrices.length; i++) {
            const filteredPrice = filteredPrices[i];
            if (filteredPrice.currency === pr.currency) {
              isFound = true;
              // get later date
              if (
                new Date(pr.date).getTime() >
                new Date(filteredPrice.date).getTime()
              )
                filteredPrices[i] = { ...pr };
              break;
            }
          }
          if (!isFound) filteredPrices.push(pr);
        });

        setPrices(filteredPrices);
        if (filteredPrices.length < 2) {
          window.alert(
            "https://interview.switcheo.com/prices.json was not return enough information"
          );
        } else {
          setCurrency({
            From: filteredPrices[0].currency,
            To: filteredPrices[1].currency,
          });
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => setFetching(false));
  }, []);

  const handleCurrencyChange = (e, field) => {
    setCurrency((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    if (sendValue) {
      const fromPrice = prices.find(
        (prices) => prices.currency === currency.From
      ).price;
      const toPrice = prices.find(
        (prices) => prices.currency === currency.To
      ).price;
      setReceivedValue(sendValue * (fromPrice / toPrice));
    }
  }, [currency, sendValue, prices]);

  return (
    <div class="wrapper">
      {fetching ? (
        <>Fetching prices from https://interview.switcheo.com/prices.json...</>
      ) : (
        <>
          <h1> Currency Swap</h1>
          <form>
            {["From", "To"].map((field) => (
              <div class="field">
                <label for={field}>{field}</label>
                <div class="input-wrapper">
                  <input
                    id={field}
                    type="number"
                    placeholder={
                      field === "From" ? "Enter amount" : "Received amount"
                    }
                    value={
                      field === "From" ? undefined : receivedValue?.toFixed(4)
                    }
                    onChange={(e) => setSendValue(e.target.value)}
                  />
                  <div class="separate"></div>
                  <select
                    defaultValue={currency[field]}
                    onChange={(e) => handleCurrencyChange(e, field)}
                  >
                    {prices.map((price) => (
                      <option key={price.currency} value={price.currency}>
                        {price.currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </form>
        </>
      )}
    </div>
  );
}

export default App;
