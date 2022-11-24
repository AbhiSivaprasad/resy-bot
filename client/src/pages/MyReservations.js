import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Popup from "../components/Popup";

function MyReservations() {
  let [pendingRequests, setPendingRequests] = useState([
    {
      venue_id: "10191",
      venue_name: "Chipotle",
      reservation_id: "12",
      slots: [
        {
          date: "2022-10-19",
          start_time: "12:00",
          end_time: "20:00",
        },
      ],
      retry_interval_seconds: 2,
      party_size: 2,
    },
    {
      venue_id: "10191",
      venue_name: "Chipotle",
      reservation_id: "12",
      slots: [
        {
          date: "2022-10-19",
          start_time: "12:00",
          end_time: "20:00",
        },
      ],
      retry_interval_seconds: 2,
      party_size: 2,
    },
  ]);
  let [completedRequests, setCompletedRequests] = useState([
    {
      venue_id: "10191",
      venue_name: "Chipotle",
      reservation_id: "12",
      slots: [
        {
          date: "2022-10-19",
          start_time: "12:00",
          end_time: "20:00",
        },
      ],
      retry_interval_seconds: 2,
      party_size: 2,
    },
    {
      venue_id: "10191",
      venue_name: "Chipotle",
      reservation_id: "12",
      slots: [
        {
          date: "2022-10-19",
          start_time: "12:00",
          end_time: "20:00",
        },
        {
          date: "2022-10-20",
          start_time: "12:00",
          end_time: "20:00",
        },
      ],
      retry_interval_seconds: 2,
      party_size: 2,
    },
  ]);

  let [requestToBeDeleted, setRequestToBeDeleted] = useState(null);

  let deleteRequest = () => {
    setRequestToBeDeleted(null);
    let id = fetch(process.env.REACT_APP_SERVER_URL + "/request", {
      mode: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("delete response was", res);
        setPendingRequests(
          pendingRequests.filter((request) => request.request_id != id)
        );
      });
  };

  let displayRequest = (request) => (
    <div
      key={request.reservation_id}
      className="w-full border border-gray-100 p-4"
    >
      <div className="flex flex-row items-center w-full">
        <div className="flex-grow">
          <div>{request.venue_name}</div>
          {request.slots
            .map(
              (slot) =>
                `On ${slot.date} bewteen ${slot.start_time} and ${slot.end_time}`
            )
            .join(", ")}
        </div>
        <Button onClick={() => setRequestToBeDeleted(request.reservation_id)}>
          Remove
        </Button>
      </div>
    </div>
  );
  return (
    <div>
      {requestToBeDeleted && (
        <Popup
          text="Are you sure you want to delete this reservation request? This cannot be undone."
          onSubmit={deleteRequest}
          onCancel={() => setRequestToBeDeleted(null)}
        ></Popup>
      )}
      <div className="flex flex-col items-center ">
        <div className="container flex flex-col">
          <div className="text-xl m-4 mt-10  font-semibold">
            Pending Reservation Requests
          </div>
          {pendingRequests.map(displayRequest)}
          <div className="w-full flex justify-center my-8">
            <Link to="/reserve">
              <Button className="w-72">Make a Reservation</Button>
            </Link>
          </div>
          <div className="text-xl m-4 mt-10 font-semibold">
            Completed Reservation Requests
          </div>
          {completedRequests.map(displayRequest)}
        </div>
      </div>
    </div>
  );
}

export default MyReservations;
