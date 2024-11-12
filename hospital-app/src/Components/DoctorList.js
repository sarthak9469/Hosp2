import React, { useEffect, useState } from "react";
import axios from "axios";
import './DoctorList.css';
import { Link } from "react-router-dom";

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(true);


    const url = "http://localhost:4000";

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}/api/doctors`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDoctors(response.data);
            } catch (error) {
                setErrors("Error fetching doctors");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="doctor-list">
            <h1>Doctors</h1>
            {errors && <span className="error">{errors}</span>}
            {loading ? (
                <p>Loading doctors...</p>
            ) : (
                <div className="doctor-boxes">
                    {doctors.map(doctor => (
                        <div className="doctor-box" key={doctor.doctorId}>
                            <h3>{doctor.name}</h3>
                            <p>Email: {doctor.email}</p>
                            <p>Specialization: {doctor.specialization}</p>
                        
                            <Link to={`/api/doctor/${doctor.doctorId}/slots`}>
                                <button className="book-slots-btn">Book Slot</button>
                                </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}

export default DoctorList;