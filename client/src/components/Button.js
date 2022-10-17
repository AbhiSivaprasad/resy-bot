function Button(props) {
  let color = props.color || "red";
  let textColor = props.textColor || "white";
  return (
    <div {...props}>
      <button
        className={`rounded-md bg-${color}-500 hover:bg-red-400 duration-0.1 text-white px-2.5 py-1.5`}
      >
        {props.children}
      </button>
    </div>
  );
}

export default Button;
