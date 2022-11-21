import Tuits from "../tuits/index.js";
import * as service from "../../services/tuits-service.js";
import * as authService from "../../services/auth-service.js";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

let isLoggedIn = false;

const Home = () => {
  const { uid } = useParams();
  const [tuits, setTuits] = useState([]);
  const [tuit, setTuit] = useState('');

  const userId = uid;

  //We want to show everyone's Tuits but we only want allow someone to post if they are logged in!
  async function findTuits(){
    const allTuits = await service.findAllTuits();
    setTuits(allTuits);

    //If a user is logged in then let them post tweets
    try{
      await authService.profile();
      isLoggedIn = true;
    }catch(e){
      isLoggedIn = false;
    }
    return;
  }

  const deleteTuit = async (tid) => {
      await service.deleteTuit(tid);
      findTuits();
      return;
  }

  const createTuit = async () => {
      if(tuit === ""){
        alert("Please input something before attempting to Tuit");
      }else{
        await service.createTuitByUser("me", { tuit: tuit, postedBy: userId });
        findTuits();
      }
      return;
  }

  useEffect(() => {
      findTuits(); 
  }, []);
  
  return (
    <div className="ttr-home">
      <div className="border border-bottom-0">
        <h4 className="fw-bold p-2">Home Screen</h4>
        { isLoggedIn &&
          <div className="d-flex">
            <div className="p-2">
              <img alt="Profile Circle" className="ttr-width-50px rounded-circle"
                src="../images/nasa-logo.jpg" />
            </div>
            <div className="p-2 w-100">
              <textarea onChange={(e) => setTuit(e.target.value)} placeholder="What's happening?" className="w-100 border-0"></textarea>
              <div className="row">
                <div className="col-10 ttr-font-size-150pc text-primary">
                  <i className="fas fa-portrait me-3"></i>
                  <i className="far fa-gif me-3"></i>
                  <i className="far fa-bar-chart me-3"></i>
                  <i className="far fa-face-smile me-3"></i>
                  <i className="far fa-calendar me-3"></i>
                  <i className="far fa-map-location me-3"></i>
                </div>
                <div className="col-2">
                  <button onClick={() => {
                    createTuit();
                  }}
                    className={`btn btn-primary rounded-pill fa-pull-right
                                  fw-bold ps-4 pe-4`}>
                    Tuit
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
      <Tuits tuits={tuits} deleteTuit={deleteTuit} refreshTuits={findTuits}/>
    </div>
  );
};
export default Home;