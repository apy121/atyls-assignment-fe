import React, { useState } from "react";
import ProductList from "./ProductList";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [pageLimit, setPageLimit] = useState(null);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      {!pageLimit ? (
        <div className="text-center border p-4 shadow rounded bg-light">
          <h2 className="mb-3">How many pages do you want to scrape?</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const inputVal = e.target.elements.pageLimit.value;
              setPageLimit(parseInt(inputVal, 10));
            }}
          >
            <input type="number" name="pageLimit" className="form-control mb-3" required />
            <button type="submit" className="btn btn-primary">Start Scraping</button>
          </form>
        </div>
      ) : (
        <ProductList pageLimit={pageLimit} />
      )}
    </div>
  );
}

export default App;
