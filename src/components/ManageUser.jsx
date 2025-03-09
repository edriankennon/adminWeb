import React, { useEffect, useState } from 'react';
import '../styles/ManageUser.css';
import { auth } from '../firebase/config';
import { 
  getAuth, 
  deleteUser,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        const fetchedUsers = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email || '',
            displayName: data.username || '', // Changed from displayName to username
            role: data.role || 'N/A',        // Added role field
            lastSignIn: data.lastSignIn || 'Never',
            createdAt: data.createdAt || new Date().toISOString(),
            emailVerified: data.emailVerified || false,
            isSelected: false,
          };
        });

        setUsers(fetchedUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
        Swal.fire('Error', 'Failed to fetch users. Try again later.', 'error');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentPage > Math.ceil(users.length / itemsPerPage)) {
      setCurrentPage(Math.max(1, Math.ceil(users.length / itemsPerPage)));
    }
  }, [users, itemsPerPage, currentPage]);

  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.displayName && user.displayName.toLowerCase().includes(searchLower))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    const allSelected = users.every((user) => user.isSelected);
    const updatedUsers = users.map((user) => ({ ...user, isSelected: !allSelected }));
    setUsers(updatedUsers);
  };

  const handleCheckboxChange = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isSelected: !user.isSelected } : user
    );
    setUsers(updatedUsers);
  };

  const handleDeleteSelected = async () => {
    const selectedUsers = users.filter((user) => user.isSelected);
    if (selectedUsers.length === 0) {
      Swal.fire('No users selected', 'Please select users to delete.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete selected users?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      for (const user of selectedUsers) {
        const userRef = doc(db, 'users', user.id);
        await deleteDoc(userRef);
      }
      setUsers(users.filter((user) => !user.isSelected));
      Swal.fire('Deleted!', 'Selected users have been deleted from the database.', 'success');
    } catch (error) {
      console.error('Error deleting users:', error);
      Swal.fire('Error', 'Failed to delete some users. Try again later.', 'error');
    }
  };

  return (
    <div className="manage-users-container">
      <header className="header">
        <h2>Manage Users</h2>
        <div className="user-count">
          Total Users: <span>{users.length}</span>
        </div>
      </header>

      <div className="toolbar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by email or name"
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="actions">
          <button
            className="delete-user-button"
            onClick={handleDeleteSelected}
            disabled={users.every((user) => !user.isSelected)}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={users.every((user) => user.isSelected)}
                    id="select-all-checkbox"
                  />
                  <label htmlFor="select-all-checkbox" className="select-all-label">
                    Select all
                  </label>
                </th>
                <th>Name</th>
                <th>Role</th> {/* Added Role column */}
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.isSelected}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </td>
                  <td>{user.displayName || 'N/A'}</td>
                  <td>{user.role || 'N/A'}</td> {/* Added Role cell */}
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-button ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {'>'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;

