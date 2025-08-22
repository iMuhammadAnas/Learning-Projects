import "./stepper.css";

type StepperProps = {
  steps: string[];
  currentStep: number;
};

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const active = index === currentStep;
        const completed = index < currentStep;

        return (
          <div
            key={step}
            className={`step ${active ? "active" : ""} ${
              completed ? "completed" : ""
            }`}
          >
            <div className="circle">{completed ? "✓" : index + 1}</div>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
