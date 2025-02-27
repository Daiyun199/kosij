/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { FiArrowLeft } from "react-icons/fi";
import api from "@/config/axios.config";
import { Day } from "@/model/Day";
import { toast } from "react-toastify";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
interface CreateTourStep4Props {
  onBack: () => void;
  setStep: (step: number) => void;
  tourData: {
    step1: Record<string, any>;
    step2: Day[];
    step3: {
      includes: string;
      notIncludes: string;
      price: [];
    };
    step4: Record<string, any>;
  };
  formData: Record<string, any>;
  setFormData: (data: any) => void;
  resetForm: () => void;
}

const CreateTourStep4: React.FC<CreateTourStep4Props> = ({
  onBack,
  formData,
  setFormData,
  setStep,
  resetForm,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tourData,
}) => {
  const [policies, setPolicies] = useState(formData.policies || []);
  const [deposits, setDeposits] = useState(formData.deposits || []);

  useEffect(() => {
    setFormData({ ...formData, policies, deposits });
  }, [policies, deposits]);

  const handlePolicyChange = (id: number, field: string, value: string) => {
    setPolicies(
      policies.map((policy: { id: number }) =>
        policy.id === id ? { ...policy, [field]: value } : policy
      )
    );
  };

  const handleDepositChange = (id: number, field: string, value: string) => {
    setDeposits(
      deposits.map((deposit: { id: number }) =>
        deposit.id === id ? { ...deposit, [field]: value } : deposit
      )
    );
  };
  useEffect(() => {
    api
      .get("/config-templates/TourCancellationPolicy")
      .then((response) => {
        if (response.data?.value) {
          const fetchedPolicies = response.data.value.map((policy: any) => ({
            id: policy.id,
            start: policy.rangeStart.toString(),
            end: policy.rangeEnd.toString(),
            rate: (policy.rate * 100).toString(),
            description: policy.description,
          }));
          setPolicies(fetchedPolicies);
          setFormData((prev: any) => ({ ...prev, policies: fetchedPolicies })); // Giữ lại các dữ liệu khác
        }
      })
      .catch((error) => {
        console.error("Error fetching policies:", error);
      });
  }, []);
  const convertTimeToHourMinute = (timeString: string) => {
    const [hour, minute] = timeString.split(":").map(Number);
    return { hour, minute };
  };
  const base64ToFile = (base64String: string, fileName: string) => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };
  const handleCreateTour = async () => {
    try {
      let imageUrl = "";

      if (
        typeof tourData.step1.img === "string" &&
        tourData.step1.img.startsWith("data:image")
      ) {
        tourData.step1.img = base64ToFile(
          tourData.step1.img,
          `tour-image-${Date.now()}.jpg`
        );
      }

      if (tourData.step1.img instanceof File) {
        const imageRef = ref(
          storage,
          `tours/${Date.now()}-${tourData.step1.img.name}`
        );
        await uploadBytes(imageRef, tourData.step1.img);
        imageUrl = await getDownloadURL(imageRef);
      } else {
        console.error("Invalid image file:", tourData.step1.img);
      }
      const requestBody = {
        imageUrl: imageUrl || "", // Lấy URL ảnh từ Firebase
        tourName: tourData.step1.tourName || "",
        nights: tourData.step1.night || 0,
        standardPrice: tourData.step1.standardPrice || 0,
        visaFee: tourData.step1.visaFee || 0,
        departurePoint: tourData.step1.departure || "",
        destinationPoint: tourData.step1.destination || "",
        tourDetailsRequests: tourData.step2.map((day, index) => ({
          day: index + 1,
          itineraryName: day.title,
          itineraryDetails: day.activities.map((activity) => ({
            time: convertTimeToHourMinute(activity.time),
            description: activity.description,
            farmId: activity.locations || null,
          })),
        })),
        tourPriceInclude: tourData.step3.includes || "",
        tourPriceNotInclude: tourData.step3.notIncludes || "",
        registrationDaysBefore: tourData.step1.registrationDaysBefore || 0,
        registrationConditions: tourData.step1.registrationConditions || "",
        tourPriceRequests:
          tourData.step3.price?.map(
            (price: {
              start: any;
              end: any;
              description: any;
              rate: number;
            }) => ({
              ageFrom: price.start,
              ageTo: price.end,
              description: price.description,
              penaltyRate: price.rate / 100,
            })
          ) || [],
        tourPaymentRequests:
          formData.deposits?.map(
            (deposit: {
              start: any;
              end: any;
              description: any;
              rate: number;
            }) => ({
              dayFrom: deposit.start,
              dayTo: deposit.end,
              description: deposit.description,
              penaltyRate: deposit.rate / 100,
            })
          ) || [],
        tourCancellationRequests:
          formData.policies?.map(
            (policy: {
              start: any;
              end: any;
              description: any;
              rate: number;
            }) => ({
              dayFrom: policy.start,
              dayTo: policy.end,
              description: policy.description,
              penaltyRate: policy.rate / 100,
            })
          ) || [],
      };

      const response = await api.post("/tour", requestBody);

      toast.success("Tour created successfully!");
      resetForm();
      setStep(1);
    } catch (error) {
      toast.error("Failed to create tour. Please try again.");
    }
  };

  useEffect(() => {
    api
      .get("/config-templates/TourDepositRate")
      .then((response) => {
        if (response.data?.value) {
          const fetchedDeposit = response.data.value.map((deposit: any) => ({
            id: deposit.id,
            start: deposit.rangeStart.toString(),
            end: deposit.rangeEnd.toString(),
            rate: (deposit.rate * 100).toString(),
            description: deposit.description,
          }));
          setDeposits(fetchedDeposit);
          setFormData((prev: any) => ({ ...prev, deposits: fetchedDeposit }));
        }
      })
      .catch((error) => {
        console.error("Error fetching deposits:", error);
      });
  }, []);

  const addPolicy = () => {
    setPolicies([
      ...policies,
      { id: Date.now(), start: "", end: "", rate: "", description: "" },
    ]);
  };

  const addDeposit = () => {
    setDeposits([
      ...deposits,
      { id: Date.now(), start: "", end: "", rate: "", description: "" },
    ]);
  };

  const removePolicy = (id: number) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      setPolicies(
        policies.filter((policy: { id: number }) => policy.id !== id)
      );
    }
  };

  const removeDeposit = (id: number) => {
    if (confirm("Are you sure you want to delete this deposit?")) {
      setDeposits(
        deposits.filter((deposit: { id: number }) => deposit.id !== id)
      );
    }
  };

  return (
    <ManagerLayout title="Create Tour">
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 uppercase">
          Tour Information Form
        </h2>

        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Cancel Policy</h3>
          {policies.map((policy: any) => (
            <div key={policy.id} className="relative border p-4 mb-4 rounded">
              <button
                onClick={() => removePolicy(policy.id)}
                className="absolute top-0 right-0 text-gray-500 hover:text-red-500 text-sm"
              >
                ✖
              </button>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Starting Point"
                  value={policy.start}
                  onChange={(e) =>
                    handlePolicyChange(policy.id, "start", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="End Point"
                  value={policy.end}
                  onChange={(e) =>
                    handlePolicyChange(policy.id, "end", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Penalty Rate (%)"
                  value={policy.rate}
                  onChange={(e) =>
                    handlePolicyChange(policy.id, "rate", e.target.value)
                  }
                />
              </div>
              <textarea
                className="w-full p-2 border rounded mt-4"
                placeholder="Description"
                rows={2}
                value={policy.description}
                onChange={(e) =>
                  handlePolicyChange(policy.id, "description", e.target.value)
                }
              ></textarea>
            </div>
          ))}
          <button
            onClick={addPolicy}
            className="mt-4 px-4 py-2 bg-gray-300 rounded"
          >
            + New Policy
          </button>
        </div>

        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Deposit Policy</h3>
          {deposits.map((deposit: any) => (
            <div key={deposit.id} className="relative border p-4 mb-4 rounded">
              <button
                onClick={() => removeDeposit(deposit.id)}
                className="absolute top-0 right-0 text-gray-500 hover:text-red-500 text-sm"
              >
                ✖
              </button>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Starting Point"
                  value={deposit.start}
                  onChange={(e) =>
                    handleDepositChange(deposit.id, "start", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="End Point"
                  value={deposit.end}
                  onChange={(e) =>
                    handleDepositChange(deposit.id, "end", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Pricing Rate (%)"
                  value={deposit.rate}
                  onChange={(e) =>
                    handleDepositChange(deposit.id, "rate", e.target.value)
                  }
                />
              </div>
              <textarea
                className="w-full p-2 border rounded mt-4"
                placeholder="Description"
                rows={2}
                value={deposit.description}
                onChange={(e) =>
                  handleDepositChange(deposit.id, "description", e.target.value)
                }
              ></textarea>
            </div>
          ))}
          <button
            onClick={addDeposit}
            className="mt-4 px-4 py-2 bg-gray-300 rounded"
          >
            + New Deposit
          </button>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 flex items-center gap-2"
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          <button
            onClick={handleCreateTour}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Create ➜
          </button>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default CreateTourStep4;
