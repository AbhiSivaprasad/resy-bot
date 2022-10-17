import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";

const ExpandableSection = (props) => {
  console.log("expanded step is", props.expandedStep, props.step);
  let isExpanded = true;
  let header = (
    <div className="w-full flex flex-row items-center">
      <div className="m-4 rounded-full text-white bg-red-500 w-10 p-4">
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
  let [expandedStep, setExpandedStep] = useState(1);
  const dummmyRestaurantList = [
    { name: "Nice Restaurant", stars: 3 },
    { name: "Nicer Restaurant", stars: 3 },
    { name: "Nicest Restaurant", stars: 3 },
  ];

  // form data
  let [restaurantList, setRestaurantList] = useState([]);
  let [startTime, setStartTime] = useState(null);
  let [endTime, setEndTime] = useState(null);
  let [dates, setDates] = useState([]);
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");

  return (
    <div className="flex flex-col items-center">
      <div className="container flex flex-col items-center">
        <div className="text-4xl">Let's make you a reservation!</div>
        <ExpandableSection
          expandedStep={expandedStep}
          step={1}
          classes="rounded-t-xl"
          setExpandedStep={setExpandedStep}
          name="Choose a set of restaurants & party size"
        >
          <div className="flex flex-col items-center">
            <div class="mb-2">Find me restaruants at</div>
            <Input
              className="w-96"
              selectOptions={dummmyRestaurantList}
              onSelect={(value) => {
                console.log("added ", value);
                setRestaurantList([...restaurantList, value]);
              }}
              placeholder="Start typing a restaurant name"
            ></Input>
            <div class="p-4 flex flex-row space-x-2 flex-wrap">
              {restaurantList.map((restaurant) => (
                <div
                  key={restaurant.name}
                  class="flex flex-row align-center bg-red-500 py-1 px-2 rounded-md space-x-2"
                >
                  <div>{restaurant.name}</div>
                  <button
                    onClick={() =>
                      setRestaurantList(
                        restaurantList.filter((r) => r.name != restaurant.name)
                      )
                    }
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <div>For a party of</div>
            <div className="max-w-54">
              <Input value={2} numberRange={10} />
            </div>
          </div>
        </ExpandableSection>
        <ExpandableSection
          expandedStep={expandedStep}
          step={2}
          setExpandedStep={setExpandedStep}
          name="Set some dates and times that you'd want to go"
        >
          <div className="flex flex-row items-center space-x-2">
            <div class="whitespace-nowrap">Get me reservations between</div>
            <Input
              onSelect={setStartTime}
              selectOptions={[
                { name: "5pm", value: "5pm" },
                { name: "6pm", value: "6pm" },
              ]}
            ></Input>
            <div class="whitespace-nowrap">and</div>

            <Input
              onSelect={setEndTime}
              selectOptions={[
                { name: "5pm", value: "5pm" },
                { name: "6pm", value: "6pm" },
              ]}
            ></Input>
            <div className="whitespace-nowrap">on these days:</div>
            <DatePicker
              defaultValue={new Date()}
              min={new Date()}
              valueFormat={{ dateStyle: "medium" }}
              onChange={(value) => setDates(value)}
              multiple
              plugins={[<DatePanel sort="date" />]}
              style={{
                height: "3em",
                borderRadius: "8px",
                fontSize: "17px",
                minWidth: "500px",
                padding: "3px 10px",
              }}
              numberOfMonths={1}
            ></DatePicker>
          </div>
        </ExpandableSection>
        <ExpandableSection
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
        </ExpandableSection>
        <Button
          onClick={() =>
            console.log(restaurantList, startTime, endTime, dates, name, email)
          }
          className="my-2"
        >
          Notify me when you have reserved!
        </Button>
      </div>
    </div>
  );
}

export default Reserve;
