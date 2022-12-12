function Button(props) {
  let color = props.color || "red";
  let textColor = props.textColor || "white";
  return (
    <div {...props}>
      <button
        disabled={props.disabled}
        className={
          props.disabled
            ? `rounded-mg text-white px-2.5 py-1.5 w-full rounded-md ${props.buttonclasses} bg-gray-500 `
            : `rounded-md bg-${color}-500 hover:bg-red-400 duration-0.1 text-white px-2.5 py-1.5 w-full ${props.buttonclasses}`
        }
      >
        {props.children}
      </button>
    </div>
  );
}

export default Button;
