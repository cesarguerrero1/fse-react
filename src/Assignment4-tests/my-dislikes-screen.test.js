/**
* @jest-environment jsdom
*/

/*
Cesar Guerrero
CS5500 - Fall 2022
12/1/22

*/

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import MyDislikes from "../components/profile/my-dislikes.js"
import * as likesDislikesService from "../services/likes-dislikes-service.js";


//Import our components
describe('testing screen', () => {

    test('Test if tuit appears and then disappears if disliked', async () => {
        //JSDOM does not allow axios calls so we need to mock everything
        const mockFindTuits = jest.spyOn(likesDislikesService, 'findAllTuitsDislikedByUser').mockImplementationOnce(async () => {
            //When the page first loads we should send it all of the tuits 'disliked' by the user.
            return [{tuit:{
                    _id:1,
                    tuit:"My Tuit",
                    stats:{
                        likes:0,
                        dislikes:1
                    },
                    postedBy:{
                        username:"Cesar"
                    }
                }
            }]
        }).mockImplementationOnce(async () => {
            //When the page loads again after the click send it back nothing as if we did dislike the tuit
            return []
        })

        //When we click on the dislike button we are toggling our event which we need to mock
        const mockToggleEvent = jest.spyOn(likesDislikesService, 'userTogglesDislikeEvent').mockResolvedValueOnce(200);

        act(() => {
            render(
                <MyDislikes/>
            ) 
        })

        //We need to waitFor the page to render all of our content appropriately
        await waitFor(() => {
            //Check to make sure our tuit appeared
            const user = screen.queryByText(/Cesar/);
            expect(user).toBeInTheDocument();

            //Find the thumbs down button and click on it
            const clickableElement = screen.getByText((content, element) => {
                return element.className === 'far fa-thumbs-down me-1 text-danger'
            });
            fireEvent.click(clickableElement);
            expect(mockToggleEvent).toBeCalled();   
        });
        
        //Rerender the screen so we can verify that our tuit is no longer there
        await waitFor(() => {
            const user = screen.queryByText(/Cesar/);
            expect(user).toEqual(null);
        })
        

    })
})