"use client";
import { useState } from "react";
import CreateTourStep1 from "../tourCreateStep1";
import CreateTourStep2 from "../tourCreateStep2";

export default function CreateTour() {
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 1 ? (
        <CreateTourStep1 onNext={() => setStep(2)} />
      ) : (
        <CreateTourStep2 onBack={() => setStep(1)} />
      )}
    </div>
  );
}
