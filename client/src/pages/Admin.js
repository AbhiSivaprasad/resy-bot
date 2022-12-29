import { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import Button from "../components/Button";
import Input from "../components/Input";
import Popup from "../components/Popup";

function Admin() {
  const [user, setUser] = useContext(UserContext);
  let [users, setUsers] = useState([]);
  let [userToDelete, setUserToDelete] = useState(undefined);
  let [newUserText, setNewUserText] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    if (user?.data?.user_id) {
      refreshUsers();
    }
  }, [user]);

  let refreshUsers = () =>
    fetch(
      process.env.REACT_APP_SERVER_URL +
        "/allUsers?adminUsername=" +
        user.data.user_id
    )
      .then((res) => {
        if (!res.ok) {
          navigate("/");
        } else {
          return res.json();
        }
      })
      .then(setUsers);

  let addUser = (userToAdd) => {
    fetch(process.env.REACT_APP_SERVER_URL + "/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userToAdd,
        adminUsername: user.data.user_id,
        concurrentLimit: 10,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        refreshUsers();
        setNewUserText("");
      });
  };

  let deleteUser = (userToDelete) => {
    fetch(process.env.REACT_APP_SERVER_URL + "/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userToDelete,
        adminUsername: user.data.user_id,
      }),
    })
      .then((res) => res.text())
      .then(() => {
        setUserToDelete("");
        refreshUsers();
      });
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <div className="text-3xl">Manage Users</div>
        {users.map((user) => (
          <div className="flex items-center space-x-4 my-2">
            <div className="w-32">{user}</div>
            <Button onClick={() => setUserToDelete(user)}>Delete</Button>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <Input
          onChange={setNewUserText}
          onEnter={() => addUser(newUserText)}
          value={newUserText}
          placeholder="new username..."
        ></Input>
        <Button onClick={() => addUser(newUserText)}>Add user</Button>
      </div>

      {userToDelete && (
        <Popup
          onCancel={() => setUserToDelete(undefined)}
          onSubmit={() => deleteUser(userToDelete)}
        >
          Are you sure you want to delete {userToDelete}?
        </Popup>
      )}
    </div>
  );
}

export default Admin;
