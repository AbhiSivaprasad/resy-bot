import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import Button from "../components/Button";
import Popup from "../components/Popup";

function MyReservations() {
  let [pendingRequests, setPendingRequests] = useState([]);
  let [completedRequests, setCompletedRequests] = useState([]);
  const [user, setUser] = useContext(UserContext);
  useEffect(() => {
    if (user?.data?.user_id) {
      fetch(
        process.env.REACT_APP_SERVER_URL +
          "/reservationRequests?user_id=" +
          user?.data?.user_id
      )
        .then((res) => res.json())
        .then((res) => {
          setPendingRequests(res.filter((item) => !item.complete));
          setCompletedRequests(res.filter((item) => item.complete));
        });
    }
  }, [user]);

  let [requestToBeDeleted, setRequestToBeDeleted] = useState(null);

  let deleteRequest = () => {
    let temp = requestToBeDeleted;
    setRequestToBeDeleted(null);
    let id = fetch(
      process.env.REACT_APP_SERVER_URL +
        "/reservationRequests?reservation_id=" +
        requestToBeDeleted,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.text())
      .then((res) => {
        setPendingRequests(
          pendingRequests.filter((request) => request._id != temp)
        );
      });
  };

  let timeString = (time) =>
    time.toLocaleTimeString("en-us", {
      hour: "numeric",
      minute: "2-digit",
    });

  let dateString = (time) =>
    time.toLocaleTimeString("en-us", {
      month: "short",
      day: "numeric",
    });

  let displayRequest = (request) => (
    <div
      key={request.reservation_id}
      className="w-full border border-gray-100 p-4"
    >
      <div className="flex flex-row items-center w-full space-x-4">
        <div className="flex-grow">
          <div className="flex flex-row items-center space-x-4">
            <div>Venues: {request.venueId}</div>
          </div>
          {request.timeWindows &&
            request.timeWindows
              .map((slot) => {
                return `On ${dateString(
                  new Date(slot.startTime)
                )} bewteen ${timeString(
                  new Date(slot.startTime)
                )} and ${timeString(new Date(slot.endTime))}`;
              })
              .join(", ")}
          <span> for a party of </span>
          {request.partySizes[0]}
        </div>
        <Button onClick={() => setRequestToBeDeleted(request._id)}>
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
            Pending Reservation Requests ({pendingRequests.length})
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
