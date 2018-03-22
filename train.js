console.log("working")
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBE_nDUIoSKm7yoNq7KyDE9FT2S0BbSyrA",
    authDomain: "trainscheduler-f48fc.firebaseapp.com",
    databaseURL: "https://trainscheduler-f48fc.firebaseio.com",
    projectId: "trainscheduler-f48fc",
    storageBucket: "",
    messagingSenderId: "514695267695"
};
firebase.initializeApp(config);
var database = firebase.database();
// })//closes document ready 
$(document).ready(function () {

    var trainName = ""
    var destination = ""
    var startTime = 0
    var frequency = 0
    // var trainRef = database.ref("/trains")
    // var newTrainRef = trainRef.push()
    $("#submitBtn").on("click", function () {
        event.preventDefault()
        console.log("buttonclicked")
        trainName = $("#trainName").val()
        console.log(trainName)
        destination = $("#destination").val()
        console.log(destination)
        startTime = $("#startTime").val()
        console.log(startTime)
        frequency = $("#frequency").val()
        console.log(frequency)
        $("#trainName").val("")
        $("#destination").val("")
        $("#startTime").val("")
        $("#frequency").val("")

        var trainRef = database.ref("/trains")
        var newTrainRef = trainRef.push()
        newTrainRef.set({
            trainName: trainName,
            destination: destination,
            startTime: startTime,
            frequency: frequency
        })
    })//closes submit button click
    database.ref("/trains").on("child_added", function (childSnapshot) {
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var startTime = childSnapshot.val().startTime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(startTime, "HH:mm");
        console.log(firstTimeConverted);

        // Current Time: "moment" with empty parentheses = current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = Math.abs(diffTime) % frequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        $(".table").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + frequency + "</td><td>" + tMinutesTillTrain);
        // console.log(trainName);
    })
})

        //Child Added code: ref.on("child_added", function)