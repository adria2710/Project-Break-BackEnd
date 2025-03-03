const admin = require("firebase-admin");
const serviceAccount = require("./project-break-thebridge-firebase-adminsdk-fbsvc-86dd5cdfe1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;