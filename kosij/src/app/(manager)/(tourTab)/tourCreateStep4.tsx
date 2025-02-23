"use client";
import { useState } from "react";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";

interface CreateTourStep4Props {
  onBack: () => void;
}

const CreateTourStep4: React.FC<CreateTourStep4Props> = ({ onBack }) => {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      start: "20",
      end: "29",
      rate: "30",
      description:
        "Cancel 27 - 29 days before departure: 30% of the total tour price.",
    },
  ]);
  const [deposits, setDeposits] = useState([
    {
      id: 1,
      start: "21",
      end: "99",
      rate: "40",
      description: "Deposit 40% per person when registering for the tour.",
    },
  ]);

  const handlePolicyChange = (id: number, field: string, value: string) => {
    setPolicies(
      policies.map((policy) =>
        policy.id === id ? { ...policy, [field]: value } : policy
      )
    );
  };

  const handleDepositChange = (id: number, field: string, value: string) => {
    setDeposits(
      deposits.map((deposit) =>
        deposit.id === id ? { ...deposit, [field]: value } : deposit
      )
    );
  };

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
      setPolicies(policies.filter((policy) => policy.id !== id));
    }
  };

  const removeDeposit = (id: number) => {
    if (confirm("Are you sure you want to delete this deposit?")) {
      setDeposits(deposits.filter((deposit) => deposit.id !== id));
    }
  };

  return (
    <ManagerLayout title="Create Tour">
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 uppercase">
          Tour Information Form
        </h2>

        {/* Cancel Policy */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Cancel Policy</h3>
          {policies.map((policy) => (
            <div key={policy.id} className="relative border p-4 mb-4 rounded">
              <button
                onClick={() => removePolicy(policy.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              >
                ✖
              </button>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Starting Point(Day)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={policy.start}
                    onChange={(e) =>
                      handlePolicyChange(policy.id, "start", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    End Point(Day)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={policy.end}
                    onChange={(e) =>
                      handlePolicyChange(policy.id, "end", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Penalty Rate(%)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={policy.rate}
                    onChange={(e) =>
                      handlePolicyChange(policy.id, "rate", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  value={policy.description}
                  onChange={(e) =>
                    handlePolicyChange(policy.id, "description", e.target.value)
                  }
                ></textarea>
              </div>
            </div>
          ))}
          <button
            onClick={addPolicy}
            className="mt-4 px-4 py-2 bg-gray-300 rounded"
          >
            + New Policy
          </button>
        </div>

        {/* Deposit Policy */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Deposit Policy</h3>
          {deposits.map((deposit) => (
            <div key={deposit.id} className="relative border p-4 mb-4 rounded">
              <button
                onClick={() => removeDeposit(deposit.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              >
                ✖
              </button>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Starting Point(Day)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={deposit.start}
                    onChange={(e) =>
                      handleDepositChange(deposit.id, "start", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    End Point(Day)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={deposit.end}
                    onChange={(e) =>
                      handleDepositChange(deposit.id, "end", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Pricing Rate(%)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={deposit.rate}
                    onChange={(e) =>
                      handleDepositChange(deposit.id, "rate", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  value={deposit.description}
                  onChange={(e) =>
                    handleDepositChange(
                      deposit.id,
                      "description",
                      e.target.value
                    )
                  }
                ></textarea>
              </div>
            </div>
          ))}
          <button
            onClick={addDeposit}
            className="mt-4 px-4 py-2 bg-gray-300 rounded"
          >
            + New Deposit
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            ⬅ Back
          </button>
          <button className="bg-blue-500 text-white px-6 py-2 rounded">
            Create ➜
          </button>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default CreateTourStep4;
