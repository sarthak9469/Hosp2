const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Consultation = require('../models/consultation');
const Image = require('../models/image');
// const validateUser = require('../middleware/validationMiddleware');
const sendVerificationEmail = require('../middleware/sendVerificationEmail'); 


// Register a new doctor
exports.registerDoctor = async (req, res) => {
    const { name, email, specialization, availableSlots } = req.body;

    // If availableSlots is a string, parse it to an array
    let slots = Array.isArray(availableSlots) ? availableSlots : JSON.parse(availableSlots);

    // Check for required fields
    if (!email || !specialization) {
        return res.status(400).json({ error: 'Email and specialization are required' });
    }

    try {
        const existingDoctor = await Doctor.findOne({ where: { email } });
        if (existingDoctor) return res.status(400).json({ error: 'Email is already registered' });

        const newDoctor = await Doctor.create({
            name,
            email,
            specialization,
            availableSlots: slots,  // Store as array
        });

        const token = jwt.sign({ email: newDoctor.email, id: newDoctor.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await sendVerificationEmail(newDoctor.email, token);
        res.status(201).json({ message: 'Doctor registered, check email to set password.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};


// Register a new patient
exports.registerPatient = async (req, res) => {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        const existingPatient = await Patient.findOne({ where: { email } });
        if (existingPatient) return res.status(400).json({ error: 'Email is already registered' });

        const newPatient = await Patient.create({ name, email });
        const token = jwt.sign({ email: newPatient.email, id: newPatient.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Send verification email
        await sendVerificationEmail(newPatient.email, token);
        res.status(201).json({ message: 'Patient registered, check email to set password.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};
  

exports.setPassword = async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Invalid or missing token/password' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email } = decoded;
  
      // Check if the token belongs to a doctor or a patient and update their password
      let user;
      let userType;
  
      // Try to find the doctor
      user = await Doctor.findOne({ where: { email } });
      userType = 'doctor';
  
      if (!user) {
        // If not found in doctors, check for a patient
        user = await Patient.findOne({ where: { email } });
        userType = 'patient';
      }
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the password in the database for the correct user
      await user.update({ password: hashedPassword });
  
      res.status(200).json({ message: `Password created successfully` });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Invalid token or expired token' });
    }
  };  


// Login function for doctors and patients
exports.login = async (req, res) => {
    console.log('Received login request:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check for user in both Doctor and Patient models
        const user = await Doctor.findOne({ where: { email } }) || await Patient.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Invalid Email' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Create token with the correct ID
        const token = jwt.sign(
            {
                id: user instanceof Doctor ? user.doctorId : user.patientId, // Use correct ID based on type
                email: user.email,
                role: user instanceof Doctor ? 'doctor' : 'patient'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1hr' }
        );
        res.json({ message: 'Login successful', token, role: user instanceof Doctor ? 'doctor' : 'patient' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};


exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            attributes: ['doctorId', 'name', 'email', 'specialization']
        });

        // Format the response
        const formattedDoctors = doctors.map(doctor => ({
            doctorId: doctor.doctorId,
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization,
            // availableSlots: doctor.availableSlots || []
        }));

        res.status(200).json(formattedDoctors);
    } catch (error) {
        console.error('Error fetching doctors:', error); // More specific error logging
        res.status(500).json({ error: 'An error occurred while fetching doctors' });
    }
};

exports.getDoctorSlots = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findByPk(doctorId, {
            attributes: ['doctorId', 'name', 'availableSlots']
        });

        console.log('Doctor ID:', doctorId);
        console.log('Fetched doctor:', doctor);


        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.status(200).json({
            doctorId: doctor.doctorId,
            name: doctor.name,
            availableSlots: doctor.availableSlots || []
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching available slots' });
    }
};


exports.requestConsultation = async (req, res) => {
    const { doctorId, slot, reason, description } = req.body;
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);
    console.log('Patient ID:', req.userId);


    if (!doctorId || !slot) {
        return res.status(400).json({ error: 'Doctor ID and slot are required' });
    }

    try {
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        if (!doctor.availableSlots || !doctor.availableSlots.includes(slot)) {
            return res.status(400).json({ error: 'Slot not available' });
        }

        console.log('Patient ID:', req.userId);
        if (!req.userId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const newConsultation = await Consultation.create({
            patientId: req.userId, 
            doctorId,
            slot,
            status: 'Accepted',
            reason,
            description
        });

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `uploads/${file.filename}`); // Extract the image paths
        }

        if (imageUrls.length > 0) {
            await Image.create({
                consultationId: newConsultation.id,
                imageUrl: imageUrls.join(',') // Join the image URLs into a single string
            });
        }

        res.status(201).json({
            message: 'Consultation requested successfully',
            consultation: newConsultation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during the consultation request' });
    }
};


exports.getConsultationsForDoctor = async (req, res) => {
    console.log('Received a request to /api/doctors/consultations');
    const doctorId = parseInt(req.userId, 10);
    // console.log('Decoded User ID:', req.userId);
    // console.log('Parsed Doctor ID:', doctorId);

    try {
        const doctorExists = await Doctor.findByPk(doctorId);
        if (!doctorExists) {
            console.error(`Doctor with ID ${doctorId} not found.`);
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const consultations = await Consultation.findAll({
            where: { doctorId },
            include: [{
                model: Patient,
                attributes: ['name', 'email']
            },
            {
                model: Image,
                attributes: ['imageUrl'], 
            }]
        });

        if (!consultations.length) {
            return res.status(200).json([]);
        }

        res.status(200).json(consultations);
    } catch (error) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({ error: 'An error occurred while fetching consultations' });
    }
};


exports.updateConsultationStatus = async (req, res) => {
    const { consultationId } = req.params; // Get the consultation ID from request parameters
    const { status } = req.body; // Get the new status from the request body

    // Validate status value (optional)
    const validStatuses = ['Accepted', 'Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const consultation = await Consultation.findByPk(consultationId);

        if (!consultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }

        // Update the consultation status
        consultation.status = status;
        await consultation.save();

        res.status(200).json({
            message: 'Consultation status updated successfully',
            consultation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the consultation status' });
    }
};

