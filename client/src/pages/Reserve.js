import React, { useState, useEffect, useContext } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const TIME_OPTIONS = Array(96)
  .fill(0)
  .map((_, i) => i)
  .map((i) => Math.floor(i / 4) + ":" + String((i % 4) * 15).padStart(2, "0"))
  .map((i) => ({ name: i, value: i }));

const MAX_VENUES_PER_REQUEST = 5;

const ExpandableSection = (props) => {
  let isExpanded = true;
  let header = (
    <div className="w-full flex flex-row items-center">
      <div className="m-4  rounded-full text-white bg-red-500 w-10 p-4">
        {props.step}
      </div>
      {props.name}
    </div>
  );
  return (
    <div
      className={`w-full p-4 border ${props.classes} ${isExpanded ? "" : ""}`}
      onClick={() => props.setExpandedStep(props.step)}
    >
      {isExpanded ? <div>{props.children}</div> : header}
    </div>
  );
};

function Reserve() {
  let navigate = useNavigate();
  let [expandedStep, setExpandedStep] = useState(1);
  // form data
  let [selectedVenue, setSelectedVenue] = useState([]);
  let [startTime, setStartTime] = useState(null);
  let [endTime, setEndTime] = useState(null);
  let [partySize, setPartySize] = useState(2);
  let [dates, setDates] = useState([]);
  let [venues, setVenues] = useState([]);
  // let [name, setName] = useState("");
  // let [email, setEmail] = useState("");

  let [venueSearchResults, setVenueSearchResults] = useState([]);
  let [venueSearchQuery, setVenueSearchQuery] = useState("");
  const [user, setUser] = useContext(UserContext);
  const [location, setLocation] = useState("");

  useEffect(() => navigator.geolocation.getCurrentPosition(setLocation), []);

  useEffect(() => {
    if (venueSearchQuery.length == 0) {
      setVenueSearchResults([]);
      return;
    }
    let query = {
      geo: {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
      },
      per_page: 5,
      party_size: 2,
      api_key: user?.data?.api_key,
      auth_token: user?.data?.auth_token,
      query: venueSearchQuery,
    };
    fetch(process.env.REACT_APP_SERVER_URL + "/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    })
      .then((res) => res.json())
      .then((res) => setVenueSearchResults(res?.search?.hits));
  }, [venueSearchQuery]);

  let reserve = () => {
    fetch(process.env.REACT_APP_SERVER_URL + "/reserve", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.data.userId,
        venue_ids: [selectedVenue.objectID],
        retry_interval_seconds: 10,
        party_size: partySize,
        slots: dates.map((date) => ({
          date:
            date.year +
            "-" +
            String(date.monthIndex).padStart(2, "0") +
            "-" +
            String(date.day).padStart(2, "0"),
          start_time: startTime.value,
          end_time: endTime.value,
        })),
        api_key: user.data.api_key,
        auth_token: user.data.auth_token,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == "success") {
          navigate("/reservations");
        }
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="container flex flex-col items-center">
        <div className="text-4xl my-8">Let's make you a reservation!</div>
        <ExpandableSection
          expandedStep={expandedStep}
          step={1}
          classes="rounded-t-xl border-b-white"
          setExpandedStep={setExpandedStep}
          name="Choose a set of restaurants & party size"
        >
          <div className="flex flex-col items-center">
            <div className="mb-2">Find me reservations at one of:</div>
            <Input
              className="w-96"
              resetAfterSelection
              autoFocus
              options={venueSearchResults}
              value={venueSearchQuery}
              onChange={setVenueSearchQuery}
              optionType="venue"
              onSelect={(venue) => {
                setVenues([...venues, venue]);
                setVenueSearchResults([]);
              }}
              placeholder={
                venues.length >= MAX_VENUES_PER_REQUEST
                  ? `Limit ${MAX_VENUES_PER_REQUEST} restaurants per request.`
                  : "Start typing a restaurant name"
              }
              disabled={venues.length >= MAX_VENUES_PER_REQUEST}
            ></Input>
            <div className="p-4 flex flex-row space-x-2 flex-wrap text-white">
              {venues.map((venue) => (
                <div
                  key={venue.name}
                  className="flex flex-row align-center bg-red-500 rounded-md space-x-2"
                >
                  <div className="py-1 pl-2">{venue.name}</div>
                  <button
                    className="py-1 pr-2"
                    onClick={() =>
                      setVenues(venues.filter((v) => v.name != venue.name))
                    }
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">For a party of</div>
            <div className="max-w-54">
              <Input numberRange={10} onSelect={setPartySize} />
            </div>
          </div>
        </ExpandableSection>
        <ExpandableSection
          expandedStep={expandedStep}
          step={2}
          setExpandedStep={setExpandedStep}
          name="Set some dates and times that you'd want to go"
        >
          <div className="flex flex-col lg:flex-row items-center space-x-2">
            <div className="whitespace-nowrap">Get me reservations between</div>
            <div className="flex flex-row items-center space-x-4">
              <Input
                className="w-32"
                onSelect={setStartTime}
                options={TIME_OPTIONS}
              ></Input>
              <div className="whitespace-nowrap">and</div>

              <Input
                className="w-32"
                onSelect={setEndTime}
                options={TIME_OPTIONS}
              ></Input>
            </div>
            <div className="whitespace-nowrap">on these days:</div>
            <DatePicker
              defaultValue={new Date()}
              min={new Date()}
              valueFormat={{ dateStyle: "medium" }}
              onChange={(value) => setDates(value)}
              multiple
              plugins={[<DatePanel sort="date" />]}
              style={{
                flexGrow: 1,
                height: "3em",
                borderRadius: "8px",
                fontSize: "17px",
                width: "100%",
                padding: "3px 10px",
              }}
              numberOfMonths={1}
            ></DatePicker>
          </div>
        </ExpandableSection>
        {/* <ExpandableSection
          expandedStep={expandedStep}
          step={3}
          classes="rounded-b-xl"
          setExpandedStep={setExpandedStep}
          name="Give us your contact info!"
        >
          <div className="flex flex-row items-center space-x-4">
            <div className="whitespace-nowrap">My name is </div>
            <Input
              value={name}
              onChange={setName}
              placeholder="Name..."
            ></Input>
            <div className="whitespace-nowrap">and you can contact me by </div>
            <Input onChange={setEmail} placeholder="Email address..."></Input>
          </div>
        </ExpandableSection> */}
        <Button
          disabled={
            !partySize ||
            !startTime ||
            !endTime ||
            !dates ||
            !dates.length ||
            !selectedVenue
          }
          onClick={reserve}
          className="my-8"
          buttonClasses="rounded-full px-8 py-4 font-bold"
        >
          Notify me when you have reserved!
        </Button>
      </div>
    </div>
  );
}

export default Reserve;
