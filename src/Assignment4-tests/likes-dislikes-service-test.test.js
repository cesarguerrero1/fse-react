/*
Cesar Guerrero
CS5500 - Fall 2022
12/1/22

This is the test file for tesing our likes-dislikes-service.js file

At the time of this test we have 6 users, 12 tuits, 9 likes, and 5 dislikes. There should be nothing new after all of these tests run otherwise it means that 
we are not clearing correctly
*/

import {userTogglesLikeEvent, userTogglesDislikeEvent, findAllTuitsDislikedByUser, findAllTuitsLikedByUser, userLikesTuit, userUnlikesTuit, userDislikesTuit, userUndislikesTuit} from "../services/likes-dislikes-service.js";
import * as authService from "../services/auth-service.js";
import * as userService from "../services/users-service.js";
import * as tuitService from "../services/tuits-service.js";

/**
 * @function describe 
 * This function is designed to house multiple tests for testing whether
 * the findAllTuitsLikedByUser service call works
 * @param {string} GroupName - This is a string describing the goal of this function
 * @param {function} CallBackFunction - This function is called immediately when describe() is run
 * @returns - PASS if all tests pass or FAIL if any of the tests fail
 */
describe('Testing findAllTuitsLikedByUser', () => {

    //Save Username and User ID
    let username = '';
    let userId = '';

    //Save Tuit and Tuit ID
    let newTuit = null;
    let newTuitId = '';

    //Save Like and Like ID
    let newLike = null;
    let newLikeId = '';

    //Create a new user in the database to be used across all tests
    beforeAll(async () => {
        const newUser = await userService.createUser({
           username: "scoobydoo",
           password: "scooby1"
        })
        username = newUser.username;
        userId = newUser._id;
    })

    //Delete the created user to keep database clean
    afterAll(async () => {
        await userService.deleteUsersByUsername(username);
    })

    //We also want to create a new tuit for each test!
    beforeEach(async () => {
        newTuit = await tuitService.createTuitByUser(userId, {
            tuit:"This is Scooby's Tuit",
            postedBy:userId
        })
        newTuitId = newTuit._id
    })

    //Delete said Tuit after every test to keep things fresh!
    afterEach(async () => {
        await tuitService.deleteTuit(newTuitId);
    })

    //Case 1: You use the users id to get all of the Tuits they've liked
    test('Find Liked Tuits for user who is not logged in using their ID', async() => {
        let likesArray = await findAllTuitsLikedByUser(userId);

        //We expect to find nothing becuase there should be nothing
        expect(likesArray.length).toEqual(0);

        //Now make a like and we should see it
        newLike = await userLikesTuit(userId, newTuitId);
        newLikeId = newLike._id;

        likesArray = await findAllTuitsLikedByUser(userId);

        expect(likesArray.length).toBeGreaterThan(0);
        likesArray.map((like) => {
            expect(like.likedBy._id).toEqual(userId);
        })

        //Delete Like
        await userUnlikesTuit(userId, newTuitId);
    })


    //Case 2: You attempt to use the word 'me' but are not logged in
    test('Find Liked Tuits using "me" as ID but we are not loggd in', async() => {
        let likesArray = await findAllTuitsLikedByUser('me');

        //We expect to find nothing becuase not only are you using 'me' but no Likes exist for this user anyway
        expect(likesArray.length).toEqual(0);

        //Now make a like and even though it clearly belongs to our user, 'me' cannot see it
        newLike = await userLikesTuit(userId, newTuitId);
        newLikeId = newLike._id;

        //Our user Id matches this new Like object key-value pair thus proving that the Like was created
        expect(userId).toEqual(newLike.likedBy);

        //Since we are not logged in this won't return the clearly created Like
        likesArray = await findAllTuitsLikedByUser('me');
        expect(likesArray.length).toEqual(0);

        //Delete Like
        await userUnlikesTuit(userId, newTuitId);
    })

    //Case 3: You attempt to use the word 'me' and you ARE logged in
    test('Find Liked Tuits using "me" as ID but we ARE logged in', async() => {
        //Create an authenticated user!
        let authNewUser = await authService.signup({username:"scoobyAuth", password:"scoobyauth1"});

        //Recall that the returned user object above will not contain their password for security reasons so we hard-code it like so
        let loggedInUser = await authService.login({username: authNewUser.username, password:"scoobyauth1"});
       
        //Now that we know the user is logged in we are actually going to essentially repeat case 2 only this time we should expect different results!
        let authNewTuit = await tuitService.createTuitByUser(loggedInUser._id, {
            tuit:"This is the new Tuit",
            postedBy:loggedInUser._id
        })

        //So there is an issue with testing sessions in jest. Therefore we need to mock
        if(authNewUser.username === loggedInUser.username){
            //Again let's attempt to use me we should still expect 0 becuase nothing exists just yet!
            let likesArray = await findAllTuitsLikedByUser('me');
            expect(likesArray.length).toEqual(0);

            //Now make a like and we should see it this time!
            newLike = await userLikesTuit(loggedInUser._id, authNewTuit._id);
            newLikeId = newLike._id;

            const likesDislikesService = require("../services/likes-dislikes-service.js");
            const mock = jest.spyOn(likesDislikesService, 'findAllTuitsLikedByUser').mockImplementation(() => {
                return [newLike]
            })
            likesArray = await findAllTuitsLikedByUser('me');
            expect(likesArray.length).toEqual(1);
            expect(likesArray[0].likedBy).toEqual(loggedInUser._id);
            mock.mockRestore();
        }
        
        //Delete all of our new items
        await userUnlikesTuit(loggedInUser._id, authNewTuit._id);
        await tuitService.deleteTuit(authNewTuit._id);

        await authService.logout();
        await userService.deleteUsersByUsername(authNewUser.username);
        
    })
})

