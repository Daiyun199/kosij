/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { FiArrowLeft } from "react-icons/fi";
import api from "@/config/axios.config";
import { Day } from "@/model/Day";

interface CreateTourStep4Props {
  onBack: () => void;
  tourData: {
    step1: Record<string, any>;
    step2: Day[];
    step3: {
      includes: string;
      notIncludes: string;
    };
    step4: Record<string, any>;
  };
  formData: Record<string, any>;
  setFormData: (data: any) => void;
}

const CreateTourStep4: React.FC<CreateTourStep4Props> = ({
  onBack,
  formData,
  setFormData,
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
          setFormData({ ...formData, policies: fetchedPolicies });
        }
      })
      .catch((error) => {
        console.error("Error fetching policies:", error);
      });
  }, []);
  const handleCreateTour = async () => {
    try {
      const requestBody = {
        tourName: formData.tourName || "",
        imageUrl: formData.imageUrl || "",
        nights: formData.nights || 0,
        standardPrice: formData.standardPrice || 0,
        visaFee: formData.visaFee || 0,
        departurePoint: formData.departurePoint || "",
        destinationPoint: formData.destinationPoint || "",
        tourDetailsRequests: formData.tourDetailsRequests || [],
        tourPriceInclude: formData.tourPriceInclude || "",
        tourPriceNotInclude: formData.tourPriceNotInclude || "",
        registrationDaysBefore: formData.registrationDaysBefore || 0,
        registrationConditions: formData.registrationConditions || "",
        tourPriceRequests: formData.tourPriceRequests || [],
        tourPaymentRequests: formData.tourPaymentRequests || [],
      };

      const response = await api.post("/tours", requestBody);

      alert("Tour created successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error creating tour:", error);
      alert("Failed to create tour. Please try again.");
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

          setFormData({ ...formData, policies: fetchedDeposit });
        }
      })
      .catch((error) => {
        console.error("Error fetching policies:", error);
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
