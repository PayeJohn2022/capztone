const db = require('../config/db');

// Get pediatrician details by pediatricianId
const getPediatricianById = (pediatricianId, callback) => {
  const sql = `
    SELECT firstname, middlename, lastname, contact, clinicAddress, profileImage, specialization
    FROM pediatricians
    WHERE user_id = ?
  `;
  db.execute(sql, [pediatricianId], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.length > 0 ? results[0] : null);
  });
};


// Get user details along with associated pediatrician
const getUserWithPediatrician = (userId, callback) => {
  const sql = `
    SELECT u.id AS userId, p.id AS pediatricianId, u.email
    FROM users u
    JOIN pediatricians p ON u.id = p.user_id
    WHERE u.id = ?
  `;
  db.execute(sql, [userId], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.length > 0 ? results[0] : null);
  });
};

// Update pediatrician details by pediatricianId
const updatePediatricianById = (pediatricianId, updatedData, callback) => {
  const { firstName, middleName, lastName, contact, clinicAddress, profileImage, specialization } = updatedData;

  const sql = `
    UPDATE pediatricians
    SET firstname = ?, middlename = ?, lastname = ?, contact = ?, clinicAddress = ?, profileImage = ?, specialization = ?
    WHERE user_id = ?
  `;

  db.execute(sql, [
    firstName,
    middleName,
    lastName,
    contact,
    clinicAddress,
    profileImage,
    specialization, // Add specialization to the query
    pediatricianId,
  ], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};


module.exports = { getPediatricianById, getUserWithPediatrician, updatePediatricianById };
