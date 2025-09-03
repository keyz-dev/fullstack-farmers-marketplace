import React from "react";
import { Upcoming, FadeInContainer } from "../../components/ui";

const Services = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming
        title="Services Coming Soon"
        description="Our service management system is being developed to provide you with a seamless way to manage your services."
        expectedDate="August 2025"
        features={[
          "Easy service management",
          "Service tracking",
          "Service management",
        ]}
        colorTheme="teal"
      />
    </FadeInContainer>
  );
};

export default Services;
