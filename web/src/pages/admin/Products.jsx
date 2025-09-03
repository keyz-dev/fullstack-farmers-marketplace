import React from "react";
import { Upcoming, FadeInContainer } from "../../components/ui";

const Products = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming
        title="Product Management Coming Soon"
        description="Our advanced product management system is being developed to help you efficiently manage your product catalog."
        expectedDate="September 2025"
        features={[
          "Add and edit products",
          "Bulk product operations",
          "Product image management",
          "Inventory tracking",
          "Product approval workflow",
        ]}
        colorTheme="purple"
      />
    </FadeInContainer>
  );
};

export default Products;
