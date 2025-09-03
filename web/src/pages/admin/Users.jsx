import React from "react";
import { Upcoming, FadeInContainer } from "../../components/ui";

const Users = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming
        title="User Management Coming Soon"
        description="Our comprehensive user management system is being developed to help you manage all users and their permissions effectively."
        expectedDate="September 2025"
        features={[
          "User account management",
          "Role and permission control",
          "User activity monitoring",
          "Account verification tools",
          "User support and communication",
        ]}
        colorTheme="red"
      />
    </FadeInContainer>
  );
};

export default Users;
