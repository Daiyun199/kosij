/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Collapse, Rate, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Panel } = Collapse;

const TripDetail = ({
  data,
  role,
  custom = false,
}: {
  data: any;
  role: string;
  custom: boolean;
}) => {
  const router = useRouter();
  console.log(data.id);
  const handleViewDetail = (tripBookingId: number) => {
    const basePath =
      role === "sale" ? "/sale/passengers" : "/manager/passengers";
    router.push(
      `${basePath}/${tripBookingId}?tripId=${data.id}&custom=${custom}&requestId=${data.requestId}`
    );
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md my-4">
          <span className="text-lg font-semibold">Average Rating:</span>
          <Rate allowHalf disabled defaultValue={data.averageRating} />
          <span className="text-lg font-bold">{data.averageRating}/5</span>
        </div>

        <Image
          src={data.tour.imageUrl}
          alt={data.tour.title}
          width={600}
          height={256}
          className="object-cover rounded-md mb-4 w-full h-64"
        />
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{data.tour.title}</h2>
          <Tag
            color={
              ["Available", "Ongoing"].includes(data.tripStatus)
                ? "green"
                : data.tripStatus === "NotStarted"
                ? "gray"
                : "red"
            }
          >
            {data.tripStatus}
          </Tag>
        </div>

        <p className="text-gray-500">Trip Type: {data.tripType}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Card title="Duration">{data.tour.duration}</Card>
          <Card title="Trip Duration">
            {data.departureDate} - {data.returnDate}
          </Card>
          <Card title="Days Remaining">{data.daysRemaining}</Card>
          <Card title="Minimum Participants">{data.minGroupSize}</Card>
          <Card title="Maximum Participants">{data.maxGroupSize}</Card>
          <Card title="Available Slots">{data.availableSlot}</Card>

          <Card title="Pricing">
            <p>Adult: {data.price.adult}</p>
            <p>Children (1 - 11 Years): {data.price.children1_11}</p>
            <p>Children (12+ Years): {data.price.children12_plus}</p>
          </Card>
          <Card title="Departure Point">{data.tour.departurePoint}</Card>
          <Card title="Destination Point">{data.tour.destinationPoint}</Card>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Sales Staff">
            {data.salesStaffName ? data.salesStaffName : "Not Assigned"}
          </Card>
          <Card title="Consultant Staff">
            {data.consultingStaffName
              ? data.consultingStaffName
              : "Not Assigned"}
          </Card>
        </div>
      </Card>

      <div className="mt-4">
        <Card className="mt-4 border border-gray-200 shadow-sm">
          <h3 className="font-semibold">Tour Details</h3>
          <p>Visa Fee: {data.visaFee}</p>
          <p>Registration Before: {data.registrationDaysBefore} days</p>
          <p>Registation Conditions: {data.registrationConditions}</p>
        </Card>
        <Card className="mt-4 border border-gray-200 shadow-sm">
          <h3 className="font-semibold">Tour Price Includes</h3>
          <ul className="list-disc pl-5">
            {data.tour.tourPriceIncludes.map((item: string, index: number) => (
              <li key={index}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-4 border border-gray-200 shadow-sm">
          <h3 className="font-semibold">Tour Price Not Includes</h3>
          <ul className="list-disc pl-5">
            {data.tour.tourPriceNotIncludes.map(
              (item: string, index: number) => (
                <li key={index}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </li>
              )
            )}
          </ul>
        </Card>

        <Card className="mt-4 border border-gray-200 shadow-sm">
          <h3 className="font-semibold">Cancellation Policy</h3>
          <ul className="list-disc pl-5">
            {data.tour.cancelPolicy.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card className="mt-4 border border-gray-200 shadow-sm">
          <h3 className="font-semibold">Deposit Policy</h3>
          <ul className="list-disc pl-5">
            {data.tour.depositPolicy.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card className="mt-4 border border-gray-200 shadow-sm">
          <h3 className="font-semibold">Promotion Policy</h3>
          <ul className="list-disc pl-5">
            {data.tour.promotionPolicy.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>

        <div className="mt-4">
          <Collapse accordion>
            {data.tour.itinerary.map((item: any, index: string | number) => (
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
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-4">Customer List</h3>
          {data.customers && data.customers.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {data.customers.map((customer: any, index: number) => {
                const customerNote = data.notes?.find(
                  (note: any) => note.userName === customer.customerName
                )?.note;

                return (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-md bg-white flex flex-col"
                  >
                    <p>
                      <strong>Name:</strong> {customer.customerName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {customer.phoneNumber}
                    </p>
                    <p>
                      <strong>Email:</strong> {customer.email}
                    </p>

                    {customerNote && (
                      <p className="mt-2 p-2 bg-gray-100 rounded-md">
                        <strong>Note:</strong> {customerNote}
                      </p>
                    )}

                    <button
                      className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewDetail(customer.tripBookingId)}
                    >
                      <EyeOutlined className="mr-1" /> Detail
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No customers available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
