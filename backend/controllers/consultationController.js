const { updateAvailability } = require('../controllers/availabilityController');
const consultationModel = require('../models/consultationModel'); 
const db = require('../config/db');

const requestConsultation = (req, res) => {
  const { date, timeStart, timeEnd, guardianId, patientId, description, email } = req.body;

  console.log("Received consultation request:", req.body);

  // Validate required fields
  if (!date || !timeStart || !timeEnd || !guardianId || !patientId || !description || !email) {
    console.error("Missing required fields:", req.body);
    return res.status(400).json({ message: "All fields are required." });
  }

  // Query doctor's availability
  const availabilityQuery = `
    SELECT timeSlots 
    FROM availability 
    WHERE email = ? AND date = ?
  `;

  db.execute(availabilityQuery, [email, date], (err, results) => {
    if (err) {
      console.error("Error fetching availability:", err);
      return res.status(500).json({ message: "Failed to check doctor's availability." });
    }

    console.log("Doctor's availability query result:", results);

    if (results.length === 0) {
      console.warn("No availability found for the selected date:", date);
      return res.status(404).json({ message: "No availability found for the selected date." });
    }

    const timeSlots = JSON.parse(results[0].timeSlots || "[]");
    console.log("Doctor's available time slots:", timeSlots);

    // Helper function to format the requested time slot
    const formatTimeSlot = (start, end) => {
      const addLeadingZero = (time) => (time.length === 7 ? `0${time}` : time);
      return `${addLeadingZero(start)} - ${addLeadingZero(end)}`;
    };

    const requestedSlot = formatTimeSlot(timeStart, timeEnd);
    console.log("Formatted requested time slot:", requestedSlot);

    if (!timeSlots.includes(requestedSlot)) {
      console.warn("Requested time slot is not available:", requestedSlot);
      return res.status(400).json({ message: "Requested time slot is not available." });
    }

    const updatedTimeSlots = timeSlots.filter((slot) => slot !== requestedSlot);
    console.log("Updated time slots after removing requested slot:", updatedTimeSlots);

    // Update availability
    const updateAvailabilityQuery = `
      UPDATE availability
      SET timeSlots = ?,
          bookedTimes = CASE
            WHEN bookedTimes IS NULL THEN JSON_ARRAY(?)
            ELSE JSON_ARRAY_APPEND(bookedTimes, '$', ?)
          END
      WHERE email = ? AND date = ?
    `;

    console.log("Updating availability with:");
    console.log("Updated time slots:", JSON.stringify(updatedTimeSlots));
    console.log("Requested slot to add to bookedTimes:", requestedSlot);

    db.execute(
      updateAvailabilityQuery,
      [JSON.stringify(updatedTimeSlots), requestedSlot, requestedSlot, email, date],
      (updateErr, result) => {
        if (updateErr) {
          console.error("Error updating availability:", updateErr);
          return res.status(500).json({ message: "Failed to update availability." });
        }

        console.log("Availability updated successfully:", result);

        // Insert consultation into the database
        const sql = `
          INSERT INTO consultations (date, timeStart, timeEnd, guardianId, patientId, description, email, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
        `;

        console.log("Using received time values directly.");
        console.log("Time start:", timeStart);
        console.log("Time end:", timeEnd);

        const sanitizedTimeStart = timeStart.replace(/(AM|PM)\s+(AM|PM)/g, "$1");
        const sanitizedTimeEnd = timeEnd.replace(/(AM|PM)\s+(AM|PM)/g, "$1");

        db.execute(
          sql,
          [date, sanitizedTimeStart, sanitizedTimeEnd, guardianId, patientId, description, email],
          (createErr, result) => {
            if (createErr) {
              console.error("Error creating consultation:", createErr.message);
              return res.status(500).json({ message: "Failed to create consultation." });
            }

            console.log("Consultation created successfully:", result);
            res.status(201).json({ message: "Consultation request submitted successfully." });
          }
        );
      }
    );
  });
};

