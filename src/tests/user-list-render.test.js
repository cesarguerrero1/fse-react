/*
 * Moved this test out of the file where we were mocking axios as it was preventing the code from running correctly!
 */

import { UserList } from "../components/profile/user-list.js";
import { screen, render } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { findAllUsers } from "../services/users-service.js";

test('user list renders async', async () => {
    const users = await findAllUsers();
        render(
        <HashRouter>
            <UserList users={users} />
        </HashRouter>
    );
    const linkElement = screen.getByText(/alice/i);
    expect(linkElement).toBeInTheDocument();
})