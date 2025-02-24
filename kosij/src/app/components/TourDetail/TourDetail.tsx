"use client";
import React, { useState } from "react";
import { Card, Collapse, Tag, DatePicker } from "antd";
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { TourData } from "@/model/TourData";

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const TourDetail = ({ data }: { data: TourData }) => {
  const [filteredTrips, setFilteredTrips] = useState(data.tripList);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateFilter = (dates: any) => {
    if (!dates || dates.length !== 2) {
      setFilteredTrips(data.tripList);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [start, end] = dates.map((date: any) =>
      dayjs(date).format("YYYY-MM-DD")
    );
    const filtered = data.tripList.filter(
      (tripDate) => tripDate >= start && tripDate <= end
    );
    setFilteredTrips(filtered);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="border border-gray-200 shadow-sm">
        <img
          src={data.imageUrl}
          alt={data.title}
          className="w-full h-64 object-cover rounded-md mb-4"
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
            <p>Adult: {data.price.adult}</p>
            <p>Children (1 - 11 Years): {data.price.children1_11}</p>
            <p>Children (Under 2 Years): {data.price.children12_plus}</p>
          </Card>
          <Card title="Departure Points">{data.departurePoints}</Card>
          <Card title="Destination Points">{data.destinationPoints}</Card>
        </div>
      </Card>

      <div className="mt-4">
        <Collapse accordion>
          {data.itinerary.map((item, index) => (
            <Panel
              header={`Day ${item.day}: ${item.itineraryName}`}
              key={index}
            >
              <ul className="list-disc pl-5">
                {item.itineraryDetails.map((detail, i) => (
                  <li key={i}>
                    <p>
                      <strong>Time:</strong> {detail.time}
                    </p>
                    <p>
                      <strong>Description:</strong> {detail.description}
                    </p>
                    {detail.farmId && (
                      <p>
                        <strong>Farm ID:</strong> {detail.farmId}
                      </p>
                    )}
                  </li>
                ))}
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
            filteredTrips.map((date, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  <CalendarOutlined /> Departure Date: {date}
                </span>
                <EyeOutlined className="cursor-pointer" />
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No trips available for the selected date range.
            </p>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default TourDetail;