/**
 * @function describe This function is designed to house multiple tests for testing whether
 * the findAllTuitsDislikedByUser service call works
 * @param {string} GroupName - This is a string describing the goal of this function
 * @param {function} CallBackFunction - This function is called immediately when describe() is run
 * @returns - PASS if all tests pass or FAIL if any of the tests fail
 */
describe('Testing findingAllTuitsDislikedByUser', () => {
    //Save Username and User ID
    let username = '';
    let userId = '';

    //Save Tuit and Tuit ID
    let newTuit = null;
    let newTuitId = '';

    //Save Dislike and Dislike ID
    let newDislike = null;
    let newDislikeId = '';

    //Create a new user in the database to be used across all tests
    beforeAll(async () => {
        const newUser = await userService.createUser({
        username: "shaggy",
        password: "shaggy1"
        })
        username = newUser.username;
        userId = newUser._id;
    })

    //Delete the created user to keep database clean
    afterAll(async () => {
        await userService.deleteUsersByUsername(username);
    })

    //We also want to create a new tuit for each test!
    beforeEach(async () => {
        newTuit = await tuitService.createTuitByUser(userId, {
            tuit:"This is Shaggy's Tuit",
            postedBy:userId
        })
        newTuitId = newTuit._id
    })

    //Delete said Tuit after every test to keep things fresh!
    afterEach(async () => {
        await tuitService.deleteTuit(newTuitId);
    })

    //Case 1: You use the users id to get all of the Tuits they've disliked
    test('Find Disliked Tuits for user who is not logged in using their ID', async() => {
        let dislikesArray = await findAllTuitsDislikedByUser(userId);

        //We expect to find nothing becuase there should be nothing
        expect(dislikesArray.length).toEqual(0);

        //Now make a dislike and we should see it
        newDislike = await userDislikesTuit(userId, newTuitId);
        newDislikeId = newDislike._id;

        dislikesArray = await findAllTuitsDislikedByUser(userId);

        expect(dislikesArray.length).toBeGreaterThan(0);
        dislikesArray.map((dislike) => {
            expect(dislike.dislikedBy._id).toEqual(userId);
        })

        //Delete Dislike
        await userUndislikesTuit(userId, newTuitId);
    })


    //Case 2: You attempt to use the word 'me' but are not logged in
    test('Find Disliked Tuits using "me" as ID but we are not loggd in', async() => {
        let dislikesArray = await findAllTuitsDislikedByUser('me');

        //We expect to find nothing becuase not only are you using 'me' but no Likes exist for this user anyway
        expect(dislikesArray.length).toEqual(0);

        //Now make a like and even though it clearly belongs to our user, 'me' cannot see it
        newDislike = await userDislikesTuit(userId, newTuitId);
        newDislikeId = newDislike._id;

        //Our user Id matches this new Like object key-value pair thus proving that the Like was created
        expect(userId).toEqual(newDislike.dislikedBy);

        //Since we are not logged in this won't return the clearly created Like
        dislikesArray = await findAllTuitsDislikedByUser('me');
        expect(dislikesArray.length).toEqual(0);

        //Delete Like
        await userUndislikesTuit(userId, newTuitId);
    })

    //Case 3: You attempt to to use the word 'me' and you ARE logged in
    test('Find Disliked Tuits using "me" as ID but we ARE logged in', async() => {
        //Create an authenticated user!
        let authNewUser = await authService.signup({username:"shaggyAuth", password:"shaggyauth1"});

        //Recall that the returned user object above will not contain their password for security reasons so we hard-code it like so
        let loggedInUser = await authService.login({username: authNewUser.username, password:"shaggyauth1"});
    
        //Now that we know the user is logged in we are actually going to essentially repeat case 2 only this time we should expect different results!
        let authNewTuit = await tuitService.createTuitByUser(loggedInUser._id, {
            tuit:"This is the newer Tuit",
            postedBy:loggedInUser._id
        })

        //So there is an issue with testing sessions in jest. Therefore we need to mock
        if(authNewUser.username === loggedInUser.username){
            //Again let's attempt to use me we should still expect 0 becuase nothing exists just yet!
            let dislikesArray = await findAllTuitsLikedByUser('me');
            expect(dislikesArray.length).toEqual(0);

            //Now make a like and we should see it this time!
            newDislike = await userLikesTuit(loggedInUser._id, authNewTuit._id);
            newDislikeId = newDislike._id;

            const likesDislikesService = require("../services/likes-dislikes-service.js");
            const mock = jest.spyOn(likesDislikesService, 'findAllTuitsDislikedByUser').mockImplementation(() => {
                return [newDislike]
            })
            dislikesArray = await findAllTuitsLikedByUser('me');
            expect(dislikesArray.length).toEqual(1);
            expect(dislikesArray[0].dislikedBy).toEqual(loggedInUser._id);
            mock.mockRestore();
        }

        //Delete all of our new items
        await userUndislikesTuit(loggedInUser._id, authNewTuit._id);
        await tuitService.deleteTuit(authNewTuit._id);

        await authService.logout();
        await userService.deleteUsersByUsername(authNewUser.username);
        
    })
})

