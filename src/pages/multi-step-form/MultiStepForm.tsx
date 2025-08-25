import { useState } from "react";
import Stepper from "./Stepper";
import PersonalInfo from "./PersonalInfo";
import ContactDetails from "./ContactDetails";
import Preferences from "./Preferences";
import Review from "./Review";

const steps = ["Personal Info", "Contact Details", "Preferences", "Review"];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    preference: "",
  });

  const updateFields = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const onSubmit = () => {
    console.log("Final Form Data:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div>
        <h1 className="s-heading">Multi-Step Form</h1>
      <div className="multi-form">
        <Stepper steps={steps} currentStep={currentStep} />

        {currentStep === 0 && (
          <PersonalInfo
            data={formData}
            update={updateFields}
            onNext={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 1 && (
          <ContactDetails
            data={formData}
            update={updateFields}
            onBack={() => setCurrentStep(0)}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <Preferences
            data={formData}
            update={updateFields}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && (
          <Review
            data={formData}
            onBack={() => setCurrentStep(2)}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}
