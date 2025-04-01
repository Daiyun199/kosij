/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

import { Day } from "@/model/Day";

import { useSearchParams } from "next/navigation";
import CreateTripStep1 from "./tourCreateStep1";
import CreateTripStep3 from "./tourCreateStep3";
import CreateTripStep2 from "./tourCreateStep2";
import CreateTripStep4 from "./tourCreateStep4";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function CreateTour() {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const tripRequestId = searchParams.get("tripRequestId");
  const [tourData, setTourData] = useState({
    step1: {} as Record<string, any>,
    step2: [] as Day[],
    step3: {
      includes: "",
      notIncludes: "",
      price: [] as [],
    },

    step4: {} as Record<string, any>,
  });
  const resetForm = () => {
    setTourData({
      step1: {},
      step2: [],
      step3: {
        includes: "",
        notIncludes: "",
        price: [],
      },
      step4: {},
    });
    setStep(0);
  };

  const updateStepData = (stepKey: keyof typeof tourData, data: any) => {
    setTourData((prev) => ({
      ...prev,
      [stepKey]: Array.isArray(prev[stepKey])
        ? data
        : { ...prev[stepKey], ...data },
    }));
  };

  return (
    <ProtectedRoute allowedRoles={["salesstaff"]}>
      <div>
        {step === 1 && (
          <CreateTripStep1
            tripRequestId={tripRequestId}
            onNext={() => setStep(2)}
            data={tourData.step1}
            updateData={(data) => updateStepData("step1", data)}
          />
        )}
        {step === 2 && (
          <CreateTripStep2
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            data={tourData.step2}
            updateData={(data) => updateStepData("step2", data)}
            dayStep1={tourData.step1.day}
          />
        )}
        {step === 3 && (
          <CreateTripStep3
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            data={tourData.step3}
            updateData={(data) => updateStepData("step3", data)}
          />
        )}
        {step === 4 && (
          <CreateTripStep4
            tripRequestId={tripRequestId}
            onBack={() => setStep(3)}
            tourData={tourData}
            formData={tourData.step4}
            setFormData={(data) => updateStepData("step4", data)}
            setStep={setStep}
            resetForm={resetForm}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