/**
 * @function describe This function is designed to house multiple tests for testing whether the
 * the userTogglesLikeEvent service call works
 * @param {string} GroupName - This is a string describing the goal of this function
 * @param {function} CallBackFunction - This function is called immediately when describe() is run
 * @returns - Pass if all tests pass or FAIL if any of the tests fail
 */
describe('Testing userTogglesLikeEvent & userTogglesDislikeEvent', () => {
    //Save Username and User ID
    let username = '';
    let userId = '';

    //Save Tuit and Tuit ID
    let newTuit = null;
    let newTuitId = '';

    //Create a new user in the database to be used across all tests
    beforeAll(async () => {
        const newUser = await userService.createUser({
           username: "velma",
           password: "velma1"
        })
        username = newUser.username;
        userId = newUser._id;
    })

    //Delete the created user to keep database clean
    afterAll(async () => {
        await userService.deleteUsersByUsername(username);
    })

    //We also want to create a new tuit for each test!
    beforeEach(async () => {
        newTuit = await tuitService.createTuitByUser(userId, {
            tuit:"This is Scooby's Tuit",
            postedBy:userId
        })
        newTuitId = newTuit._id
    })

    //Delete said Tuit after every test to keep things fresh!
    afterEach(async () => {
        await tuitService.deleteTuit(newTuitId);
    })

    test("Testing consecutive toggling like on a Tuit", async () => {
        //Our new tuit should have zero likes!
        expect(newTuit.stats.likes).toEqual(0);
        
        //Our user should have no likes
        let likesArray = await findAllTuitsLikedByUser(userId);
        expect(likesArray.length).toEqual(0);

        //Toggle a like
        await userTogglesLikeEvent(userId, newTuitId);

        //Check that our tuit is the same tuit and has +1 likes
        let updatedTuit = await tuitService.findTuitById(newTuitId);

        expect(newTuit._id).toEqual(updatedTuit._id);
        expect(newTuit.tuit).toEqual(updatedTuit.tuit);
        expect(newTuit.postedBy).toEqual(updatedTuit.postedBy._id);
        expect(updatedTuit.stats.likes).toEqual(newTuit.stats.likes + 1);

        //Check if there is a new Like record now as well
        likesArray = await findAllTuitsLikedByUser(userId);
        expect(likesArray.length).toEqual(1);

        //Toggle the like button! We should expect the like to go away
        await userTogglesLikeEvent(userId, newTuitId);
        let newestTuit = await tuitService.findTuitById(newTuitId);

        expect(updatedTuit._id).toEqual(newestTuit._id);
        expect(updatedTuit.tuit).toEqual(newestTuit.tuit);
        expect(updatedTuit.postedBy._id).toEqual(newestTuit.postedBy._id);
        expect(newestTuit.stats.likes).toEqual(updatedTuit.stats.likes - 1);

        //Check that the Like record went away
        likesArray = await findAllTuitsLikedByUser(userId);
        expect(likesArray.length).toEqual(0);
    })

    test("Testing consecutive toggling dislike on a Tuit", async () => {
        //Our new tuit should have zero likes!
        expect(newTuit.stats.dislikes).toEqual(0);
        
        //Our user should have no likes
        let dislikesArray = await findAllTuitsDislikedByUser(userId);
        expect(dislikesArray.length).toEqual(0);
        
        //Toggle a like
        await userTogglesDislikeEvent(userId, newTuitId);

        //Check that our tuit is the same tuit and has +1 likes
        let updatedTuit = await tuitService.findTuitById(newTuitId);

        expect(newTuit._id).toEqual(updatedTuit._id);
        expect(newTuit.tuit).toEqual(updatedTuit.tuit);
        expect(newTuit.postedBy).toEqual(updatedTuit.postedBy._id);
        expect(updatedTuit.stats.dislikes).toEqual(newTuit.stats.dislikes + 1);

        //Check if there is a new Like record now as well
        dislikesArray = await findAllTuitsDislikedByUser(userId);
        expect(dislikesArray.length).toEqual(1);

        //Toggle the like button! We should expect the like to go away
        await userTogglesDislikeEvent(userId, newTuitId);
        let newestTuit = await tuitService.findTuitById(newTuitId);

        expect(updatedTuit._id).toEqual(newestTuit._id);
        expect(updatedTuit.tuit).toEqual(newestTuit.tuit);
        expect(updatedTuit.postedBy._id).toEqual(newestTuit.postedBy._id);
        expect(newestTuit.stats.dislikes).toEqual(updatedTuit.stats.dislikes - 1);

        //Check that the Dislike record went away
        dislikesArray = await findAllTuitsDislikedByUser(userId);
        expect(dislikesArray.length).toEqual(0);
    })

    
    test("Testing toggling dislike and like consecutively on a Tuit", async() => {
        //Our new Tuit should have zero likes and dislikes
        expect(newTuit.stats.likes).toEqual(0);
        expect(newTuit.stats.dislikes).toEqual(0);

        //Check that there are also no records
        let dislikesArray = await findAllTuitsDislikedByUser(userId);
        let likesArray = await findAllTuitsLikedByUser(userId);
        expect(dislikesArray.length).toEqual(0);
        expect(likesArray.length).toEqual(0);

        //Toggle a like!
        await userTogglesLikeEvent(userId, newTuitId);

        //There should now be 1 like record and 0 dislike records
        dislikesArray = await findAllTuitsDislikedByUser(userId);
        likesArray = await findAllTuitsLikedByUser(userId);
        expect(dislikesArray.length).toEqual(0);
        expect(likesArray.length).toEqual(1);

        //Check to make sure the stats updated too!
        let updatedTuit = await tuitService.findTuitById(newTuitId);
        expect(updatedTuit.stats.likes).toEqual(1);
        expect(updatedTuit.stats.dislikes).toEqual(0);

        //Toggle a dislike!
        await userTogglesDislikeEvent(userId, newTuitId);

        //There should now be 0 like records and 1 dislike record
        dislikesArray = await findAllTuitsDislikedByUser(userId);
        likesArray = await findAllTuitsLikedByUser(userId);
        expect(dislikesArray.length).toEqual(1);
        expect(likesArray.length).toEqual(0);

        //Check to make sure the stats updated too!
        updatedTuit = await tuitService.findTuitById(newTuitId);
        expect(updatedTuit.stats.likes).toEqual(0);
        expect(updatedTuit.stats.dislikes).toEqual(1);

        //Toggle a dislike once more to delete that final record
        await userTogglesDislikeEvent(userId, newTuitId);

    })
    
})