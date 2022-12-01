import Tuits from "../tuits/index.js";
import * as likesDislikesService from "../../services/likes-dislikes-service.js";
import * as tuitService from "../../services/tuits-service.js";
import * as authService from "../../services/auth-service.js";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Home = () => {
  const { uid } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tuits, setTuits] = useState([]);
  const [tuit, setTuit] = useState('');

  const userId = uid;

  //We want to show everyone's Tuits but we only want allow someone to post if they are logged in!
  async function findTuits(){
    //If a user is logged in then let them post tweets
    let allTuits = await tuitService.findAllTuits();

    try{
      await authService.profile();
      setIsLoggedIn(true);

      //Grab all of the users likes and dislikes so we can highlight appropriately
      const usersLikedTuits = await likesDislikesService.findAllTuitsLikedByUser("me");
      const usersDislikedTuits = await likesDislikesService.findAllTuitsDislikedByUser("me");

      //We have to loop through all of the Likes
      for(let j = 0; j < usersLikedTuits.length; j++){
        const tid = usersLikedTuits[j].tuit._id;
        //Loop over every Tuit that will be displayed
        for(let i = 0; i < allTuits.length; i++){
          if(allTuits[i]._id === tid){
              allTuits[i].liked = true;
          }
        }
      }
      

      //We have to loop through all of the Dislikes
      for(let j=0; j < usersDislikedTuits.length; j++){
        const tid = usersDislikedTuits[j].tuit._id;
        //Loop over every Tuit that will be displayed
        for(let i = 0; i < allTuits.length; i++){
          if(allTuits[i]._id === tid){
              allTuits[i].disliked = true;
          }
        }
      }

    }catch(e){
      setIsLoggedIn(false);
      //User is not logged so all Tuits should not have highlights
      allTuits = allTuits.map((tuit) => {
        tuit.dislike = false;
        tuit.like = false;
        return tuit;
      })
    }

    setTuits(allTuits);
    return;
  }

  const deleteTuit = async (tid) => {
      await tuitService.deleteTuit(tid);
      findTuits();
      return;
  }

  const createTuit = async () => {
      if(tuit === ""){
        alert("Please input something before attempting to Tuit");
      }else{
        await tuitService.createTuitByUser("me", { tuit: tuit, postedBy: userId });
        setTuit('');
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
              <textarea onChange={(e) => setTuit(e.target.value)} placeholder="What's happening?" className="w-100 border-0" value={tuit}></textarea>
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
                  <button onClick={() => { createTuit() }} className={`btn btn-primary rounded-pill fa-pull-right fw-bold ps-4 pe-4`}>Tuit</button>
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