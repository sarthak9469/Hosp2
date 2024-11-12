import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorConsultations.css';

const DoctorConsultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = "http://localhost:4000";

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Fetching consultations...");
                const response = await axios.get(`${url}/api/doctors/consultations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Consultations data:", response.data);
                setConsultations(response.data);
            } catch (err) {
                console.error("Error fetching consultations:", err);
                setError(err.response?.data?.error || 'An error occurred while fetching consultations.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, []);

    return (
        <div className="consultation-list">
            <h1>Consultation Requests</h1>
            {loading ? (
                <p>Loading consultations...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : consultations.length > 0 ? (
                <div className="consultation-boxes">
                    {consultations.map((consultation) => (
                        <div className="consultation-box" key={consultation.id}>
                            <h3>Consultation with {consultation.Patient.name} ({consultation.Patient.email})</h3>
                            <p>Date/Time: {new Date(consultation.slot).toLocaleString()}</p>
                            <p>Reason: {consultation.reason}</p>
                            <p>Description: {consultation.description}</p>
                            <p>Status: {consultation.status}</p>
                            {consultation.Images && consultation.Images.length > 0 && (
                                <div className="consultation-images">
                                    <h4>Uploaded Images:</h4>
                                    <ul>
                                        {consultation.Images.map((image, index) => (
                                            <li key={index}>
                                                <img src={image.imageUrl} alt={`Consultation Image ${index + 1}`} className="consultation-image" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No consultations found.</p>
            )}
        </div>
    );
};

export default DoctorConsultations;