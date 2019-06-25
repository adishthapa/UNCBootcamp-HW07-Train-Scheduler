// Your web app's Firebase configuration
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

function createTrain(train) {
    var nextArrival = "";
    var minutesAway = "";
    var newTrain = $("<tr>");

    var trainTime = moment(train.time, "HH:mm").format("X");
    var frequency = train.frequency * 60;
    var currentTime = moment().format("X");

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

    minutesAway = moment(nextArrival, "X").diff(moment(currentTime, "X"), "minutes");

    if (minutesAway == "0") {
        minutesAway = "Less than a minute away";
    };

    var trainName = $("<th>").text(train.name);
    var trainDestination = $("<td>").text(train.destination);
    var trainFrequency = $("<td>").text(train.frequency);
    var trainNextArrival = $("<td>").text(moment(nextArrival, "X").format("HH:mm"));
    var trainMinutesAway = $("<td>").text(minutesAway);


    newTrain.append(trainName).append(trainDestination).append(trainFrequency).append(trainNextArrival).append(trainMinutesAway);
    $(".train").append(newTrain);
}

$("#submit").on("click", function() {
    var train = {
        name: $("#name-input").val(),
        destination: $("#destination-input").val(),
        time: $("#time-input").val(),
        frequency: $("#frequency-input").val()
    }
    createTrain(train);
});