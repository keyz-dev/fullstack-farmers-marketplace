import React from "react";
import {
  Building2,
  MapPin,
  Camera,
  FileText,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { StepSideBar } from "../ui";
import { useVendorSetup } from "../../hooks";

const VendorSetupSidebar = ({ currentStep, visitedSteps }) => {
  const { STEPS, getStepTitle, getStepSubtitle, isStepCompleted } =
    useVendorSetup();

  const steps = [
    {
      id: STEPS.BASIC_INFO,
      icon: <Building2 size={20} />,
      title: getStepTitle(STEPS.BASIC_INFO),
      description: getStepSubtitle(STEPS.BASIC_INFO),
      completed: isStepCompleted(STEPS.BASIC_INFO),
    },
    {
      id: STEPS.ADDRESS_LOCATION,
      icon: <MapPin size={20} />,
      title: getStepTitle(STEPS.ADDRESS_LOCATION),
      description: getStepSubtitle(STEPS.ADDRESS_LOCATION),
      completed: isStepCompleted(STEPS.ADDRESS_LOCATION),
    },
    {
      id: STEPS.PHOTOS,
      icon: <Camera size={20} />,
      title: getStepTitle(STEPS.PHOTOS),
      description: getStepSubtitle(STEPS.PHOTOS),
      completed: isStepCompleted(STEPS.PHOTOS),
    },
    {
      id: STEPS.DOCUMENT_UPLOAD,
      icon: <FileText size={20} />,
      title: getStepTitle(STEPS.DOCUMENT_UPLOAD),
      description: getStepSubtitle(STEPS.DOCUMENT_UPLOAD),
      completed: isStepCompleted(STEPS.DOCUMENT_UPLOAD),
    },
    {
      id: STEPS.PAYMENT_METHOD,
      icon: <CreditCard size={20} />,
      title: getStepTitle(STEPS.PAYMENT_METHOD),
      description: getStepSubtitle(STEPS.PAYMENT_METHOD),
      completed: isStepCompleted(STEPS.PAYMENT_METHOD),
    },
    {
      id: STEPS.REVIEW,
      icon: <CheckCircle size={20} />,
      title: getStepTitle(STEPS.REVIEW),
      description: getStepSubtitle(STEPS.REVIEW),
      completed: isStepCompleted(STEPS.REVIEW),
    },
  ];

  return (
    <StepSideBar
      currentStep={currentStep}
      visitedSteps={visitedSteps}
      steps={steps}
      homePath="/"
    />
  );
};

export default VendorSetupSidebar;
