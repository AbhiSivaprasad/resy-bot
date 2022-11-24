import { useState } from "react";

function Input(props) {
  let color = props.color || "red";
  let textColor = props.textColor || "white";
  let [value, setValue] = useState(props.value);
  let changeHandler = (event) => {
    setValue(event.target.value);
    if (props.onChange) props.onChange(event.target.value);
  };
  let selectOptions = props.numberRange
    ? Array.from({ length: props.numberRange }, (_, i) => i + 1).map((i) => ({
        name: i,
        value: i,
      }))
    : props.selectOptions;
  let selectHandler = (item) => {
    setFocused(false);
    setValue(item.name);
    console.log("setting foucsed false");
    if (props.onSelect) props.onSelect(item);
  };
  let [focused, setFocused] = useState(false);
  return (
    <div className={`w-full relative ${props.className}`}>
      <input
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 100)}
        className="border-2 px-4 py-2 rounded-full w-full"
      />
      {selectOptions && focused && (
        <div className="absolute z-10 w-full rounded-3xl border top-0 pt-12">
          <div className="bg-wseite  px-4">
            {selectOptions.map((item) => (
              <div
                className="cursor-pointer border-b hover:bg-gray-200 duration-100"
                key={item.name}
                onClick={() => selectHandler(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Input;
