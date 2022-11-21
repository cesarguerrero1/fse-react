/*
* Cesar Guerrero
* 11/19/22
* CS5500 - Fall 2022
* 
* Assignment 4
*/

import {useState} from "react";
import * as authService from "../../services/auth-service";
import {useNavigate} from "react-router-dom";

function Signup(){
    const [newUser, setNewUser] = useState({});
    const navigate = useNavigate();

    //When they click the signup button try to use their information to make an account!
    const signup = async () => {
        if(newUser.password && newUser.username && newUser.email){
            try{
                await authService.signup(newUser);
                navigate("/profile");
            }catch{
                alert("Username is taken!");
            }
        }else{
            alert("You are missing information!");
        }
    }

    return(
        <div>
            <h1>Signup</h1>
            <input className="mb-2 form-control" onChange={(event) => { setNewUser({...newUser, username: event.target.value})}} placeholder="username"/>
            <input type="password" className="mb-2 form-control" onChange={(event) => { setNewUser({...newUser, password: event.target.value})}} placeholder="password"/>
            <input className="mb-2 form-control" placeholder="email" type="email" onChange={(event) => { setNewUser({...newUser, email: event.target.value})}}/>
            <button className="btn btn-primary" onClick={signup}>Signup</button>
        </div>
    )
}

export default Signup;