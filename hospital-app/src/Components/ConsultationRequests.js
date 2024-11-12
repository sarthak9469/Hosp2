import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
// import './ConsultationRequests.css';

function ConsultationRequests() {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [description, setDescription] = useState("");
    const [reason, setReason] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState("");
    const navigate = useNavigate(); 

    const url = "http://localhost:4000";

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}/api/doctor/${doctorId}/slots`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                // console.log('Fetched doctor details:', doctor);

                const slots = typeof response.data.availableSlots === 'string'
                ? JSON.parse(response.data.availableSlots)
                : response.data.availableSlots;

            console.log('Available Slots:', slots);  // Check parsed slots
            setAvailableSlots(slots);
            setDoctor(response.data);
            } catch (error) {
                console.error("Error fetching doctor details:", error);
                if (error.response) {
                    setErrors(error.response.data.error || "Error fetching doctor details");
                } else {
                    setErrors("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };        
        fetchDoctorDetails();
    }, [doctorId]);

    useEffect(() => {
        if (doctor) {
            console.log('Fetched doctor details:', doctor);
        }
    }, [doctor]);
    


    const handleFileChange = (event) => {
        setImages([...event.target.files]);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("doctorId", doctorId);
        formData.append("slot", selectedSlot);
        formData.append("description", description);
        for (const image of images) {
            formData.append("images", image);
        }

        try {
            const response = await axios.post(`${url}/api/consultations`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            navigate('/api/doctors');
        } catch (error) {
            setErrors("Error booking slot: " + (error.response?.data?.error || 'Unknown error'));
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="booking-slot">
            {errors && <span className="error">{errors}</span>}
            <h1>Booking Slot with Dr. {doctor?.name}</h1>
            <form onSubmit={handleBooking}>
                <div>
                    <label>Select Slot:</label>
                    <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                        <option value="">-- Select a Slot --</option>
                        {availableSlots.map((slot, index) => (
                            <option key={index} value={slot}>{slot}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Reason:</label>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>Upload Images:</label>
                    <input type="file" multiple onChange={handleFileChange} />
                </div>
                <button type="submit">Book Slot</button>
            </form>
        </div>
    );
}

export default ConsultationRequests;