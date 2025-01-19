const User = require('../models/userModel');
const db = require('../config/db');
const moment = require('moment');
const patientModel = require('../models/userModel');

const getPatientData = (req, res) => {
  const { email } = req.user;

  if (!email) {
    return res.status(400).json({ message: 'Email is missing in request.' });
  }

  const sql = `
    SELECT 
      u.email AS email,
      g.id AS guardian_id,
      g.user_id,
      g.firstname AS firstname,
      g.middlename AS middlename,
      g.lastname AS lastname,
      g.extension,
      g.contact,
      g.guardianAddress,
      p.id AS patient_id,
      p.patientName AS name,
      p.patientAge AS age,
      p.address,
      p.birthdate,
      p.sex,
      p.birthplace,
      p.religion,
      p.fatherName,
      p.fatherAge,
      p.fatherOccupation,
      p.motherName,
      p.motherAge,
      p.motherOccupation,
      p.cellphone,
      p.informant,
      p.relation
    FROM users u
    JOIN guardians g ON u.id = g.user_id
    JOIN patients p ON g.id = p.guardian_id
    WHERE u.email = ?
  `;

  db.execute(sql, [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database query error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No data found for the given email' });
    }

    console.log('Query results:', results);

    const guardian = {
      id: results[0].guardian_id,
      user_id: results[0].user_id,
      email: results[0].email,
      firstname: results[0].firstname,
      middlename: results[0].middlename,
      lastname: results[0].lastname,
      extension: results[0].extension,
      contact: results[0].contact,
      guardianAddress: results[0].guardianAddress,
    };

    const patients = results
      .filter((row) => row.patient_id)
      .map((row) => ({
        id: row.patient_id,
        name: row.name || 'N/A',
        age: row.age || 'Unknown',
        guardian: row.guardian || `${row.firstname || ''} ${row.middlename || ''} ${row.lastname || ''}`,
        email: row.email,
        address: row.address || 'No address provided',
        birthdate: row.birthdate || 'No birthdate provided',
        sex: row.sex || 'No sex provided',
        birthplace: row.birthplace || 'No Birthplace provided',
        religion: row.religion || 'No address provided',
        fatherName: row.fatherName || 'No address provided',
        fatherAge: row.fatherAge || 'No address provided',
        fatherOccupation: row.fatherOccupation || 'No address provided',
        motherName: row.motherName || 'No address provided',
        motherAge: row.motherAge || 'No address provided',
        motherOccupation: row.motherOccupation || 'No address provided',
        cellphone: row.cellphone || 'No address provided',
        informant: row.informant || 'No address provided',
        relation: row.relation || 'No address provided',
      }));

    res.json({ guardian, patients });
  });
};

// New function to update patient details
const updatePatientData = (req, res) => {
  const { id } = req.params; // Get patient ID from the route parameter
  const updatedData = req.body; // Get the updated patient data from the request body

  if (!id || !updatedData) {
    return res.status(400).json({ message: 'Patient ID and updated data are required.' });
  }

  // Convert the birthdate to 'YYYY-MM-DD' format using Moment.js
  const formattedBirthdate = updatedData.birthdate ? moment(updatedData.birthdate).format('YYYY-MM-DD') : null;

  // Ensure all parameters are not undefined, and replace them with null if they are
  const sql = `
    UPDATE patients 
    SET 
      patientName = ?, 
      patientAge = ?, 
      address = ?, 
      birthdate = ?, 
      sex = ?, 
      birthplace = ?, 
      religion = ?,
      fatherName = ?,
      fatherAge = ?,
      fatherOccupation = ?,
      motherName = ?,
      motherAge = ?,
      motherOccupation = ?,
      cellphone = ?,
      informant = ?,
      relation = ?
    WHERE id = ?
  `;

  // Replace undefined values with null and format birthdate
  const params = [
    updatedData.name !== undefined ? updatedData.name : null, // frontend "name" maps to "patientName"
    updatedData.age !== undefined ? updatedData.age : null, // frontend "age" maps to "patientAge"
    updatedData.address !== undefined ? updatedData.address : null,
    formattedBirthdate, // Use the formatted birthdate
    updatedData.sex !== undefined ? updatedData.sex : null,
    updatedData.birthplace !== undefined ? updatedData.birthplace : null,
    updatedData.religion !== undefined ? updatedData.religion : null,
    updatedData.fatherName !== undefined ? updatedData.fatherName : null,
    updatedData.fatherAge !== undefined ? updatedData.fatherAge : null,
    updatedData.fatherOccupation !== undefined ? updatedData.fatherOccupation : null,
    updatedData.motherName !== undefined ? updatedData.motherName : null,
    updatedData.motherAge !== undefined ? updatedData.motherAge : null,
    updatedData.motherOccupation !== undefined ? updatedData.motherOccupation : null,
    updatedData.cellphone !== undefined ? updatedData.cellphone : null,
    updatedData.informant !== undefined ? updatedData.informant : null,
    updatedData.relation !== undefined ? updatedData.relation : null,
    id,
  ];

  console.log('SQL Parameters:', params); // Log the parameters for debugging

  // Execute the query
  db.execute(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating patient:', err);
      return res.status(500).json({ message: 'Error updating patient', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient updated successfully!' });
  });
};

const registerPatient = (req, res) => {
  const { guardianEmail, ...patientData } = req.body;

  // Retrieve guardian ID based on the email in the users table
  const getGuardianQuery = 'SELECT id FROM users WHERE email = ?';
  db.execute(getGuardianQuery, [guardianEmail], (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ message: 'Guardian not found' });
    }

    const guardianId = result[0].id;

    // Check if guardian exists in the guardians table
    const getGuardianCheckQuery = 'SELECT * FROM guardians WHERE user_id = ?';
    db.execute(getGuardianCheckQuery, [guardianId], (err, guardianCheckResult) => {
      if (err || guardianCheckResult.length === 0) {
        return res.status(400).json({ message: 'Guardian not found in guardians table' });
      }

      console.log('Guardian ID found:', guardianId); // Debugging log

      // Assign the guardianId to the patientData and proceed with registration
      patientData.guardian_id = guardianCheckResult[0].id; // Ensure to use the correct guardian_id from guardians table

      // Create patient in the database
      const createPatientQuery = `
        INSERT INTO patients (guardian_id, patientName, patientAge, birthdate, sex, birthplace, religion, address,
                              fatherName, fatherAge, fatherOccupation, motherName, motherAge, motherOccupation,
                              cellphone, patientEmail, informant, relation, medicalHistory)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const patientValues = [
        patientData.guardian_id, patientData.patientName, patientData.patientAge, patientData.birthdate,
        patientData.sex, patientData.birthplace, patientData.religion, patientData.address,
        patientData.fatherName, patientData.fatherAge, patientData.fatherOccupation,
        patientData.motherName, patientData.motherAge, patientData.motherOccupation,
        patientData.cellphone, patientData.patientEmail, patientData.informant,
        patientData.relation, patientData.medicalHistory
      ];

      db.execute(createPatientQuery, patientValues, (err, result) => {
        if (err) {
          console.error('Error creating patient:', err); // Debugging log
          return res.status(500).json({ message: 'Failed to register patient' });
        }
        res.status(201).json({ message: 'Patient registered successfully' });
      });
    });
  });
};






module.exports = { getPatientData, updatePatientData, registerPatient };
