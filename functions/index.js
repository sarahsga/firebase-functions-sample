// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var functions = require('firebase-functions');
var admin = require('firebase-admin');
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAU7PYKd7gIeCutfLKhR1MjOYQPGZmdq0M",
    authDomain: "geofire-app-67c85.firebaseapp.com",
    databaseURL: "https://geofire-app-67c85.firebaseio.com",
    projectId: "geofire-app-67c85",
    storageBucket: "geofire-app-67c85.appspot.com",
    messagingSenderId: "109559395651"
  };
  firebase.initializeApp(config);

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/articles/{articleId}')
    .onWrite(event => {

        // Grab the current value of what was written to the Realtime Database.
        var eventSnapshot = event.data;
        var str1 = "Author is ";
        var str = str1.concat(eventSnapshot.child("author").val());
        console.log(str);

        var topic = "android";
        var payload = {
            data: {
                title: eventSnapshot.child("title").val(),
                author: eventSnapshot.child("author").val()
            }
        };

        // Send a message to devices subscribed to the provided topic.
        return admin.messaging().sendToTopic(topic, payload)
            .then(function (response) {
                // See the MessagingTopicResponse reference documentation for the
                // contents of response.
                console.log("Successfully sent message:", response);
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
            });
    });

exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {

    var eventSnapshot = event.data;
    console.log("event snapshot is = " + JSON.stringify(eventSnapshot));
    var uid = eventSnapshot.uid;
    console.log("%%%%%% THE UID IS " + uid);

    firebase.database().ref('users/' + uid).set({
        abc: "HELLO"
    });
});