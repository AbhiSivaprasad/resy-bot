import Button from "./Button";

function Popup(props) {
  return (
    <div className="absolute z-10 w-screen h-screen bg-gray-300 opacity-90 flex items-center justify-center">
      <div className="w-72 h-60">
        <div className="p-4">{props.children}</div>
        <div className="flex flex-row-reverse space-x-4">
          <Button className="mx-2" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button onClick={props.onSubmit}>Ok</Button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
