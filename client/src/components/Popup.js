import Button from "./Button";

function Popup(props) {
  return (
    <div
      className="fixed z-10 w-screen h-screen bg-gray-300 opacity-90 flex items-center justify-center"
      onClick={props.onCancel}
    >
      <div className="opacity-100 w-72 h-60 bg-white rounded-xl flex flex-col space-between">
        <div className="p-4 flex-grow">{props.children}</div>
        <div className="flex flex-row-reverse space-x-4 p-4">
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
