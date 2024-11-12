import './App.css';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './Components/SignUp';
import DoctorList from './Components/DoctorList';
import ConsultationRequest from './Components/ConsultationRequests';
import DoctorConsultations from './Components/DoctorConsultations';
import SetPassword from './Components/SetPassword';


const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem('role');
  return isAuthenticated() && role === requiredRole ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/api/doctors' element={<ProtectedRoute requiredRole="patient"><DoctorList /></ProtectedRoute>} />
        <Route path='/api/doctor/:doctorId/slots' element={<ProtectedRoute requiredRole="patient"><ConsultationRequest /></ProtectedRoute>} />
        <Route path="/api/doctors/consultations" element={<ProtectedRoute requiredRole="doctor"> <DoctorConsultations /> </ProtectedRoute>} />
        <Route path="/api/set-password" element={<SetPassword />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;