import { useState } from 'react';

function Roles() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', orders: 15, reviews: 8 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', orders: 23, reviews: 12 },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Customer', orders: 7, reviews: 3 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', orders: 31, reviews: 18 },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Customer', orders: 5, reviews: 2 },
    { id: 6, name: 'Eva Martinez', email: 'eva@example.com', role: 'Customer', orders: 19, reviews: 11 },
  ]);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
  };

  return (
    <div className="roles-page">
      <div className="page-header">
        <h1 className="page-title">User Roles</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Number of Orders</th>
              <th>Number of Reviews</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
                </td>
                <td>{user.orders}</td>
                <td>{user.reviews}</td>
                <td>
                  <select
                    className="role-select"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="Customer">Customer</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Roles;
