const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://full-stack-restaurant-ap-26a16-default-rtdb.europe-west1.firebasedatabase.app"
});
const db = admin.firestore();
const Dishes = db.collection("Dishes");
const Users = db.collection("Users")
module.exports = [Dishes, Users];