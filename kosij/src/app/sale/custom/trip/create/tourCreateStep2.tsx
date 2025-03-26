/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Activity } from "@/model/Activity";
import { Day } from "@/model/Day";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiPlus, FiTrash } from "react-icons/fi";
import { Select, Input, Button, Card, Typography, TimePicker } from "antd";
import dayjs from "dayjs";
import api from "@/config/axios.config";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface CreateTourStep2Props {
  onBack: () => void;
  onNext: () => void;
  data: Day[];
  updateData: (data: Day[]) => void;
  dayStep1: number;
}

interface Farm {
  id: number;
  farmName: string;
  location: string;
}

export default function CreateTripStep2({
  onBack,
  onNext,
  data,
  updateData,
  dayStep1,
}: CreateTourStep2Props) {
  const [days, setDays] = useState<Day[]>(
    Array.isArray(data)
      ? data.map((day) => ({
          ...day,
          activities: day.activities.map((activity) => ({
            ...activity,
            time: activity.time || "07:00",
          })),
        }))
      : []
  );
  const [farms, setFarms] = useState<Farm[]>([]);
  const [allFarms, setAllFarms] = useState<Farm[]>([]);
  const [selectedFarms, setSelectedFarms] = useState<
    Record<number, Record<number, Farm>>
  >({});

  console.log(days);
  useEffect(() => {
    updateData(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const handleTimeChange = (
    dayIndex: number,
    activityIndex: number,
    time: dayjs.Dayjs | null
  ) => {
    if (!time) return;

    const formattedTime = time.format("HH:mm");

    if (activityIndex > 0) {
      const prevActivityTime = dayjs(
        days[dayIndex].activities[activityIndex - 1].time,
        "HH:mm"
      );
      const currentTime = dayjs(formattedTime, "HH:mm");

      if (currentTime.isBefore(prevActivityTime.add(15, "minute"))) {
        toast.error(
          "The time must be at least 15 minutes before the next activity"
        );
        return;
      }
    }

    if (activityIndex < days[dayIndex].activities.length - 1) {
      const nextActivityTime = dayjs(
        days[dayIndex].activities[activityIndex + 1].time,
        "HH:mm"
      );
      const currentTime = dayjs(formattedTime, "HH:mm");

      if (nextActivityTime.isBefore(currentTime.add(15, "minute"))) {
        toast.error(
          "The time must be at least 15 minutes before the next activity"
        );
        return;
      }
    }

    handleUpdateActivity(dayIndex, activityIndex, "time", formattedTime);
  };

  const handleAddActivity = (dayIndex: number) => {
    setDays((prevDays) => {
      return prevDays.map((day, idx) => {
        if (idx !== dayIndex) return day;

        const activities = [...day.activities];

        let newTime = "07:00";
        if (activities.length > 0) {
          const lastActivityTime = activities[activities.length - 1].time;
          if (lastActivityTime) {
            const lastTime = dayjs(lastActivityTime, "HH:mm").add(15, "minute");
            newTime = lastTime.format("HH:mm");
          }
        }

        return {
          ...day,
          activities: [
            ...activities,
            {
              time: newTime,
              description: "",
              locations: "",
            },
          ],
        };
      });
    });
  };

  const [errors, setErrors] = useState<
    { dayIndex: number; activityIndex?: number; field: string }[]
  >([]);

  const validateForm = () => {
    const newErrors: {
      dayIndex: number;
      activityIndex?: number;
      field: string;
    }[] = [];

    days.forEach((day, dayIndex) => {
      if (!day.title.trim()) {
        newErrors.push({ dayIndex, field: "title" });
      }
      day.activities.forEach((activity, activityIndex) => {
        if (!activity.description.trim()) {
          newErrors.push({ dayIndex, activityIndex, field: "description" });
        }
      });
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };
  const handleNext = () => {
    if (!validateForm() || !validateTimeOrder()) {
      return;
    }

    const updatedDays = days.map((day) => ({
      ...day,
      activities: day.activities.map((activity) => ({
        ...activity,
        time: activity.time || "07:00",
      })),
    }));
    console.log("Updated Days", updatedDays);
    setDays(updatedDays);

    if (validateForm()) {
      updateData(updatedDays);
      onNext();
    }
  };
  useEffect(() => {
    setDays((prevDays) => {
      let updatedDays = [...prevDays];
      if (updatedDays.length < dayStep1) {
        for (let i = updatedDays.length; i < dayStep1; i++) {
          updatedDays.push({
            title: ``,
            activities: [{ time: "7:00", description: "", locations: "" }],
          });
        }
      } else if (updatedDays.length > dayStep1) {
        updatedDays = updatedDays.slice(0, dayStep1);
      }
      return updatedDays;
    });
  }, [dayStep1]);

  useEffect(() => {
    api
      .get("/farms/active")
      .then((response) => {
        if (response.data.value) setFarms(response.data.value);
        setAllFarms(response.data.value);
      })
      .catch((error) => console.error("Error fetching farms:", error));
  }, []);

  const handleUpdateDayTitle = (dayIndex: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].title = value;
    setDays(updatedDays);
  };

  const handleUpdateActivity = (
    dayIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string
  ) => {
    if (field === "locations") {
      const selectedFarm = allFarms.find((farm) => farm.id === Number(value));
      if (!selectedFarm) return;

      const previousFarm = selectedFarms[dayIndex]?.[activityIndex] || null;

      setSelectedFarms((prev) => ({
        ...prev,
        [dayIndex]: {
          ...prev[dayIndex],
          [activityIndex]: selectedFarm,
        },
      }));

      const updatedDays = [...days];
      updatedDays[dayIndex].activities[activityIndex][field] =
        selectedFarm.id.toString();
      setDays(updatedDays);

      setFarms((prevFarms) => {
        let updatedFarms = prevFarms.filter(
          (farm) => farm.id !== selectedFarm.id
        );

        if (previousFarm) {
          updatedFarms = [...updatedFarms, previousFarm];
        }

        return updatedFarms;
      });
    } else {
      setDays((prevDays) => {
        const updatedDays = [...prevDays];
        updatedDays[dayIndex].activities[activityIndex][field] = value;
        return updatedDays;
      });
    }
  };

  const handleDeleteActivity = (dayIndex: number, activityIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities.splice(activityIndex, 1);
    setDays(updatedDays);
  };
  const validateTimeOrder = () => {
    let isValid = true;

    days.forEach((day, dayIndex) => {
      for (let i = 0; i < day.activities.length - 1; i++) {
        const currentTime = dayjs(day.activities[i].time, "HH:mm");
        const nextTime = dayjs(day.activities[i + 1].time, "HH:mm");

        if (nextTime.isBefore(currentTime.add(15, "minute"))) {
          toast.error(
            `Day ${dayIndex + 1}: Activity ${
              i + 2
            } must be at least 15 minutes after Activity ${i + 1}`
          );

          isValid = false;
        }
      }
    });

    return isValid;
  };
  return (
    <SaleStaffLayout title="Tour Create">
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
        <Title level={2} className="text-center text-gray-800">
          TOUR INFORMATION FORM
        </Title>

        {days.map((day, dayIndex) => (
          <Card key={dayIndex} className="mb-6">
            <Input
              value={day.title}
              onChange={(e) => handleUpdateDayTitle(dayIndex, e.target.value)}
              className="text-lg font-semibold mt-2"
              placeholder={`Enter title for Day ${dayIndex + 1}`}
              required
            />
            {errors.some(
              (error) => error.dayIndex === dayIndex && error.field === "title"
            ) && <Text type="danger">Title is required.</Text>}

            {day.activities.map((activity, activityIndex) => (
              <Card
                key={activityIndex}
                className="mt-4 relative border border-gray-200"
              >
                <Button
                  type="text"
                  icon={<FiTrash size={20} className="text-red-500" />}
                  className="absolute top-2 right-2"
                  onClick={() => handleDeleteActivity(dayIndex, activityIndex)}
                />
                <Text className="block text-sm font-medium">Time:</Text>
                <TimePicker
                  value={
                    activity.time
                      ? dayjs(activity.time, "HH:mm")
                      : dayjs("07:00", "HH:mm")
                  }
                  format="HH:mm"
                  minuteStep={15}
                  onChange={(time) =>
                    handleTimeChange(dayIndex, activityIndex, time)
                  }
                  className="mb-3 w-full"
                />

                <Text className="block text-sm font-medium">Description:</Text>
                <TextArea
                  value={activity.description ?? ""}
                  onChange={(e) =>
                    handleUpdateActivity(
                      dayIndex,
                      activityIndex,
                      "description",
                      e.target.value
                    )
                  }
                  rows={3}
                  className={`mb-3 ${
                    errors.some(
                      (error) =>
                        error.dayIndex === dayIndex &&
                        error.activityIndex === activityIndex &&
                        error.field === "description"
                    )
                      ? "border-red-500"
                      : ""
                  }`}
                  required
                />

                {errors.some(
                  (error) =>
                    error.dayIndex === dayIndex &&
                    error.activityIndex === activityIndex &&
                    error.field === "description"
                ) && <Text type="danger">Description is required.</Text>}
                <Text className="block text-sm font-medium">Location:</Text>
                <Select
                  labelInValue
                  value={
                    activity.locations
                      ? {
                          value: String(activity.locations),
                          label:
                            allFarms.find(
                              (f) =>
                                f.id.toString() ===
                                activity.locations.toString()
                            )?.farmName || "Unknown",
                        }
                      : undefined
                  }
                  onChange={(selected) =>
                    handleUpdateActivity(
                      dayIndex,
                      activityIndex,
                      "locations",
                      selected.value
                    )
                  }
                  className="w-full"
                  placeholder="Select a farm"
                  options={farms.map((farm) => ({
                    label: farm.farmName,
                    value: String(farm.id),
                  }))}
                />
              </Card>
            ))}

            <Button
              type="primary"
              icon={<FiPlus />}
              onClick={() => handleAddActivity(dayIndex)}
              className="mt-4"
            >
              Add Activity
            </Button>
          </Card>
        ))}

        <div className="flex justify-between mt-6">
          <Button type="default" icon={<FiArrowLeft />} onClick={onBack}>
            Back
          </Button>
          <Button type="primary" onClick={handleNext}>
            Next ➜
          </Button>
        </div>
      </div>
    </SaleStaffLayout>
  );
}
