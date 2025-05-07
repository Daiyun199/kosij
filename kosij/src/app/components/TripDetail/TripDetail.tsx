/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Collapse, Rate, Tag } from "antd";
import { EyeOutlined, FileSearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  TagOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
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
  const handleViewDetail = (tripBookingId: number) => {
    const basePath =
      role === "sale" ? "/sale/passengers" : "/manager/passengers";
    router.push(
      `${basePath}/${tripBookingId}?tripId=${data.id}&custom=${custom}&requestId=${data.requestId}`
    );
  };
  const getRandomColor = () => {
    const colors = ["blue", "green", "purple", "yellow", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
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
            <p>
              Adult: {new Intl.NumberFormat("vi-VN").format(data.price.adult)}{" "}
              VND
            </p>
            <p>
              Children (1 - 11 Years):{" "}
              {new Intl.NumberFormat("vi-VN").format(data.price.children1_11)}{" "}
              VND
            </p>
            <p>
              Children (12+ Years):{" "}
              {new Intl.NumberFormat("vi-VN").format(
                data.price.children12_plus
              )}{" "}
              VND
            </p>
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
          <p>
            Visa Fee: {new Intl.NumberFormat("vi-VN").format(data.visaFee)}{" "}
          </p>
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
                              href={`/${role}/farms/${detail.farmId}`}
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
        {role === "manager" && (
          <Card className="mt-4 border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-lg mb-3">
              Staff Assignment History
            </h3>

            {data.staffHistory && data.staffHistory.length > 0 ? (
              <div className="space-y-6">
                {["SalesStaff", "ConsultingStaff"].map((role) => {
                  const staffByRole = data.staffHistory
                    .filter((staff: any) => staff.role === role)
                    .sort(
                      (a: any, b: any) =>
                        new Date(a.workStartTime).getTime() -
                        new Date(b.workStartTime).getTime()
                    );

                  return (
                    staffByRole.length > 0 && (
                      <div key={role}>
                        <h4 className="font-semibold text-md mb-2">
                          {role === "SalesStaff"
                            ? "Sales Staff"
                            : "Consulting Staff"}
                        </h4>
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                          <table className="w-full text-left text-sm table-fixed">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2 border w-1/4">Staff Name</th>
                                <th className="p-2 border w-1/4">Work Start</th>
                                <th className="p-2 border w-1/4">Work End</th>
                                <th className="p-2 border w-1/4">Note</th>
                              </tr>
                            </thead>
                            <tbody>
                              {staffByRole.map((staff: any, index: number) => (
                                <tr key={index} className="border-t">
                                  <td className="p-2 border">
                                    {staff.staffName}
                                  </td>
                                  <td className="p-2 border">
                                    {staff.workStartTime}
                                  </td>
                                  <td className="p-2 border">
                                    {staff.workEndTime}
                                  </td>
                                  <td className="p-2 border text-gray-600">
                                    {staff.note || "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            ) : (
              <p>No staff history available</p>
            )}
          </Card>
        )}
        <div className="mt-6">
          <h3 className="font-semibold text-xl mb-6 text-gray-800">
            Customer List
          </h3>
          {data.customers && data.customers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.customers.map((customer: any, index: number) => {
                const customerNote = data.notes?.find(
                  (note: any) => note.userName === customer.customerName
                )?.note;

                // Status color mapping
                const getStatusClass = (status: string) => {
                  switch (status) {
                    case "Pending":
                      return "bg-amber-100 text-amber-800";
                    case "Deposited":
                      return "bg-blue-100 text-blue-800";
                    case "Processing":
                      return "bg-purple-100 text-purple-800";
                    case "Paid":
                      return "bg-green-100 text-green-800";
                    case "CheckIn":
                      return "bg-teal-100 text-teal-800";
                    case "CheckOut":
                      return "bg-cyan-100 text-cyan-800";
                    case "Drafted":
                      return "bg-gray-100 text-gray-800";
                    case "Completed":
                      return "bg-emerald-100 text-emerald-800";
                    case "Cancelled":
                      return "bg-red-100 text-red-800";
                    case "Refunded":
                      return "bg-fuchsia-100 text-fuchsia-800";
                    default:
                      return "bg-gray-100 text-gray-800";
                  }
                };

                const statusClass = getStatusClass(customer.tripBookingStatus);

                return (
                  <div
                    key={index}
                    className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col relative"
                  >
                    {customer.isDeleted && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                        Deleted
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <UserOutlined className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {customer.customerName}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <PhoneOutlined className="text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {customer.phoneNumber}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <MailOutlined className="text-gray-400 mr-2" />
                        <span className="text-gray-600">{customer.email}</span>
                      </div>

                      <div className="flex items-center">
                        <TagOutlined className="text-gray-400 mr-2" />
                        <span
                          className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${statusClass}`}
                        >
                          {customer.tripBookingStatus}
                        </span>
                      </div>
                    </div>

                    {customerNote && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                          <FileTextOutlined className="mr-1" /> Note
                        </div>
                        <p className="text-gray-700">{customerNote}</p>
                      </div>
                    )}

                    <button
                      className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      onClick={() => handleViewDetail(customer.tripBookingId)}
                    >
                      <EyeOutlined className="mr-1.5" /> View Details
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <FileSearchOutlined className="text-3xl text-gray-400 mb-3" />
              <p className="text-gray-600">No customers available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
