import React, { useState, useEffect } from "react";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { CreateTourStep3Props } from "@/model/CreateTourStep3Props";
import { FiArrowLeft } from "react-icons/fi";
import api from "@/config/axios.config";

const CreateTourStep3: React.FC<CreateTourStep3Props> = ({
  onBack,
  onNext,
  data,
  updateData,
}) => {
  const [includes, setIncludes] = useState(data.includes ?? "");
  const [notIncludes, setNotIncludes] = useState(data.notIncludes ?? "");

  const [price, setPrice] = useState(data.price || []);

  useEffect(() => {
    updateData({
      includes,
      notIncludes,
      price: price ?? [],
    });
  }, [includes, notIncludes, price]);

  const handlePriceChange = (id: number, field: string, value: string) => {
    setPrice((prevPrice) =>
      prevPrice.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addPrice = () => {
    setPrice([
      ...price,
      { id: Date.now(), start: "", end: "", rate: "", description: "" },
    ]);
  };
  useEffect(() => {
    api
      .get("/config-templates/TourPrice")
      .then((response) => {
        if (response.data?.value) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fetchedPrices = response.data.value.map((price: any) => ({
            id: price.id,
            start: price.rangeStart.toString(),
            end: price.rangeEnd.toString(),
            rate: (price.rate * 100).toString(),
            description: price.description,
          }));
          setPrice(fetchedPrices);
          updateData({
            includes,
            notIncludes,
            price: fetchedPrices,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching policies:", error);
      });
  }, []);

  const removePrice = (id: number) => {
    setPrice(price.filter((item) => item.id !== id));
  };

  return (
    <ManagerLayout title="Create Tour">
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 uppercase">
          Tour Information Form
        </h2>

        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Cancel Price</h3>
          {price.map((item) => (
            <div key={item.id} className="relative border p-4 mb-4 rounded">
              <button
                onClick={() => removePrice(item.id)}
                className="absolute top-0 right-0 text-gray-500 hover:text-red-500 text-sm"
              >
                ✖
              </button>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Starting Point"
                  value={item.start}
                  onChange={(e) =>
                    handlePriceChange(item.id, "start", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="End Point"
                  value={item.end}
                  onChange={(e) =>
                    handlePriceChange(item.id, "end", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Penalty Rate (%)"
                  value={item.rate}
                  onChange={(e) =>
                    handlePriceChange(item.id, "rate", e.target.value)
                  }
                />
              </div>
              <textarea
                className="w-full p-2 border rounded mt-4"
                placeholder="Description"
                rows={2}
                value={item.description}
                onChange={(e) =>
                  handlePriceChange(item.id, "description", e.target.value)
                }
              ></textarea>
            </div>
          ))}
          <button
            onClick={addPrice}
            className="mt-4 px-4 py-2 bg-gray-300 rounded"
          >
            + New Price
          </button>
        </div>

        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Tour Price Includes</h3>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={includes}
            onChange={(e) => setIncludes(e.target.value)}
          />
        </div>

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

        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 flex items-center gap-2"
          >
            <FiArrowLeft size={20} />
            Back
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
