import React from "react";
import { Upcoming, FadeInContainer } from "../../components/ui";

const Categories = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming
        title="Category Management Coming Soon"
        description="Our comprehensive category management system is being developed to help you organize and manage product categories efficiently."
        expectedDate="September 2025"
        features={[
          "Create and edit product categories",
          "Category hierarchy management",
          "Bulk category operations",
          "Category analytics and insights",
          "Category-based product filtering",
        ]}
        colorTheme="green"
      />
    </FadeInContainer>
  );
};

export default Categories;
