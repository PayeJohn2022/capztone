const jwt = require("jsonwebtoken");

// Replace these with your actual API Key and Secret
const API_KEY = "5aaea13a-6fbf-4a3d-8fed-ef3fcfa982a0";
const API_SECRET = "353e1803d31a006752dca25d6f56111c9fe1a25e7a767b5c0e4473dbfb3ab3ac";

// Generate the token
const token = jwt.sign(
  {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_create_room"], // Add permissions as needed
  },
  API_SECRET,
  { expiresIn: "24h" } // Token expiration time
);

console.log("Generated Token:", token);
