"use client";
import React, { useState } from "react";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";

interface CreateTourStep3Props {
  onBack: () => void;
  onNext: () => void;
}

const CreateTourStep3: React.FC<CreateTourStep3Props> = ({
  onBack,
  onNext,
}) => {
  const [adultPrice, setAdultPrice] = useState("5.000.000 VND");
  const [infantRate, setInfantRate] = useState("50%");
  const [childRate, setChildRate] = useState("90%");
  const [includes, setIncludes] = useState(
    `- Round-trip airfare for the HCM-HAN City - Japan route (Budget Air)
- Standard 3-4 star hotel accommodation/twin room
- Meals listed in the program
- Travel insurance 300.000/person.`
  );
  const [notIncludes, setNotIncludes] = useState(
    `- Single room fee for guests requesting single room.
- Other services not mentioned in the program
- Tips fee for the tour guide (150.000 VND/day/guest x 3 days).`
  );

  return (
    <ManagerLayout title="Create Tour">
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 uppercase">
          Tour Information Form
        </h2>

        {/* Price Configuration */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Price Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Adult</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={adultPrice}
                onChange={(e) => setAdultPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Infant pricing rate (Under 2 Ages)
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={infantRate}
                onChange={(e) => setInfantRate(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">
                Child pricing rate (2-11 Ages)
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={childRate}
                onChange={(e) => setChildRate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tour Price Includes */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Tour Price Includes</h3>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={includes}
            onChange={(e) => setIncludes(e.target.value)}
          />
        </div>

        {/* Tour Price Not Includes */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Tour Price Not Includes
          </h3>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={notIncludes}
            onChange={(e) => setNotIncludes(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            ⬅ Back
          </button>
          <button
            onClick={onNext}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Next ➜
          </button>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default CreateTourStep3;
