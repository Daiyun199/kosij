/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, Key } from "react";
import SaleStaffLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { FiArrowLeft, FiTrash } from "react-icons/fi";
import api from "@/config/axios.config";
import { Day } from "@/model/Day";
import { toast } from "react-toastify";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import { Button, Card, Input } from "antd";
import { ValueType } from "rc-input/lib/interface";
import { useRouter, useSearchParams } from "next/navigation";

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
  tourData,
}) => {
  const [policies, setPolicies] = useState(formData.policies || []);
  const [deposits, setDeposits] = useState(formData.deposits || []);
  const [promotions, setPromotions] = useState(formData.promotions || []);
  const [lastPayments, setLastPayment] = useState(formData.lastPayments || []);
  const router = useRouter();

  useEffect(() => {
    setFormData({ ...formData, policies, deposits, promotions, lastPayments });
  }, [policies, deposits, promotions, lastPayments]);

  const handlePromotionChange = (id: number, field: string, value: string) => {
    setPromotions(
      promotions.map((promotion: { id: number }) =>
        promotion.id === id ? { ...promotion, [field]: value } : promotion
      )
    );
  };
  const handleLastPaymentChange = (
    id: number,
    field: string,
    value: string
  ) => {
    setLastPayment(
      lastPayments.map((lastPayment: { id: number }) =>
        lastPayment.id === id ? { ...lastPayment, [field]: value } : lastPayment
      )
    );
  };
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
      .get("/config-templates/TourLastPayment")
      .then((response) => {
        if (response.data?.value) {
          const fetchedLastPayment = response.data.value.map(
            (lastPayment: any) => ({
              id: lastPayment.id,
              from: lastPayment.rangeStart.toString(),
              to: lastPayment.rangeEnd.toString(),
              discountRate: (lastPayment.rate * 100).toString(),
              description: lastPayment.description,
            })
          );
          setLastPayment(fetchedLastPayment);
          setFormData((prev: any) => ({
            ...prev,
            lastPayments: fetchedLastPayment,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching last Payment Policy:", error);
      });
  }, []);
  useEffect(() => {
    api
      .get("/config-templates/TourGroupDiscount")
      .then((response) => {
        if (response.data?.value) {
          const fetchedPromotions = response.data.value.map(
            (promotion: any) => ({
              id: promotion.id,
              from: promotion.rangeStart.toString(),
              to: promotion.rangeEnd.toString(),
              discountRate: (promotion.rate * 100).toString(),
              description: promotion.description,
            })
          );
          setPromotions(fetchedPromotions);
          setFormData((prev: any) => ({
            ...prev,
            promotions: fetchedPromotions,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching promotions:", error);
      });
  }, []);
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
          setFormData((prev: any) => ({ ...prev, policies: fetchedPolicies }));
        }
      })
      .catch((error) => {
        console.error("Error fetching policies:", error);
      });
  }, []);
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
        departureDate: tourData.step1.departureDate,
        pricingRate: tourData.step1.pricingRate,
        imageUrl: imageUrl || "",
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
              pricingRate: price.rate / 100,
            })
          ) || [],
        tourPaymentRequests: [
          ...(formData.deposits?.map(
            (deposit: {
              start: any;
              end: any;
              description: any;
              rate: number;
            }) => ({
              dayFrom: deposit.start,
              dayTo: deposit.end,
              description: deposit.description,
              depositRate: deposit.rate / 100,
            })
          ) || []),

          ...(formData.lastPayments?.map(
            (lastPayment: {
              from: any;
              to: any;
              description: any;
              discountRate: number;
            }) => ({
              dayFrom: lastPayment.from,
              dayTo: lastPayment.to,
              description: lastPayment.description,
              depositRate: lastPayment.discountRate / 100,
            })
          ) || []),
        ],

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
        tourPromotionRequests:
          formData.promotions?.map(
            (promotion: {
              from: any;
              to: any;
              description: any;
              discountRate: number;
            }) => ({
              from: promotion.from,
              to: promotion.to,
              description: promotion.description,
              discountRate: promotion.discountRate / 100,
            })
          ) || [],
      };

      const response = await api.post("/tour", requestBody);

      toast.success("Tour created successfully!");
      resetForm();
      setStep(1);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.value ||
          error.response.data.message ||
          "Failed to create tour. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to create tour. Please try again.");
      }
    }
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
  const addPromotion = () => {
    setPromotions([
      ...promotions,
      { id: Date.now(), from: "", to: "", discountRate: "", description: "" },
    ]);
  };
  const addLastPayment = () => {
    setLastPayment([
      ...lastPayments,
      { id: Date.now(), from: "", to: "", discountRate: "", description: "" },
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
  const removePromotion = (id: number) => {
    if (confirm("Are you sure you want to delete this promotion ?")) {
      setPromotions(
        promotions.filter((promotion: { id: number }) => promotion.id !== id)
      );
    }
  };
  const removeLastPayment = (id: number) => {
    if (confirm("Are you sure you want to delete this last Payment Policy ?")) {
      setLastPayment(
        lastPayments.filter((promotion: { id: number }) => promotion.id !== id)
      );
    }
  };
  return (
    <SaleStaffLayout title="Create Tour">
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 uppercase">
          TOUR INFORMATION FORM
        </h2>

        <Card title="Cancel Policy" className="mb-6">
          {policies.map(
            (policy: {
              id: Key | null | undefined;
              start: any;
              end: any;
              rate: any;
              description: any;
            }) => (
              <Card key={policy.id} className="mb-4 relative">
                <Button
                  type="text"
                  icon={<FiTrash size={16} className="text-red-500" />}
                  className="absolute -top-1.5 -right-1.5"
                  onClick={() => removePolicy(Number(policy.id))}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Starting Point"
                    value={policy.start}
                    onChange={(e) =>
                      handlePolicyChange(
                        Number(policy.id),
                        "start",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    placeholder="End Point"
                    value={policy.end}
                    onChange={(e) =>
                      handlePolicyChange(
                        Number(policy.id),
                        "end",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    placeholder="Penalty Rate (%)"
                    value={policy.rate}
                    onChange={(e) =>
                      handlePolicyChange(
                        Number(policy.id),
                        "rate",
                        e.target.value
                      )
                    }
                  />
                </div>
                <Input.TextArea
                  className="mt-4"
                  placeholder="Description"
                  rows={2}
                  value={policy.description}
                  onChange={(e) =>
                    handlePolicyChange(
                      Number(policy.id),
                      "description",
                      e.target.value
                    )
                  }
                />
              </Card>
            )
          )}
          <Button type="dashed" className="mt-4" onClick={addPolicy}>
            + New Policy
          </Button>
        </Card>

        <Card title="Deposit Policy" className="mb-6">
          {deposits.map(
            (deposit: {
              id: Key | null | number;
              start: ValueType;
              end: ValueType;
              rate: ValueType;
              description: any;
            }) => (
              <Card key={deposit.id} className="mb-4 relative">
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Starting Point"
                    value={deposit.start}
                    disabled
                  />
                  <Input placeholder="End Point" value={deposit.end} disabled />
                  <Input
                    placeholder="Pricing Rate (%)"
                    value={deposit.rate}
                    onChange={(e) =>
                      handleDepositChange(
                        Number(deposit.id),
                        "rate",
                        e.target.value
                      )
                    }
                  />
                </div>
                <Input.TextArea
                  className="mt-4"
                  placeholder="Description"
                  rows={2}
                  value={deposit.description}
                  onChange={(e) =>
                    handleDepositChange(
                      Number(deposit.id),
                      "description",
                      e.target.value
                    )
                  }
                />
              </Card>
            )
          )}
        </Card>
        <Card title="Last Payment Policy" className="mb-6">
          {lastPayments.map(
            (lastPayment: {
              id: Key | null | undefined;
              from: any;
              to: any;
              discountRate: any;
              description: any;
            }) => (
              <Card key={lastPayment.id} className="mb-4 relative">
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Starting Point"
                    value={lastPayment.from}
                    disabled
                  />
                  <Input
                    placeholder="End Point"
                    value={lastPayment.to}
                    disabled
                  />
                  <Input
                    placeholder="Penalty Rate (%)"
                    value={lastPayment.discountRate}
                    onChange={(e) =>
                      handleLastPaymentChange(
                        Number(lastPayment.id),
                        "rate",
                        e.target.value
                      )
                    }
                  />
                </div>
                <Input.TextArea
                  className="mt-4"
                  placeholder="Description"
                  rows={2}
                  value={lastPayment.description}
                  onChange={(e) =>
                    handleLastPaymentChange(
                      Number(lastPayment.id),
                      "description",
                      e.target.value
                    )
                  }
                />
              </Card>
            )
          )}
        </Card>
        <Card title="Promotion Policy" className="mb-6">
          {promotions.map((promotion: any) => (
            <Card key={promotion.id} className="mb-4 relative">
              <Button
                type="text"
                icon={<FiTrash size={16} className="text-red-500" />}
                className="absolute -top-1.5 -right-1.5"
                onClick={() => removePromotion(promotion.id)}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="From"
                  value={promotion.from}
                  onChange={(e) =>
                    handlePromotionChange(promotion.id, "from", e.target.value)
                  }
                />
                <Input
                  placeholder="To"
                  value={promotion.to}
                  onChange={(e) =>
                    handlePromotionChange(promotion.id, "to", e.target.value)
                  }
                />
                <Input
                  placeholder="Discount Rate (%)"
                  value={promotion.discountRate}
                  onChange={(e) =>
                    handlePromotionChange(
                      promotion.id,
                      "discountRate",
                      e.target.value
                    )
                  }
                />
              </div>
              <Input.TextArea
                className="mt-4"
                placeholder="Description"
                rows={2}
                value={promotion.description}
                onChange={(e) =>
                  handlePromotionChange(
                    promotion.id,
                    "description",
                    e.target.value
                  )
                }
              />
            </Card>
          ))}
          <Button type="dashed" className="mt-4" onClick={addPromotion}>
            + New Promotion
          </Button>
        </Card>
        <div className="flex justify-between mt-6">
          <Button onClick={onBack} className="flex items-center gap-2">
            <FiArrowLeft size={20} /> Back
          </Button>
          <Button type="primary" onClick={handleCreateTour}>
            Create ➜
          </Button>
        </div>
      </div>
    </SaleStaffLayout>
  );
};

export default CreateTourStep4;
