import React, { useState, useEffect } from "react";
import axios from "axios";
import CSVExporter from "./CSVExporter"; // Assuming you've placed CSVExporter in the same directory

const API_URL = "https://atyls-assignment-be.onrender.com/scrape/";
const API_KEY = "default_secret_token";

const ProductList = ({ pageLimit }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    minPrice: 0,
    maxWeight: "",
    searchTitle: "",
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLimit]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    setFiltersVisible(false); // Hide filters while loading

    try {
      const response = await axios.post(
        API_URL,
        new URLSearchParams({ page_limit: pageLimit }).toString(),
        {
          headers: {
            "X-API-Key": API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.status === "success") {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        setFiltersVisible(true); // Show filters once products are loaded
      } else {
        setError("Failed to fetch products.");
      }
    } catch (error) {
      setError("Error fetching products: " + error.message);
    }

    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = products.filter(
      (product) =>
        product.average_rating >= filters.minRating &&
        product.product_price >= filters.minPrice &&
        (!filters.maxWeight ||
          parseFloat(product.weight) <= parseFloat(filters.maxWeight)) &&
        product.product_title
          .toLowerCase()
          .includes(filters.searchTitle.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  return (
    <div className="container mt-5 p-3">
      {loading ? (
        <div className="text-center mt-5">
          <h3>
            Fetching results, please wait for approximately{" "}
            {(pageLimit * (15 / 60)).toFixed(2)} minutes.
          </h3>
          <div className="spinner-border text-primary mt-3" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger mt-3">{error}</div>
      ) : (
        <>
          {filtersVisible && (
            <div
              className="border p-3 mb-4 mt-4 rounded shadow-sm bg-light"
              style={{ top: "30px", zIndex: 1000 }}
            >
              <h5>Filter Products</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <label>Min Rating:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={filters.minRating}
                    onChange={(e) =>
                      setFilters({ ...filters, minRating: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label>Min Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label>Max Weight (kg):</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.maxWeight}
                    onChange={(e) =>
                      setFilters({ ...filters, maxWeight: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-3">
                  <label>Search Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.searchTitle}
                    onChange={(e) =>
                      setFilters({ ...filters, searchTitle: e.target.value })
                    }
                  />
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-primary mt-2"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                  {/* Add CSV download button here */}
                  <CSVExporter data={products} />
                </div>
              </div>
            </div>
          )}

          <h1>Total Products Count: {filteredProducts.length}</h1>

          <div
            className="row mt-8 overflow-auto"
            style={{ maxHeight: "80vh", top: "100px" }}
          >
            {filteredProducts.map((product, index) => (
              <div key={index} className="col-md-4">
                <div className="card mb-3 shadow">
                  <img
                    src={product.path_to_image}
                    className="card-img-top"
                    alt={product.product_title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.product_title}</h5>
                    <p className="card-text">
                      <strong>Price:</strong> ₹{product.product_price} <br />
                      <strong>Discount:</strong> {product.discount_percentage}%{" "}
                      <br />
                      <strong>Weight:</strong> {product.weight} <br />
                      <strong>Rating:</strong> {product.average_rating} ⭐ (
                      {product.total_ratings} reviews)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;