// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDl_LzzZ5sNq7V0VFm9yEi2aKmmC028emg",
    authDomain: "train-scheduler-7339f.firebaseapp.com",
    databaseURL: "https://train-scheduler-7339f.firebaseio.com",
    projectId: "train-scheduler-7339f",
    storageBucket: "",
    messagingSenderId: "306079155504",
    appId: "1:306079155504:web:476321b9de591b0e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.
var database = firebase.database();
// Link to Firebase Database for tracking trains
var trainsRef = database.ref("/trains");

// Function responsible for creating the train's information on the HTML
function createTrain(train) {
    // First train time
    var trainTime = moment(train.time, "HH:mm").format("X");
    // How often the train comes
    var frequency = train.frequency * 60;
    // Current time
    var currentTime = moment().format("X");
    var nextArrival = "";
    var minutesAway = "";

    // Calculates the new arrival time of the train
    if (trainTime > currentTime) {
        var newTime = moment(currentTime, "X").add(frequency, "seconds").format("X");
        if (newTime >= trainTime) { 
            nextArrival = trainTime;
        } else {
            while(trainTime > currentTime) {
                trainTime = moment(trainTime, "X").subtract(frequency, "seconds").format("X");
            }
            trainTime = moment(trainTime, "X").add(frequency, "seconds").format("X");
            nextArrival = trainTime;
        };
    } else {
        while (trainTime <= currentTime) {
            trainTime = moment(trainTime, "X").add(frequency, "seconds").format("X");
        }
        nextArrival = trainTime;
    };

    // Calculates how far the next train is
    minutesAway = moment(nextArrival, "X").diff(moment(currentTime, "X"), "minutes");
    if (minutesAway == "0") {
        minutesAway = "Less than a minute away";
    };

    // Writes the following variables to the html
    var newTrain = $("<tr>");
    var trainName = $("<th>").text(train.name);
    var trainDestination = $("<td>").text(train.destination);
    var trainFrequency = $("<td>").text(train.frequency);
    var trainNextArrival = $("<td>").text(moment(nextArrival, "X").format("HH:mm"));
    var trainMinutesAway = $("<td>").text(minutesAway);
    newTrain.append(trainName).append(trainDestination).append(trainFrequency).append(trainNextArrival).append(trainMinutesAway);
    $(".train").append(newTrain);
}

// Checks for the click of the submission button and adds the new train to the firebase
$("#submit").on("click", function() {
        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var time = $("#time-input").val().trim();
        var frequency = $("#frequency-input").val().trim();

        trainsRef.push({
            name,
            destination,
            time,
            frequency
        });

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
});

// Gets the snapshot of the local data during the page load and subsequen value changes
trainsRef.on("value", function(snapshot) {
    $(".train").empty();

    snapshot.forEach((child) => {
        var train = {
            name: child.val().name,
            destination: child.val().destination,
            time: child.val().time,
            frequency: child.val().frequency
        }

        console.log(train.name);
        console.log(train.destination);
        console.log(train.time);
        console.log(train.frequency);
        createTrain(train);
    });
});