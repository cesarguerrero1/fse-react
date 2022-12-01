import React from "react";

export const UserList = ({ users, deleteUser }) => {
  return (
    <div className="list-group">
      {
        users.map(user => {
            return (
              <div className="list-group-item" key={user._id}>
                  <span className="fs-3">{user.username}</span>
                  <button className="btn btn-danger fa-pull-right" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    deleteUser(user._id)
                  }}>
                    <i className="fas fa-remove"></i>
                  </button>
              </div>
            )
        })
      }
    </div>)
};

export default UserList;