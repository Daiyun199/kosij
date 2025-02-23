"use client";
import { useState } from "react";
import CreateTourStep1 from "../tourCreateStep1";
import CreateTourStep2 from "../tourCreateStep2";
import CreateTourStep3 from "../tourCreateStep3";
import CreateTourStep4 from "../tourCreateStep4";

export default function CreateTour() {
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 1 && <CreateTourStep1 onNext={() => setStep(2)} />}
      {step === 2 && (
        <CreateTourStep2 onBack={() => setStep(1)} onNext={() => setStep(3)} />
      )}
      {step === 3 && (
        <CreateTourStep3 onBack={() => setStep(2)} onNext={() => setStep(4)} />
      )}
      {step === 4 && <CreateTourStep4 onBack={() => setStep(3)} />}
    </div>
  );
}
