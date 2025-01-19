// models/userModel.js
const db = require('../config/db');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Insert into the users table
const createUser = (userData, callback) => {
  const sql = `
    INSERT INTO users (email, password, userType, emailVerified)
    VALUES (?, ?, ?, ?)
  `;

  db.execute(
    sql,
    [userData.email, userData.password, userData.userType, userData.emailVerified || false],
    (err, result) => {
      if (err) {
        console.error('Error executing createUser query:', err);
        return callback(err);
      }
      callback(null, result);
    }
  );
};

const createPediatrician = (pediatricianData, callback) => {
  const sql = `
    INSERT INTO pediatricians (user_id, firstname, middlename, lastname, extension, contact, clinicAddress, specialization)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.execute(
    sql,
    [
      pediatricianData.userId,
      pediatricianData.firstname,
      pediatricianData.middlename,
      pediatricianData.lastname,
      pediatricianData.extension,
      pediatricianData.contact,
      pediatricianData.clinicAddress, // New field
      pediatricianData.specialization, // New field
    ],
    (err, result) => {
      if (err) {
        console.error('Error executing createPediatrician query:', err);
        return callback(err);
      }
      callback(null, result);
    }
  );
};


// Insert into the guardians table
const createGuardian = (guardianData, callback) => {
  const sql = `
    INSERT INTO guardians (user_id, firstname, middlename, lastname, extension, contact, guardianAddress)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.execute(
    sql,
    [
      guardianData.userId, guardianData.firstname, guardianData.middlename,
      guardianData.lastname, guardianData.extension, guardianData.contact, guardianData.guardianAddress,
    ],
    (err, result) => {
      if (err) {
        console.error('Error executing createGuardian query:', err);
        return callback(err);
      }
      callback(null, result);
    }
  );
};

// Insert into the patients table
const createPatient = (patientData, callback) => {
  const sql = `
    INSERT INTO patients (guardian_id, patientName, patientAge, birthdate, sex, birthplace, religion, address,
                          fatherName, fatherAge, fatherOccupation, motherName, motherAge, motherOccupation,
                          cellphone, patientEmail, informant, relation, medicalHistory)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.execute(
    sql,
    [
      patientData.guardianId, patientData.patientName, patientData.patientAge, patientData.birthdate,
      patientData.sex, patientData.birthplace, patientData.religion, patientData.address,
      patientData.fatherName, patientData.fatherAge, patientData.fatherOccupation,
      patientData.motherName, patientData.motherAge, patientData.motherOccupation,
      patientData.cellphone, patientData.patientEmail, patientData.informant,
      patientData.relation, patientData.medicalHistory,
    ],
    (err, result) => {
      if (err) {
        console.error('Error executing createPatient query:', err);
        return callback(err);
      }
      callback(null, result);
    }
  );
};


const updateEmailVerification = (email, callback) => {
  const sql = `UPDATE users SET emailVerified = true WHERE email = ?`;

  db.execute(sql, [email], (err, result) => {
    if (err) {
      console.error(`Error updating email verification for email ${email}:`, err);
      return callback(err, null);
    }

    if (result.affectedRows === 0) {
      console.warn(`No user found with email: ${email}`);
      return callback(null, { message: 'No user found with the provided email' });
    }

    console.log(`Email verification updated successfully for ${email}`);
    callback(null, result);
  });
};

const findUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ?`;

  db.execute(sql, [email], (err, result) => {
    if (err) {
      console.error(`Error finding user with email ${email}:`, err);
      return callback(err, null);
    }

    if (result.length === 0) {
      console.warn(`No user found with email: ${email}`);
      return callback(null, null);
    }

    console.log(`User found with email: ${email}`);
    callback(null, result[0]);
  });
};

const sendPrescriptionEmail = (guardianEmail, prescriptionDetails, callback) => {
  const doc = new PDFDocument();
  
  // Define the directory and file path
  const directoryPath = path.join(__dirname, 'prescriptions');
  const filePath = path.join(directoryPath, 'prescription.pdf');

  // Ensure the directory exists, create it if not
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log('Directory created:', directoryPath);
  }

  // Create the PDF with prescription details
  doc.pipe(fs.createWriteStream(filePath));

  // Title section with emoji and text
  const imagePath = path.join(__dirname, 'img/medicine.png'); // Replace with the correct path
  doc.image(imagePath, 50, 50, { width: 30, height: 30 }); // Emoji at x=50, y=50
  doc.fontSize(24).text('Rx', 90, 50); // Text 'Rx' beside emoji
  doc.fontSize(16).text('PRESCRIPTION', 90, 80); // 'Prescription' below Rx
  doc.moveDown(2);

  doc.fontSize(16).font('Helvetica-Bold')
  .text('JOUIE C. BACOT-URCIA, MD', { align: 'center' })
  .fontSize(12).font('Helvetica')
  .text('Pediatrician', { align: 'center' })
  .text('ACE Medical Center: Pimentel St. Lapasan, CDOC', { align: 'center' })
  .moveDown(2); // Move down for spacing

  // Patient's Information - Left-aligned
  doc.fontSize(14).font('Helvetica-Bold').text("Patient's Information", { underline: true }).moveDown();
  doc.fontSize(12).font('Helvetica')
    .text(`Name: ${prescriptionDetails.patientName}`, { continued: true })
    .text(`Age: ${prescriptionDetails.patientAge}`, { align: 'right' })
    .moveDown(1)
    .text(`Sex: ${prescriptionDetails.patientSex}`, { continued: true })
    .text(`Date: ${prescriptionDetails.date}`, { align: 'right' })
    .moveDown(2);

  // Guardian Information
  doc.fontSize(14).font('Helvetica-Bold').text('Guardian\'s Information', { underline: true }).moveDown();;
  doc.fontSize(12).font('Helvetica').text(`Email: ${guardianEmail}`).moveDown(2);

  // Prescription Text
  doc.fontSize(14).font('Helvetica-Bold').text('Prescription', { underline: true }).moveDown();
  doc.fontSize(12).font('Helvetica').text(prescriptionDetails.prescriptionText).moveDown(5);

  // Footer with doctor info
  doc.fontSize(10).font('Helvetica-Bold').text('JOUIE C. BACOT-URCIA, MD', { align: 'center' });
  doc.text('License No: 0115531', { align: 'center' });
  doc.text('PTR No: ____________', { align: 'center' });

  doc.end();

  // Create email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: guardianEmail,
    subject: 'Your Child\'s Prescription',
    text: 'Please find the attached prescription for your child.',
    attachments: [
      {
        filename: 'prescription.pdf',
        path: filePath,
      },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
    // Optionally, invoke the callback
    if (callback) callback();
  });
};

  module.exports = { createUser, createPediatrician, createGuardian, createPatient, updateEmailVerification, findUserByEmail, sendPrescriptionEmail };
