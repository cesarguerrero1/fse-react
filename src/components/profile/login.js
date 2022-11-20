import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import * as service from "../../services/users-service";
import * as authService from "../../services/auth-service.js";
import Signup from "./signup.js";
import UserList from "./user-list.js"

export const Login = () => {
  const [existingUsers, setExistingUsers] = useState([]);
  const [loginUser, setLoginUser] = useState({});
  const navigate = useNavigate();
  
  const login = async () => {
    try{
        await authService.login(loginUser);
        navigate('/profile/mytuits');
    }catch{
      alert("Either your credentials are incorrect or the user does not exist!");
    }

  }

  const deleteUser = (uid) => service.deleteUser(uid).then(findAllUsers)
  const findAllUsers = () => service.findAllUsers().then(users => { setExistingUsers(users) })
  useEffect(() => {
    findAllUsers()
  }, []);

  return (
    <div>
      <Signup/>
      <h1>Login</h1>
      <input onChange={(event) => {setLoginUser({...loginUser, username: event.target.value})}}/>
      <input type="password" onChange={(event) => {setLoginUser({...loginUser, password: event.target.value})}}/>
      <button className="btn btn-primary fa-pull-right" onClick={login}>Login</button>
      <h1>Registered Users</h1>
      <UserList users={existingUsers} deleteUser={deleteUser}/>
    </div>
  );
};