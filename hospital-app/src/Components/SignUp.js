import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../Components/style.css';
import axios from "axios";

function SignUp() {
    const [doctorValues, setDoctorValues] = useState({
        name: "",
        email: "",
        specialization: "",
        availableSlots: ""
    });

    const [patientValues, setPatientValues] = useState({
        name: "",
        email: ""
    });

    const [errors, setErrors] = useState({});
    const [isDoctorTab, setIsDoctorTab] = useState(false); 
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const url = "http://localhost:4000";

    const handleDoctorInput = (e) => {
        const { name, value } = e.target;
        setDoctorValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handlePatientInput = (e) => {
        const { name, value } = e.target;
        setPatientValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isDoctorTab ? `${url}/api/register/doctor` : `${url}/api/register/patient`;
            const values = isDoctorTab ? doctorValues : patientValues;

            if (isDoctorTab) {
                values.availableSlots = values.availableSlots
                    ? values.availableSlots.split(',').map(slot => slot.trim())
                    : []; // Set to an empty array if no slots provided
            }

            const response = await axios.post(endpoint, values);
            console.log('Registration successful:', response.data);setSuccess('Registration successful. Please check your email to set your password.');
            setTimeout(() => {
                navigate('/');
            }, 2000); // Redirect to login after showing success message

            // Reset fields after successful submission
            if (isDoctorTab) {
                setDoctorValues({
                    name: "",
                    email: "",
                    specialization: "",
                    availableSlots: ""
                });
            } else {
                setPatientValues({
                    name: "",
                    email: ""
                });
            }
            navigate('/');
            setErrors({});
        } catch (error) {
            console.error('Error during registration:', error.response?.data);
            setErrors({ general: error.response?.data?.error || 'Registration failed' });
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <div className="tab-container">
    <div 
        className={`tab ${!isDoctorTab ? 'active' : ''}`} 
        onClick={() => setIsDoctorTab(false)}
    >
        Patient
    </div>
    <div 
        className={`tab ${isDoctorTab ? 'active' : ''}`} 
        onClick={() => setIsDoctorTab(true)}
    >
        Doctor
    </div>
</div>

            <form onSubmit={handleSubmit}>
                {isDoctorTab ? (
                    <>
                        <h2>Doctor Registration</h2>
                        <div>
                            <label><strong>Name</strong></label>
                            <input
                                type="text"
                                placeholder="Name"
                                name="name"
                                onChange={handleDoctorInput}
                                value={doctorValues.name}
                            />
                            {errors.name && <span>{errors.name}</span>}
                        </div>
                        <div>
                            <label><strong>Email</strong></label>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={handleDoctorInput}
                                value={doctorValues.email}
                            />
                            {errors.email && <span>{errors.email}</span>}
                        </div>
                        {/* <div>
                            <label><strong>Password</strong></label>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handleDoctorInput}
                                value={doctorValues.password}
                            />
                            {errors.password && <span>{errors.password}</span>}
                        </div> */}
                        <div>
                            <label><strong>Specialization</strong></label>
                            <input
                                type="text"
                                placeholder="Specialization"
                                name="specialization"
                                onChange={handleDoctorInput}
                                value={doctorValues.specialization}
                            />
                            {errors.specialization && <span>{errors.specialization}</span>}
                        </div>
                        <div>
                            <label><strong>Available Slots</strong></label>
                            <input
                                type="text"
                                placeholder="Available Slots (comma separated)"
                                name="availableSlots"
                                onChange={handleDoctorInput}
                                value={doctorValues.availableSlots}
                            />
                            {errors.availableSlots && <span>{errors.availableSlots}</span>}
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Patient Registration</h2>
                        <div>
                            <label><strong>Name</strong></label>
                            <input
                                type="text"
                                placeholder="Name"
                                name="name"
                                onChange={handlePatientInput}
                                value={patientValues.name}
                            />
                            {errors.name && <span>{errors.name}</span>}
                        </div>
                        <div>
                            <label><strong>Email</strong></label>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={handlePatientInput}
                                value={patientValues.email}
                            />
                            {errors.email && <span>{errors.email}</span>}
                        </div>
                        {/* <div>
                            <label><strong>Password</strong></label>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handlePatientInput}
                                value={patientValues.password}
                            />
                            {errors.password && <span>{errors.password}</span>}
                        </div> */}
                    </>
                )}
                <div>
                    <button type="submit">Sign Up</button>
                </div>
                {errors.general && <span>{errors.general}</span>}
                <div className="new-member">
                    <p>Already a User?</p>
                    <Link to="/" className="button">Login</Link>
                </div>
            </form>
        </div>
    );
}

export default SignUp;