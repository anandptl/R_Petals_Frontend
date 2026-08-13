"use client";

import { Check, Clock, CreditCard, MapPin } from "lucide-react";

const steps = [
  { id: 1, label: "Address", Icon: MapPin },
  { id: 2, label: "Time Slot", Icon: Clock },
  { id: 3, label: "Payment", Icon: CreditCard },
];

export default function CheckoutStepper({ currentStep = 1 }) {
  const activeStep = Math.min(Math.max(Number(currentStep) || 1, 1), steps.length);

  return (
    <div className="w-full">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = step.id < activeStep;
          const isActive = step.id === activeStep;
          const isFuture = step.id > activeStep;
          const StepIcon = isCompleted ? Check : step.Icon;

          return (
            <div key={step.id} className="flex flex-1 items-start last:flex-none">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors sm:h-12 sm:w-12",
                    isCompleted && "border-green-600 bg-green-600 text-white",
                    isActive && "border-primary bg-primary-fixed text-primary",
                    isFuture && "border-outline-variant bg-surface-container-low text-on-surface-variant",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <StepIcon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
                </div>
                <span
                  className={[
                    "mt-2 max-w-[84px] text-xs font-semibold leading-tight transition-colors sm:max-w-none sm:text-sm",
                    isCompleted && "text-green-700",
                    isActive && "text-primary",
                    isFuture && "text-on-surface-variant",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="mx-1 mt-5 h-0.5 min-w-6 flex-1 rounded-full bg-outline-variant sm:mx-3 sm:mt-6">
                  <div
                    className={[
                      "h-full rounded-full transition-colors",
                      step.id < activeStep ? "bg-green-600" : "bg-outline-variant",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
