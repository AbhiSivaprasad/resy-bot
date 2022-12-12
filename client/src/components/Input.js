import { useState } from "react";
const resy_logo = require("../img/resy_logo.png");
function Input(props) {
  let color = props.color || "red";
  let textColor = props.textColor || "white";

  // this is so that we can set the initial value from the controlling component
  // let initValue =
  //   typeof props.value == "number" && props.options
  //     ? props.options[props.value]
  //     : "";
  let [value, setValue] = useState(props.value);
  let changeHandler = (event) => {
    setValue(event.target.value);
    if (props.onChange) props.onChange(event.target.value);
  };
  let options = props.numberRange
    ? Array.from({ length: props.numberRange }, (_, i) => i + 1).map((i) => ({
        name: i,
        value: i,
      }))
    : props.options;
  let [focused, setFocused] = useState(false);
  let selectResultHandler = (item) => {
    setValue(props.resetAfterSelection ? "" : item.name);
    setFocused(false);
    if (props.onSelect) props.onSelect(item);
  };
  let openResySlug = (event, url) => {
    event.preventDefault();
    event.stopPropagation();
    window.open("https://resy.com/cities/ny/" + url);
  };
  let displayResultHandler = (item) => {
    if (props.optionType == "venue") {
      return (
        <div
          className="cursor-pointer border-b hover:bg-gray-200 duration-100 flex flex-row items-center pr-4"
          key={item.name}
          onClick={() => selectResultHandler(item)}
        >
          <img
            className="w-12 h-12"
            src={item.images?.length > 0 && item.images[0]}
          />
          <div className="mx-2 flex-grow">
            <div>{item.name}</div>
            <div className="text-sm text-gray-500">{item.cuisine}</div>
          </div>
          <div>
            <div onClick={(e) => openResySlug(e, item.url_slug)}>
              <img width="60px" height="20px" src={resy_logo} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="cursor-pointer border-b hover:bg-gray-200 duration-100"
          key={item.name}
          onClick={() => selectResultHandler(item)}
        >
          <div className="px-4 py-2">{item.name}</div>
        </div>
      );
    }
  };

  return (
    <div className={`w-full relative ${props.className}`}>
      <input
        autoFocus={props.autoFocus}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onKeyDown={(event) => {
          if (event.key == "Enter" && props.onEnter) {
            props.onEnter();
          }
        }}
        value={value}
        disabled={props.disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        className="border-2 px-4 py-2 rounded-full w-full"
      />
      {options && options.length > 0 && focused && (
        <div
          className="absolute z-10 w-full rounded-b-3xl border top-10 overflow-y-scroll"
          style={{ maxHeight: "300px" }}
        >
          <div className="bg-white">{options.map(displayResultHandler)}</div>
        </div>
      )}
    </div>
  );
}

export default Input;
