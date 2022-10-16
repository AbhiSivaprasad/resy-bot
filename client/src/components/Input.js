function Input(props) {
  let color = props.color || "red";
  let textColor = props.textColor || "white";
  return <input {...props} className="border-1" />;
}

export default Input;
