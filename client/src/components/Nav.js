import { Link } from "react-router-dom";

const NavButton = (props) => (
  <div class="p-4">
    <Link to={props.to}>{props.text}</Link>
  </div>
);

function Nav() {
  let nav = [
    { to: "/", text: "Home" },
    { to: "/reserve", text: "Reserve" },
  ];
  return (
    <div className="container">
      <div className="flex flex-row space-x-4">
        {nav.map((item) => (
          <NavButton to={item.to} text={item.text} key={item.to} />
        ))}
      </div>
    </div>
  );
}

export default Nav;
