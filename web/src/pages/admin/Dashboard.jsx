import React from "react";
import { Upcoming, FadeInContainer } from "../../components/ui";

const Dashboard = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming
        title="Admin Dashboard Coming Soon"
        description="Our powerful admin dashboard is being developed to provide you with comprehensive insights and control over your platform."
        expectedDate="August 2025"
        features={[
          "Real-time analytics and metrics",
          "User activity monitoring",
          "Revenue and order tracking",
          "System health monitoring",
          "Quick action shortcuts",
        ]}
        colorTheme="blue"
      />
    </FadeInContainer>
  );
};

export default Dashboard;