const getConsultationsForAdmin = (req, res) => {
  const sql = `
    SELECT 
      c.id AS consultationId,
      c.date,
      c.timeStart,
      c.timeEnd,
      c.description,
      c.status,
      CONCAT(g.firstname, ' ', g.middlename, ' ', g.lastname) AS guardianFullName,
      CONCAT(p.patientName) AS patientFullName
    FROM consultations c
    JOIN guardians g ON c.guardianId = g.id
    JOIN patients p ON c.patientId = p.id
  `;

  db.execute(sql, [], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve consultations', error: err });
    }
    res.json({ consultations: results });
  });
};

const updateConsultationStatus = (req, res) => {
  const { consultationId, status } = req.body;

  console.log('Received data:', req.body);

  // Validate required fields
  if (!consultationId || !status) {
    return res.status(400).json({ message: 'Consultation ID and status are required.' });
  }

  // Step 1: Determine the SQL query based on the status
  const isDeclined = status.toLowerCase() === 'declined';
  const updateSql = isDeclined
    ? `UPDATE consultations SET status = ? WHERE id = ?`
    : `UPDATE consultations SET status = ?, pediatricianId = (SELECT id FROM users WHERE userType = 'pediatrician' LIMIT 1) WHERE id = ?`;

  const params = isDeclined ? [status, consultationId] : [status, consultationId];

  // Step 2: Execute the query
  db.execute(updateSql, params, (err, updateResult) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to update consultation', error: err });
    }

    // Handle case where consultation ID does not exist
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Consultation not found.' });
    }

    res.json({ message: `Consultation status updated to ${status}.` });
  });
};

const getConsultationsForGuardian = (req, res) => {
  const userId = req.user.id; // Extracted from the JWT token

  consultationModel.getGuardianId(userId, (err, guardianId) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve guardian ID', error: err });
    }

    if (!guardianId) {
      return res.status(404).json({ message: 'Guardian ID not found for the user' });
    }

    consultationModel.getConsultationsForGuardian(guardianId, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to retrieve consultations', error: err });
      }

      res.json({ consultations: results });
    });
  });
};

const getConsultationDetails = (req, res) => {
  const { consultationId } = req.params;

  consultationModel.getConsultationById(consultationId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve consultation details', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json(results[0]);
  });
};

const deleteConsultation = (req, res) => {
  const { consultationId } = req.params;

  consultationModel.deleteConsultationById(consultationId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete consultation', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.status(200).json({ message: 'Consultation deleted successfully' });
  });
};

const getUpcomingConsultationsForGuardian = (req, res) => {
  const userId = req.user.id; // Extracted from the JWT token

  consultationModel.getGuardianId(userId, (err, guardianId) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch guardian ID', error: err });
    }

    consultationModel.getUpcomingConsultationsForGuardian(guardianId, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to retrieve consultations', error: err });
      }

      res.json(results);
    });
  });
};

const getConsultationsForPediatrician = (req, res) => {
  const sql = `
    SELECT 
      c.id AS consultationId,
      c.date,
      c.timeStart,
      c.timeEnd,
      c.description,
      c.status,
      CONCAT(g.firstname, ' ', g.middlename, ' ', g.lastname) AS guardianFullName,
      CONCAT(p.patientName) AS patientFullName
    FROM consultations c
    JOIN guardians g ON c.guardianId = g.id
    JOIN patients p ON c.patientId = p.id
    WHERE c.status = 'approved'
  `;

  db.execute(sql, [], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve consultations', error: err });
    }
    res.json({ consultations: results });
  });
};

const getConsultationDetailsForPediatrician = (req, res) => {
  const { consultationId } = req.params;
  const pediatricianId = req.user.id; // Assuming `req.user` contains the logged-in user's data

  if (!pediatricianId) {
    return res.status(403).json({ message: 'You are not authorized to view this consultation' });
  }

  consultationModel.getConsultationByIdForPediatrician(consultationId, pediatricianId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve consultation details', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Consultation not found or you are not assigned to this consultation' });
    }

    res.json(results[0]);
  });
};



module.exports = {
  requestConsultation,
  getConsultationsForAdmin,
  updateConsultationStatus,
  getConsultationsForGuardian,
  getConsultationDetails,
  deleteConsultation,
  getUpcomingConsultationsForGuardian,
  getConsultationsForPediatrician,
  getConsultationDetailsForPediatrician,
};
