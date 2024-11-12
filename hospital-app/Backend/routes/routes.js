const express = require('express');
const multer = require('multer');
const router = express.Router();
const UserController = require('../controllers/UserController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verify');
const { doctorRegistration, patientRegistration, login } = require('../middleware/validationMiddleware');


router.post('/api/register/doctor', doctorRegistration, UserController.registerDoctor); //to register doctor
router.post('/api/register/patient', patientRegistration, UserController.registerPatient); //to register patient
router.post('/api/login', login, UserController.login); // to login
router.post('/api/consultations', verifyToken, upload, UserController.requestConsultation); //to book consultations
router.get('/api/doctors', verifyToken, UserController.getDoctors); //get doctors list
router.get('/api/doctor/:doctorId/slots', UserController.getDoctorSlots); //check doctor's full detail
router.get('/api/doctors/consultations', verifyToken, UserController.getConsultationsForDoctor); //check consultations by doctors
router.put('/api/consultations/:consultationId/status', verifyToken, UserController.updateConsultationStatus); //update status of consultation
router.post('/api/set-password', UserController.setPassword);



module.exports = router;