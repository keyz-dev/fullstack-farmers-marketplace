import React from "react";
import { Upcoming, FadeInContainer } from "../../components/ui";

const Settings = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming
        title="Admin Settings Coming Soon"
        description="Our comprehensive admin settings panel is being developed to give you full control over platform configuration."
        expectedDate="October 2025"
        features={[
          "Platform configuration",
          "System preferences",
          "Security settings",
          "Notification preferences",
          "Backup and restore options",
        ]}
        colorTheme="indigo"
      />
    </FadeInContainer>
  );
};

export default Settings;
