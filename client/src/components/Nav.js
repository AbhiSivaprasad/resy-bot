import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const NavButton = (props) => (
  <div className="p-4">
    <Link
      to={props.to}
      className={
        window.location.pathname == props.to
          ? "py-2 px-4 font-bold border-b-2 border-red-500"
          : "py-2 px-4"
      }
    >
      {props.text}
    </Link>
  </div>
);

function Nav() {
  const [user, setUser] = useContext(UserContext);
  let navigate = useNavigate();
  let nav = user?.data
    ? [
        { to: "/reservations", text: "My Reservations" },
        { to: "/reserve", text: "Reserve" },
      ]
    : [{ to: "/", text: "Home" }];

  let logout = () => {
    localStorage.removeItem("username");
    setUser({});
    navigate("/");
  };
  return (
    <div className="container">
      <div className="flex flex-row justify-between items-center">
        <div className="ml-8 my-2 flex flex-row space-x-4">
          {nav.map((item) => (
            <NavButton to={item.to} text={item.text} key={item.to} />
          ))}
        </div>
        {user?.data && (
          <div className="cursor-pointer" onClick={() => logout()}>
            Logout
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
