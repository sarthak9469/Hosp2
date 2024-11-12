import React, {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Validation from "./LoginValidation";
import '../Components/style.css';
import axios from "axios";


function Login() {
    const [values, setValues] = useState({email:"", password:""});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const url = "http://localhost:4000";


    const handleInput = (e) => {
        const { name, value } = e.target;
        setValues(prevValues => ({...prevValues, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login values:', values);
        try {
            const response = await axios.post(`${url}/api/login`, values);
            console.log('Login response:', response.data);
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            setValues({ email: "", password: "" });
            if (role === 'doctor') {
            navigate('api/doctors/consultations'); // Navigate to consultations page for doctors
        } else if (role === 'patient') {
            navigate('/api/doctors'); // Navigate to doctors list for patients
        }
    } catch (error) {
        setErrors({ general: error.response?.data?.error || 'Login failed' });
    }
};


  return (
<form onSubmit={handleSubmit}>
    <div>
        <h1> Login </h1>
    </div>
    <div>
    <label><strong>Email</strong></label>
        <input type="email" placeholder="Email" name="email" onChange={handleInput}></input>
        {errors.email && <span> {errors.email}</span>}

    </div>
    <div>
    <label><strong>Password</strong></label>
        <input type="password" placeholder="Password" name="password" onChange={handleInput}></input>
        {errors.password && <span> {errors.password}</span>}
    </div>
    <div>
        <button type="submit"> Login </button>
    </div>
    <div className="new-member">  
    <p> Not a User</p>
    <Link to = '/signup' className="button"> Create Account </Link>
    </div>
</form>
  );
}

export default Login;