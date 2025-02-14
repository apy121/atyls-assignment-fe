import React, { useState, useEffect } from "react";

const CSVExporter = ({ data }) => {
  const [csvContent, setCsvContent] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      // Define CSV headers
      const headers = ["product_title", "product_price", "discount_percentage", "weight", "average_rating", "total_ratings", "path_to_image"];
      
      // Convert data to CSV format
      let csvContent = `${headers.join(',')}\n`;
      data.forEach(product => {
        const row = [
          `"${product.product_title}"`,
          product.product_price,
          product.discount_percentage,
          `"${product.weight}"`,
          product.average_rating,
          product.total_ratings,
          `"${product.path_to_image}"`
        ].join(',');
        csvContent += `${row}\n`;
      });
      
      setCsvContent(`data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
    }
  }, [data]);

  return (
    csvContent && (
      <a 
        href={csvContent} 
        download="products.csv"
        className="btn btn-secondary mt-2 me-2"
      >
        Download CSV
      </a>
    )
  );
};

export default CSVExporter;