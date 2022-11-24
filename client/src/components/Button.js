function Button(props) {
  let color = props.color || "red";
  let textColor = props.textColor || "white";
  return (
    <div {...props}>
      <button
        disabled={props.disabled}
        className={
          props.disabled
            ? `rounded-mg bg-gray-500 text-white px-2.5 py-1.5 w-full rounded-md`
            : `rounded-md bg-${color}-500 hover:bg-red-400 duration-0.1 text-white px-2.5 py-1.5 w-full`
        }
      >
        {props.children}
      </button>
    </div>
  );
}

export default Button;
