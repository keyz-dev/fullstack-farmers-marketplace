import React from "react";
import { Check } from "lucide-react";
import { Button } from "../../ui";

const NotificationHeader = ({ onMarkAllAsRead }) => {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center space-x-3">
        <Button
          onClickHandler={onMarkAllAsRead}
          additionalClasses="primarybtn"
          leadingIcon={<Check className="h-4 w-4 mr-2" />}
          text="Mark All Read"
        />
      </div>
    </div>
  );
};

export default NotificationHeader;
