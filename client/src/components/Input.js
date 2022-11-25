import { useState } from "react";

function Input(props) {
  let color = props.color || "red";
  let textColor = props.textColor || "white";
  let [value, setValue] = useState("");
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
    console.log("setting value to ", item.name);
    setValue(item.name);
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
          className="cursor-pointer border-b hover:bg-gray-200 duration-100 flex flex-row items-center"
          key={item.name}
          onClick={() => selectResultHandler(item)}
        >
          <img className="w-12 h-12" src={item.images[0]} />
          <div className="mx-2">
            <div>{item.name}</div>
            <div className="text-sm text-gray-500">{item.cuisine}</div>
          </div>
          <div>
            <div onClick={(e) => openResySlug(e, item.url_slug)}>go</div>
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
          <div className="px-4">{item.name}</div>
        </div>
      );
    }
  };

  return (
    <div className={`w-full relative ${props.className}`}>
      <input
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        className="border-2 px-4 py-2 rounded-full w-full"
      />
      {options && focused && (
        <div className="absolute z-10 w-full rounded-3xl overflow-hidden border top-0 pt-12">
          <div className="bg-white">{options.map(displayResultHandler)}</div>
        </div>
      )}
    </div>
  );
}

export default Input;
