"use client";
import { useState } from "react";
import CreateTourStep1 from "../../tourCreateStep1";
import CreateTourStep2 from "../../tourCreateStep2";
import CreateTourStep3 from "../../tourCreateStep3";
import CreateTourStep4 from "../../tourCreateStep4";
import { Day } from "@/model/Day";

export default function CreateTour() {
  const [step, setStep] = useState(1);

  const [tourData, setTourData] = useState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    step1: {} as Record<string, any>,
    step2: [] as Day[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    step3: {
      includes: "",
      notIncludes: "",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    step4: {} as Record<string, any>, // Rỗng
  });

  const updateStepData = (stepKey: keyof typeof tourData, data: object) => {
    setTourData((prev) => ({ ...prev, [stepKey]: data }));
  };

  return (
    <div>
      {step === 1 && (
        <CreateTourStep1
          onNext={() => setStep(2)}
          data={tourData.step1}
          updateData={(data) => updateStepData("step1", data)}
        />
      )}
      {step === 2 && (
        <CreateTourStep2
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          data={tourData.step2}
          updateData={(data) => updateStepData("step2", data)}
        />
      )}
      {step === 3 && (
        <CreateTourStep3
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          data={tourData.step3}
          updateData={(data) => updateStepData("step3", data)}
        />
      )}
      {step === 4 && (
        <CreateTourStep4
          onBack={() => setStep(3)}
          tourData={tourData}
          formData={tourData.step4}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setFormData={(data: any) => updateStepData("step4", data)}
        />
      )}
    </div>
  );
}
