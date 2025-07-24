// pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../FirebaseConfig';
import { collection, onSnapshot, updateDoc, doc, query, Timestamp} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { FaUserDoctor } from "react-icons/fa6";
import { MdPendingActions } from "react-icons/md";
import { IoIosPeople, IoMdLogOut } from "react-icons/io";
import { PiHospitalLight } from "react-icons/pi";
import './DoctorDashboard.css';
import Modal from 'react-modal';


const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(collection(db, 'patients'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const todayPatients = data.filter(p => p.createdAt?.toDate().toDateString() === today.toDateString());
      setPatients(todayPatients);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setPrescription(patient.prescription || '');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPatient(null);
    setPrescription('');
  };

  const handleSavePrescription = async () => {
    if (!selectedPatient) return;

    const patientRef = doc(db, 'patients', selectedPatient.id);
    await updateDoc(patientRef, {
      prescription,
      status: 'complete',
      updatedAt: Timestamp.now()
    });

    handleCloseModal();
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header ">
        <div className="header-left">
          <PiHospitalLight className='hospital-logo'/>
          <h2>CLINIC MANAGEMENT SYSTEM</h2>
        </div>
          <button onClick={handleLogout} className="logout-btn"><IoMdLogOut className="exit-logo"  alt="Doctor"/>Logout</button>
      </header>

      <div className="main-container">
        <div className="dashboard">
          <p>Dashboard</p>
          </div>
      <div className="stats-container">
        <div className="card"> <MdPendingActions className="pending-logo1"  alt="Appointments"/>Pending Appointments: {patients.filter(p => p.status === 'pending').length}</div>
        <div className="card"><IoIosPeople className="total-logo1"  alt="Patients"/>Total Patients Today: {patients.length}</div>
      </div>

      <div className="patient-table">
        <h3>Today's Patients</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Blood Type</th>
              <th>Location</th>
              <th>Age</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>{p.bloodType}</td>
                <td>{p.location}</td>
                <td>{p.age}</td>
                <td>
                  <button className={p.status === 'pending' ? 'status-pending' : 'status-complete'}>
                    {p.status}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleOpenModal(p)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Patient Info"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedPatient && (
          <div>
            <h2>Patient: {selectedPatient.name}</h2>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Blood Type:</strong> {selectedPatient.bloodType}</p>
            <p><strong>Location:</strong> {selectedPatient.location}</p>
            <textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Write prescription..."
            />
            <button onClick={handleSavePrescription}>Save & Complete</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
