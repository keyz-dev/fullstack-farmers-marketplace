import React from "react";
import { Upcoming, FadeInContainer } from "../../components/ui";

const Orders = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming
        title="Order Management Coming Soon"
        description="Our comprehensive order management system is being developed to help you track and manage all orders efficiently."
        expectedDate="September 2025"
        features={[
          "Order status tracking",
          "Order fulfillment management",
          "Delivery scheduling",
          "Order history and analytics",
          "Customer communication tools"
        ]}
        colorTheme="orange"
      />
    </FadeInContainer>
  );
};

export default Orders;
