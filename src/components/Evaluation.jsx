import React, { useEffect, useState } from 'react';
import '../styles/Evaluation.css';
import { db } from '../firebase/config';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const Evaluation = () => {
  const [entries, setEntries] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesCollection = collection(db, 'evaluationData');
        const snapshot = await getDocs(entriesCollection);

        const fetchedEntries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched Entries:', fetchedEntries);
        setEntries(fetchedEntries);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching entries from Firestore:', error.message);
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.businessType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedEntries = entries.map((entry) =>
      filteredEntries.some((filtered) => filtered.id === entry.id)
        ? { ...entry, isSelected: newSelectAll }
        : entry
    );
    setEntries(updatedEntries);
  };

  const handleCheckboxChange = (id) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, isSelected: !entry.isSelected } : entry
    );
    setEntries(updatedEntries);
    setSelectAll(updatedEntries.every((entry) => entry.isSelected));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    const selectedEntries = entries.filter((entry) => entry.isSelected);
    if (selectedEntries.length === 0) {
      Swal.fire('No entries selected', 'Please select entries to delete.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete selected entries?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    for (const entry of selectedEntries) {
      try {
        await deleteDoc(doc(db, 'evaluationData', entry.id));
      } catch (error) {
        console.error(`Error deleting entry ${entry.id}:`, error.message);
      }
    }
    setEntries(entries.filter((entry) => !entry.isSelected));
    setSelectAll(false);
    Swal.fire('Deleted!', 'Selected entries have been deleted.', 'success');
  };

  const handleApprove = async () => {
    const selectedEntries = entries.filter((entry) => entry.isSelected && entry.status !== 'Active');
    if (selectedEntries.length === 0) {
      Swal.fire('No entries to approve', 'Please select entries to approve.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve selected entries?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve them!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    for (const entry of selectedEntries) {
      try {
        await updateDoc(doc(db, 'evaluationData', entry.id), { status: 'Active' });
      } catch (error) {
        console.error(`Error approving entry ${entry.id}:`, error.message);
      }
    }

    const updatedEntries = entries.map((entry) =>
      entry.isSelected && entry.status !== 'Active'
        ? { ...entry, status: 'Active', isSelected: false }
        : entry
    );
    setEntries(updatedEntries);
    setSelectAll(false);
    Swal.fire('Approved!', 'Selected entries have been approved.', 'success');
  };

  return (
    <div className="for-approval-container">
      <header className="header">
        <h2>Approval</h2>
        <div className="header-stats">
          <span className="total-entries">Total Entries: {entries.length}</span>
          <div className="status-count">
            <span className="done-count">{entries.filter((e) => e.status === 'Active').length} Active</span>
            <span className="in-progress-count">{entries.filter((e) => e.status === 'Pending').length} Pending</span>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Here"
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="filters-button">Filters</button>
        </div>
        <div className="actions">
          <button
            className="approve-button"
            onClick={handleApprove}
            disabled={entries.every(
              (entry) => !entry.isSelected || entry.status === 'Active'
            )}
          >
            Approve
          </button>
          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={entries.every((entry) => !entry.isSelected)}
          >
            Delete
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading entries...</p>
      ) : (
        <>
          <table className="approval-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    id="select-all-checkbox"
                  />
                  <label htmlFor="select-all-checkbox" style={{ marginLeft: '5px', cursor: 'pointer' }}>
                    Select all
                  </label>
                </th>
                <th>Name</th>
                <th>Business Type</th>
                <th>Location</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No entries found.</td>
                </tr>
              ) : (
                currentEntries.map((entry) => (
                  <tr key={entry.id} className={entry.isSelected ? 'selected-row' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={entry.isSelected}
                        onChange={() => handleCheckboxChange(entry.id)}
                      />
                    </td>
                    <td>{entry.name}</td>
                    <td>{entry.businessType}</td>
                    <td>{entry.location}</td>
                    <td>{entry.dateSubmitted}</td>
                    <td>
                      <span className={`status ${entry.status?.toLowerCase()}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td>
                      <button className="more-options">...</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
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
              disabled={currentPage === totalPages || totalPages === 0}
            >
              {'>'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Evaluation;
