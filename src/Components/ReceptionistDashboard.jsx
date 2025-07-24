// pages/ReceptionistDashboard.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs, query, where, addDoc, Timestamp} from 'firebase/firestore';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { RiEmpathizeFill } from "react-icons/ri";
import { PiHospitalLight } from "react-icons/pi";
import {  IoMdLogOut } from "react-icons/io";
import './ReceptionistDashboard.css';
import { signOut ,getAuth} from 'firebase/auth';
import { auth } from '../FirebaseConfig';

const ReceptionistDashboard = () => {
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', location: '', bloodType: '',
    dob: '', age: '', salutation: 'Mr.', gender: '', email: '', phone: '', emergency: '',
    relativeName: '', relation: '', relativeContact: ''
  });

  const [viewPage, setViewPage] = useState('patient');
  const [completedPatients, setCompletedPatients] = useState([]);
  const [selectedService, setSelectedService] = useState('DoctorVisit');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [paymentType, setPaymentType] = useState('Cash');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [billingData, setBillingData] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [patientsList, setPatientsList] = useState([]);
  const [generatedToken, setGeneratedToken] = useState('');
  const [filterText, setFilterText] = useState('');
   const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    generateInvoice();
    fetchCompletedPatients();
    fetchAllPatients();
  }, []);

  const fetchCompletedPatients = async () => {
    const q = query(collection(db, 'patients'), where('status', '==', 'complete'));
    const snapshot = await getDocs(q);
    const completed = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setCompletedPatients(completed);
  };

  const fetchAllPatients = async () => {
    const snapshot = await getDocs(collection(db, 'patients'));
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPatientsList(patients);
  };

  const generateInvoice = () => {
    const invoice = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    setInvoiceNumber(invoice);
  };

  const generateToken = () => {
    return 'TKN-' + Math.floor(1000 + Math.random() * 9000);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); // Redirect to login
      })
      .catch((error) => {
        console.error('Logout Error:', error);
      });
  };
  
  const calculateTotals = () => {
    const subtotal = billingData.reduce((sum, item) => sum + item.amount, 0);
    const gst = subtotal * 0.18;
    return {
      subtotal,
      gst,
      total: subtotal + gst
    };
  };

  const handleAddBilling = async () => {
    if (!selectedPatient || !selectedService) {
      setErrorMessage('Please select both service and patient');
      return;
    }

    const newItem = {
      invoiceNumber,
      patientName: selectedPatient,
      service: selectedService,
      amount: 500,
      paymentType,
      createdAt: Timestamp.now()
    };

    try {
      await addDoc(collection(db, 'billing'), newItem);
      setBillingData(prev => ([...prev, {
        id: prev.length + 1,
        name: selectedPatient,
        service: selectedService,
        amount: 500
      }]));
      setSuccessMessage('Billing added successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding billing:', error);
      setErrorMessage('Failed to add billing');
      setSuccessMessage('');
    }
  };

  const handleSavePatient = async () => {
    const token = generateToken();
    try {
      await addDoc(collection(db, 'patients'), {
        ...formData,
        name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        token,
        status: 'pending',
        createdAt: Timestamp.now()
      });
      setGeneratedToken(token);
      setSuccessMessage('Patient information saved successfully!');
      setErrorMessage('');
      setFormData({
        firstName: '', middleName: '', lastName: '', location: '', bloodType: '',
        dob: '', age: '', salutation: 'Mr.', gender: '', email: '', phone: '', emergency: '',
        relativeName: '', relation: '', relativeContact: ''
      });
      fetchAllPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      setErrorMessage('Failed to save patient information');
      setSuccessMessage('');
    }
  };

  const handleReset = () => {
    setSelectedPatient('');
    setSelectedService('DoctorVisit');
    setPaymentType('Cash');
    setBillingData([]);
    setSuccessMessage('');
    setErrorMessage('');
    generateInvoice();
  };

  

  const { subtotal, gst, total } = calculateTotals();

  const filteredPatients = patientsList.filter(p =>
    p.name?.toLowerCase().includes(filterText.toLowerCase()) ||
    p.token?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="receptionist-dashboard">
      <div className="dashboard-header-rec">
         <div className="header-left">
                  <PiHospitalLight className='hospital-logo'/>
                  <h2>CLINIC MANAGEMENT SYSTEM</h2>

           <button onClick={handleLogout} className='button-logout'><IoMdLogOut className="exit-logo"  alt="Doctor"/>Logout</button>
                </div>
        <div className='button-container'>
          <button onClick={() => setViewPage('patient')} className='button-new'><RiEmpathizeFill className='patient-logo' />Add New Patient</button>
          <button onClick={() => setViewPage('billing')} className='button-bill'><FaMoneyBillTransfer className='bill-logo' />Billing Service</button>
         
         
        
        
        </div>
      </div>

      {viewPage === 'patient' && (
        <div className="patient-entry-form styled-box">
          <h3>Patient Information Entry</h3>
          <form className='patient-form'>
            <input placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <input placeholder="Middle Name" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
            <input placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            <input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            <input placeholder="Blood Type" value={formData.bloodType} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })} />
            <input placeholder="Date of Birth" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
            <input placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
            <input placeholder="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
            <input placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input placeholder="Emergency Contact" value={formData.emergency} onChange={(e) => setFormData({ ...formData, emergency: e.target.value })} />
            <input placeholder="Relative Name" value={formData.relativeName} onChange={(e) => setFormData({ ...formData, relativeName: e.target.value })} />
            <input placeholder="Relation" value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} />
            <input placeholder="Relative Contact" value={formData.relativeContact} onChange={(e) => setFormData({ ...formData, relativeContact: e.target.value })} />
          </form>
          <button className="btn-complete" onClick={handleSavePatient}>Save Patient</button>
          {generatedToken && <p className="success-message">Generated Token: {generatedToken}</p>}
        </div>
      )}

      {viewPage === 'billing' && (
        <div className="styled-box">
          <h3>Billing Services</h3>
          <div>
            <label>Service:</label>
            <select value={selectedService} onChange={e => setSelectedService(e.target.value)}>
              <option value="DoctorVisit">Doctor Visit</option>
              <option value="XRay">X-Ray</option>
              <option value="BloodTest">Blood Test</option>
            </select>
          </div>
          <div>
            <label>Patient:</label>
            <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
              <option value="">Select</option>
              {completedPatients.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Payment Type:</label>
            <select value={paymentType} onChange={e => setPaymentType(e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
              <option value="Check">Check</option>
            </select>
          </div>
          <div>
            <label>Invoice:</label>
            <input value={invoiceNumber} disabled />
          </div>
          <button onClick={handleAddBilling}>Add Billing</button>
          <button onClick={handleReset}>Reset</button>

          <div className="summary">
            <h4>Summary</h4>
            <p>Subtotal: ₹{subtotal}</p>
            <p>GST (18%): ₹{gst.toFixed(2)}</p>
            <p><strong>Total: ₹{total.toFixed(2)}</strong></p>
          </div>
        </div>
      )}

      {patientsList.length > 0 && (
        <div className="styled-box">
          <h3>PATIENT RECORDS</h3>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by name or token..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <table className="patient-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Blood Type</th>
                <th>Location</th>
                <th>Age</th>
                <th>Status</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr key={index}>
                  <td>{patient.name}</td>
                  <td>{patient.bloodType}</td>
                  <td>{patient.location}</td>
                  <td>{patient.age}</td>
                  <td>{patient.status}</td>
                  <td>{patient.token}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
