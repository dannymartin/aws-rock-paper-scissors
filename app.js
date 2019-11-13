let userScore = 0;
let computerScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");

AWS.config.update({
  region: 'us-east-2',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-2:64b24ae3-2573-4a95-b74c-b420ab18cc74"
  })
});


// create the AWS.Request object
var bucket = new AWS.S3({ apiVersion: "2006-03-01", params: { Bucket: 'dannymartinresults' } });

function writeToObjectStorage(uploadthing) {
	var dateFileName = Date.now().toString() + ".txt";
	var params = {Key: dateFileName , Bucket: "dannymartinresults" , Body: uploadthing};
	bucket.putObject(params, function (err, data) {
				if (err) console.log(err, err.stack); // an error occurred
				else     console.log(data);           // successful response
	      });
}




function getComputerChoice() {
	const choices = ['r', 'p', 's'];
	const randomNumber = Math.floor(Math.random() * 3);
	return choices[randomNumber];
}

function convertToWord(letter) {
	if (letter === "r") return "Rock";
	if (letter === "p") return "Paper";
	if (letter === "s") return "Scissors";
}

function win(userChoice, computerChoice) {
	userScore++;
	userScore_span.innerHTML = userScore;
	computerScore_span.innerHTML = computerScore;
	result_p.innerHTML = convertToWord(userChoice) + " beats " + convertToWord(computerChoice) + ". You win!";
	document.getElementById(userChoice).classList.add('green-glow')
	setTimeout(function() { document.getElementById(userChoice).classList.remove('green-glow') }, 300);
}

function lose(userChoice, computerChoice) {
	computerScore++;
	computerScore_span.innerHTML = computerScore;
	computerScore_span.inn = computerScore;
	result_p.innerHTML = convertToWord(userChoice) + " loses " + convertToWord(computerChoice) + ". You lose...";
	document.getElementById(userChoice).classList.add('red-glow')
	setTimeout(function() { document.getElementById(userChoice).classList.remove('red-glow') }, 300);
}

function draw(userChoice, computerChoice) {
	result_p.innerHTML = convertToWord(userChoice) + " ties " + convertToWord(computerChoice) + ". You tied.";
	document.getElementById(userChoice).classList.add('gray-glow')
	setTimeout(function() { document.getElementById(userChoice).classList.remove('gray-glow') }, 300);
}

function game(userChoice) {
	const computerChoice = getComputerChoice();
	switch (userChoice + computerChoice) {
		case "rs":
		case "pr":
		case "sp":
			win(userChoice, computerChoice);
			writeToObjectStorage(userChoice + ",Win");
			break;
		case "rp":
		case "ps":
		case "sr":
			lose(userChoice, computerChoice);
			writeToObjectStorage(userChoice + ",Lose");
			break;
		case "rr":
		case "pp":
		case "ss":
			draw(userChoice, computerChoice);
			writeToObjectStorage(userChoice + ",Tie")
			break;
	}
}


function main() {
	rock_div.addEventListener('click', function() {
		game("r");
	})

	paper_div.addEventListener('click', function() {
		game("p");
	})

	scissors_div.addEventListener('click', function() {
		game("s");
	})
}

main();
