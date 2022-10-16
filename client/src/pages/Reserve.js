import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

const ExpandableSection = (props) => {
  console.log("expanded step is", props.expandedStep, props.step);
  let isExpanded = props.expandedStep == props.step;
  let header = (
    <div className="w-full flex flex-row items-center">
      <div className="m-4 rounded-full bg-red-500 w-10 p-4">{props.step}</div>
      {props.name}
    </div>
  );
  return (
    <div
      className={`w-full p-4 border ${
        isExpanded ? "border-red-500" : "border-grey-300"
      }`}
    >
      {isExpanded ? (
        <div>
          {header}
          {props.children}
        </div>
      ) : (
        header
      )}
    </div>
  );
};

function Reserve() {
  let [expandedStep, setExpandedStep] = useState(1);
  return (
    <div className="flex flex-col items-center">
      <div className="container flex flex-col items-center">
        <div className="text-4xl">Let's make you a reservation!</div>
        <ExpandableSection
          expandedStep={expandedStep}
          step={1}
          onClick={() => setExpandedStep(1)}
          name="Choose a set of restaurants & party size"
        >
          <Input placeholder="Start typing a restaurant name"></Input>
        </ExpandableSection>
        <ExpandableSection
          expandedStep={expandedStep}
          step={2}
          onClick={() => setExpandedStep(2)}
          name="Set some dates and times that you'd want to go"
        >
          <Input placeholder="Start typing a restaurant name"></Input>
        </ExpandableSection>
        <ExpandableSection
          expandedStep={expandedStep}
          step={3}
          onClick={() => setExpandedStep(3)}
          name="Enter your email and submit!"
        >
          <Input placeholder="Email address..."></Input>
          <Button>Submit!</Button>
        </ExpandableSection>
      </div>
    </div>
  );
}

export default Reserve;
