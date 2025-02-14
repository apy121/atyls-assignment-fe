import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Image, Text, SimpleGrid, Spinner, Heading } from "@chakra-ui/react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/scrape/",
          new URLSearchParams({ page_limit: 5 }).toString(),
          {
            headers: {
              "X-API-Key": "default_secret_token",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (response.data.status === "success") {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text>Loading products...</Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5} textAlign="center">Scraped Products</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5}>
        {products.map((product, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            boxShadow="md"
          >
            <Image src={product.path_to_image} alt={product.product_title} borderRadius="md" />
            <Text fontWeight="bold" mt={2}>{product.product_title}</Text>
            <Text>Price: ₹{product.product_price}</Text>
            <Text>Discount: {product.discount_percentage}%</Text>
            <Text>Weight: {product.weight}</Text>
            <Text>Rating: {product.average_rating} ⭐ ({product.total_ratings} ratings)</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ProductList;
