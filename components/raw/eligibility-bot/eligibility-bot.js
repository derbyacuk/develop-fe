import $ from 'jquery';

var answer1 = "<h2>FDA OR FDSC</h2>"+
				"<ul>" +
				"<li>This study option is perfect for you if you do not want to commit to three uears of study as it is a two year programme</li>" +
				"<li>Provided you meet the entry requirements needed you can top up and study for a further year to achieve a full BA/BSc (Hons) degree" +
				"<li>Strong practical experience</li>" +
				"<li>Funding for this route of study is available through Student Finance</li>" +
				"<li>Course content is subject specific and so provides a strong knowledge base in preparation fo ryou transition from level 3 to level 4 study, if you choose to top-up</li>"+
				"</ul>";
var answer2 =   "<h2>Access to higher education diploma</h2>" +
			 	"<ul>" +
			 	"<li>This study option is for you if you do not have the UCAS points required to begin a full BA/BSC (hons) degree</li>" +
			 	"<li>If you successfully complete, you will gain a nationally recognised Access to Higher Education Diploma</li>" +
			 	"<li>Once you've complete this course, you can apply to study on a degree of your choice</li>" +
			 	"<li>You will need to be over 19 years of age</li>" +
			 	"<li>Ideally, you will have achieved Mathematics and English Function Skills Level 2 or GCSEs at grade C (new grading 4), however students will be considered on an individual basis</li>" +
			 	"<li>If you are aged between 19-23, you may be exempt from course fees. For all other students you may be eligible to appply for the 19+ Advanced Learner Loan. Upon completion of your Access course and undergraduate degree, your Advanced Learner Loan will be written off.</li>" +
			 	"<li>We offer a pre-access course for developing academic skill and confidence - if you choose to complete this course, you will gain a nationally recognised Level 2 qualification which then enables you to apply for the Access to Higher Educaiton Diploma or Foundation Joint HOnours programme</li>" +
			 	"<li>On this course you will study a set of core subjects with no optional modules</li>" +
			    "</ul>";
var answer3 = 	"<h2>Degree with foundation year</h2>" +
				"<ul>" +
				"<li>This study option is perfect for you if you achieve lower grades than expected, are returning to education for a change in career, or your a-levels no longer match your career ambitions and so want to build you knowledge in a different area</li>" +
				"<li>Our \"Degree with Foundation Year\" route is an integrated four-year degree. on completion of the four years, you will graduate with a full BA/BSc (Hons) dgree - you will not need to apply again for the remaining three years once you have complete the Foundation Year. If you course is arts-based, this is a stand-alone one-year course - you will have t re-apply directly to the University to graduate with a full BA/BSc (Hons) dgree</li>" +
				"<li>You can get funding for the for years of study</li>" +
				"<li>Couse content is subject specific and so provides a strong knowledge base in preparation for your transition from level 3 to level 4 study</li>" +
				"</ul>";

var answer4 = 	"<h2>Foundation programme joint honours</h2>" +
				"<ul>" +
				"<li>This study option is for you if you do not have the qualifications to study our Access to Higher Education Diploma</li>" +
				"<li>You will study three core subjects: Study Skills, Maths and English. You'll then choose a further three subjects from a set subject list</li>" +
				"<li> We offer a pre-access course for developing academic skills and confidence - if you choose to complete this course you will gain a nationally recognised Level 2 qualification which then enables you to apply for the Access to Higher Education Diploma or Foundation Joint Honours programme.</li>" +
				"<li>If you're eligible, funding for this course can be granted through the Student Loans Company</li>" +
				"</ul>";
var questions = {
	entry: "question1",

	question1: {
		"text": "<p>Do you have any formal qualifications?</p>",
		"answers": [
			{
				"text": "Yes",
				"answer": "question2"
			},

			{
				"text": "No",
				"answer": "question3"
			}

		]
	},

	question2: {
		"text": "<p>Do you have the UCAS points for your course of interest? (With quals)</p>",
		"answers": [
			{
				"text": "Yes",
				"answer": "answer1"
			},

			{
				"text": "No",
				"answer": "answer2"
			}
		]
	},

	question3: {
		"text": "<p>Do you have the UCAS points for your course of interest? (Without quals)</p>",
		"answers": [
			{
				"text": "Yes",
				"answer": "answer3"
			},

			{
				"text": "No",
				"answer": "answer4"
			}
		]
	},

	answer1: {
		"text": answer1 + answer3
		},
		answer2: {
		"text": answer2 + answer4
	},
		answer3: {
		"text": answer3
	},
		answer4: {
		"text": answer4
	},
};

/**
 * doQuiz - initialize the quiz.
 * @return {boolean} True
 */
var questionHistory = [];

function doQuiz() {

	if (!questions.hasOwnProperty("entry")) throw "Questions must have an 'entry' property";

	var entry = questions.entry;

	var quizContainer = document.getElementById("quizContainer");
	renderQuestion(entry);

	return true;
}

/**
 * [getNextQuestion description]
 * @param  {[type]} elem [description]
 * @return {[type]}      [description]
 */
function getNextQuestion(elem) {
	var nextQuestion = elem.dataset.next;

	if (!questions.hasOwnProperty(nextQuestion)) return false;

	renderQuestion(nextQuestion);
}

function getLastQuestion(lastQuestion) {

	if (!questions.hasOwnProperty(lastQuestion)) return false;

	renderQuestion(lastQuestion);
}

function renderQuestion(question) {
	var questionObject = questions[question];

	var quizContainer = document.getElementById("quizContainer");

	while (quizContainer.hasChildNodes()) {
		quizContainer.removeChild(quizContainer.lastChild);
	}


	$(quizContainer).append(questionObject.text);

	if (questionObject.hasOwnProperty('answers')) {

		for (var i = 0; i < questionObject.answers.length; i++) {
			quizContainer.append(makeAnswer(questionObject.answers[i], question));
		}

		if (questionHistory.length) quizContainer.append(makeGoBackButton());

	} else {
		quizContainer.append(makeGoBackButton());
		quizContainer.append(makeRestart());
	}

}

function makeGoBackButton() {
	var backNode = document.createElement('a');
	var node = document.createTextNode("Go back?");
	backNode.appendChild(node);
	backNode.setAttribute("href", "#");
	backNode.onclick = function (event) { event.preventDefault(); getLastQuestion(questionHistory.pop()); };

	return backNode;
}
// Generate the markup for answers (shoud be buttons or other interactive element)
function makeAnswer(answer, question) {

	var answerNode = document.createElement('a');
	var node = document.createTextNode(answer.text);
	answerNode.appendChild(node);
	answerNode.setAttribute("data-next", answer.answer);
	answerNode.setAttribute("class", "button-outline");
	answerNode.setAttribute("href", "#");
	answerNode.onclick = function (event) { event.preventDefault(); questionHistory.push(question); getNextQuestion(this); };

	return answerNode;
}

// Generate the markup for answers (shoud be buttons or other interactive element)
function makeRestart() {
	var answerNode = document.createElement('a');
	var node = document.createTextNode("Start again?");
	answerNode.appendChild(node);
	answerNode.setAttribute("href", "#");
	answerNode.onclick = function (event) { event.preventDefault(); doQuiz(); };

	return answerNode;
}

if ($("#quizContainer").length) {
	doQuiz();
}