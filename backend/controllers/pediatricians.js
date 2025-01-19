const db = require('../config/db');
const { getPediatricianById, updatePediatricianById, getUserWithPediatrician } = require('../models/pediatricianModels');

// Get pediatrician profile
const getPediatricianProfile = (req, res) => {
  const userId = req.user.id; // Extract user ID from authenticated request
  console.log('Fetching profile for user ID:', userId); // Debugging

  // Map user ID to pediatrician ID
  getUserWithPediatrician(userId, (err, userPediatricianData) => {
    if (err) {
      console.error('Error fetching user-pediatrician mapping:', err);
      return res.status(500).json({ message: 'Failed to fetch user-pediatrician mapping.' });
    }
    if (!userPediatricianData || !userPediatricianData.pediatricianId) {
      return res.status(404).json({ message: 'Pediatrician not found for this user.' });
    }

    // Fetch pediatrician data using the pediatrician ID
    getPediatricianById(userPediatricianData.pediatricianId, (err, pediatrician) => {
      if (err) {
        console.error('Error fetching pediatrician profile:', err);
        return res.status(500).json({ message: 'Failed to fetch pediatrician profile.' });
      }
      if (!pediatrician) {
        return res.status(404).json({ message: 'Pediatrician not found.' });
      }
      res.json(pediatrician);
    });
  });
};

  
  const updatePediatricianProfile = (req, res) => {
    const userId = req.user.id; // Extract user ID from authenticated request
    const updatedData = req.body;
  
    console.log('User ID:', userId);
  
    // Handle profile image if provided
    if (req.file) {
      const filePath = `/uploads/profile_images/${req.file.filename}`;
      updatedData.profileImage = filePath;
    }
  
    // Fetch existing profile to ensure we have the current profileImage
    getPediatricianById(userId, (err, existingProfile) => {
      if (err) {
        console.error('Error fetching existing profile:', err);
        return res.status(500).json({ message: 'Failed to update profile.' });
      }
  
      console.log('Pediatrician data:', existingProfile); // Use existingProfile here
      if (!existingProfile) {
        return res.status(404).json({ message: 'Pediatrician profile not found.' });
      }
  
      // Preserve the existing profile image if no new image is provided
      if (!updatedData.profileImage) {
        updatedData.profileImage = existingProfile?.profileImage || null;
      }
  
      // Proceed with updating the profile
      updatePediatricianById(userId, updatedData, (err) => {
        if (err) {
          console.error('Error updating pediatrician profile:', err);
          return res.status(500).json({ message: 'Failed to update pediatrician profile.' });
        }
  
        // Send back the updated profile
        const updatedProfile = {
          ...existingProfile,
          ...updatedData,
        };
  
        res.json({
          message: 'Pediatrician profile updated successfully.',
          updatedProfile,
        });
      });
    });
  };
  

module.exports = { getPediatricianProfile, updatePediatricianProfile };