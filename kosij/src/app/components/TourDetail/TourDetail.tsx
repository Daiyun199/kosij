/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, Collapse, Tag, DatePicker, Button, Popconfirm } from "antd";
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { TourData } from "@/model/TourData";
import { useRouter } from "next/navigation";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const TourDetail = ({ data }: { data: TourData }) => {
  const [filteredTrips, setFilteredTrips] = useState(data.tripList);

  const router = useRouter();

  const handleDateFilter = (dates: any) => {
    if (!dates || dates.length !== 2) {
      setFilteredTrips(data.tripList);
      return;
    }
    const [start, end] = dates.map((date: any) =>
      dayjs(date).format("YYYY-MM-DD")
    );

    const filtered = data.tripList.filter(
      (trip) => trip.departureDate >= start && trip.departureDate <= end
    );
    setFilteredTrips(filtered);
  };
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tour/${id}`);
      toast.success("The tour has been successfully deleted!");
      router.push("/manager/tours");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete the tour!";
      toast.error(errorMessage);
      console.error("Error deleting tour:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="border border-gray-200 shadow-sm">
        <Image
          src={data.imageUrl}
          alt={data.title}
          width={400}
          height={256}
          className="object-cover rounded-md mb-4 w-full h-64"
        />
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{data.title}</h2>
          <Tag color={data.tourStatus === "Active" ? "green" : "red"}>
            {data.tourStatus}
          </Tag>
        </div>
        <p className="text-gray-500">Tour Code: {data.tourCode}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Card title="Duration">{data.duration}</Card>
          <Card title="Type">{data.type}</Card>
          <Card title="Price">
            <p>
              Adult:{" "}
              {data.price.adult ? data.price.adult.toLocaleString() : "N/A"}{" "}
              VNDVND
            </p>
            <p>
              Children (1 - 11 Years):{" "}
              {data.price.children1_11
                ? data.price.children1_11.toLocaleString()
                : "N/A"}{" "}
              VND
            </p>
            <p>
              Children (Under 2 Years):{" "}
              {data.price.children12_plus
                ? data.price.children12_plus.toLocaleString()
                : "N/A"}{" "}
              VND
            </p>
          </Card>
          <Card title="Departure Points">{data.departurePoints}</Card>
          <Card title="Destination Points">{data.destinationPoints}</Card>
        </div>
      </Card>

      <div className="mt-4">
        <Collapse accordion>
          {data.itinerary.map((item: any, index) => (
            <Panel
              header={`Day ${item.day}: ${item.itineraryName}`}
              key={index}
            >
              <ul className="list-disc pl-5">
                {item.itineraryDetails.map(
                  (
                    detail: {
                      name:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | React.ReactPortal
                        | Promise<React.AwaitedReactNode>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined;
                      time:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<React.AwaitedReactNode>
                        | null
                        | undefined;
                      description:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<React.AwaitedReactNode>
                        | null
                        | undefined;
                      farmId:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<React.AwaitedReactNode>
                        | null
                        | undefined;
                    },
                    i: React.Key | null | undefined
                  ) => (
                    <li key={i}>
                      <p>
                        <strong>Time:</strong> {detail.time}
                      </p>
                      <p>
                        <strong>Description:</strong> {detail.description}
                      </p>
                      {detail.farmId && detail.name && (
                        <p>
                          <strong>Farm:</strong>{" "}
                          <a
                            href={`/manager/farms/${detail.farmId}`}
                            className="text-blue-500 hover:underline"
                          >
                            {detail.name}
                          </a>
                        </p>
                      )}
                    </li>
                  )
                )}
              </ul>
            </Panel>
          ))}
        </Collapse>
      </div>

      <Card className="mt-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold">Tour Price Includes</h3>
        <ul className="list-disc pl-5">
          {data.tourPriceIncludes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card className="mt-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold">Tour Price Not Includes</h3>
        <ul className="list-disc pl-5">
          {data.tourPriceNotIncludes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card className="mt-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold">Cancel Policy</h3>
        <div dangerouslySetInnerHTML={{ __html: data.cancelPolicy }} />
      </Card>

      <Card className="mt-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold">Deposit Policy</h3>
        <div dangerouslySetInnerHTML={{ __html: data.depositPolicy }} />
      </Card>
      <Card className="mt-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold">Promotion Policy</h3>
        <div dangerouslySetInnerHTML={{ __html: data.promotionPolicy }} />
      </Card>
      <Card className="mt-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold">Trip List</h3>
        <div className="mb-4">
          <RangePicker
            onChange={handleDateFilter}
            format="YYYY-MM-DD"
            className="w-full"
          />
        </div>
        <ul className="mt-2">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  <CalendarOutlined /> Departure Date: {trip.departureDate}
                </span>
                <EyeOutlined
                  className="cursor-pointer text-blue-500"
                  onClick={() =>
                    router.push(`/manager/trip/${trip.id}?tourId=${data.id}`)
                  }
                />
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No trips available for the selected date range.
            </p>
          )}
        </ul>
      </Card>

      <div className="flex justify-between mt-4">
        <Button type="default" onClick={() => router.push("/manager/tours")}>
          Back
        </Button>

        {data.numberOfTrips === 0 && data.isDeleted === false && (
          <>
            <Button
              type="primary"
              onClick={() => router.push(`/manager/tours/update/${data.id}`)}
            >
              Update
            </Button>
            <Popconfirm
              title="Are you sure?"
              description="Do you really want to delete this tour? This action cannot be undone."
              okText="Yes, delete it"
              cancelText="Cancel"
              onConfirm={() => handleDelete(data.id)}
              okType="danger"
            >
              <Button type="default" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        )}
      </div>
    </div>
  );
};

export default TourDetail;
