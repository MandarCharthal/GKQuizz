$(document).ready(function() {
    var quizData = [
        {
            question: "1.What is the capital of France?",
            options: ["Paris", "London", "Berlin", "Madrid"],
            answer: 0
        },
        {
            question: "2.Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: 1
        },
        {
            question: "3.What is the largest mammal in the world?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
            answer: 1
        }
    ];

    var timer;
    var timeLimit = 120;
    var currentTime = timeLimit;
    var currentQuestionIndex = 0;
    var questionContainer = $("#question");
    var optionsContainer = $("#optionsContainer");
    var userAnswers = new Array(quizData.length).fill(-1);

    function updateQuestion() {
        var currentQuestion = quizData[currentQuestionIndex];
        questionContainer.text(currentQuestion.question);
      
        optionsContainer.empty();
        for (var i = 0; i < currentQuestion.options.length; i++) {
            var optionId = "option-" + (i + 1);
            var isSelected = userAnswers[currentQuestionIndex] === i;
    
            $("<input>")
                .attr("type", "radio")
                .attr("name", "answer")
                .attr("id", optionId)
                .val(i)
                .prop("checked", isSelected)
                .appendTo(optionsContainer);
    
            $("<label>")
                .attr("for", optionId)
                .text(currentQuestion.options[i])
                .appendTo(optionsContainer);
    
            optionsContainer.append("<br>");
        }
    
        var selectedAnswerIndex = userAnswers[currentQuestionIndex];
        if (selectedAnswerIndex !== -1) {
            $("input[name='answer'][value='" + selectedAnswerIndex + "']").prop("checked", true);
        }
    
        if (currentQuestionIndex === 0) {
            $("#previousButton").hide();
            $("#nextButton").show();
            $("#submitButton").hide();
        } else if (currentQuestionIndex === quizData.length - 1) {
            $("#previousButton").show();
            $("#nextButton").hide();
            $("#submitButton").show();
        } else {
            $("#previousButton").show();
            $("#nextButton").show();
            $("#submitButton").hide();
        }
    }
    
      

    function updateTimer() {
        var minutes = Math.floor(currentTime / 60);
        var seconds = currentTime % 60;
        var formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        $("#time").text(formattedTime);
    }

    function startTimer() {
        timer = setInterval(function() {
            if (currentTime > 0) {
                currentTime--;
                updateTimer();
            } else {
                clearInterval(timer);
                finishQuiz();
            }
        }, 1000);
    }

    function finishQuiz() {
        clearInterval(timer);

        var correctAnswersCount = 0;
        for (var i = 0; i < userAnswers.length; i++) {
            if (userAnswers[i] === quizData[i].answer) {
                correctAnswersCount++;
            }
        }

        var passed = correctAnswersCount >= 2;
        showResult(passed);
    }

    function saveSelectedAnswer() {
        var selectedAnswerIndex = $("input[name='answer']:checked").val();
        if (selectedAnswerIndex !== undefined) {
            userAnswers[currentQuestionIndex] = parseInt(selectedAnswerIndex);
        }
    }
    

    function showResult(passed) {
        $("#quiz").hide();
        $("#result").show();
        var resultMessage = $("#resultMessage");
        var percentageDisplay = $("#percentage"); 
        resultMessage.text(passed ? "Passed" : "Failed");
        resultMessage.addClass(passed ? "passed" : "failed");

        var correctAnswers = 0;
        for (var i = 0; i < userAnswers.length; i++) {
            if (userAnswers[i] === quizData[i].answer) {
                correctAnswers++;
            }
        }
        var percentage = (correctAnswers / quizData.length) * 100;
        percentageDisplay.text(`Result: ${percentage.toFixed(2)}%`);
    }

  function resetQuiz() {
        clearInterval(timer);
        currentTime = timeLimit;
        updateTimer();
        $("input[type='radio']").prop("checked", false); 
        userAnswers.fill(-1);
        $("#result").hide();
        $("#resultMessage").removeClass("passed failed");
        $("#welcome").show();
        currentQuestionIndex = 0;
        updateQuestion();
    }

    $("#startButton").click(function() {
        $("#welcome").hide();
        $("#quiz").show();
        startTimer();
        updateQuestion();
    });

    $("#previousButton").click(function() {
        saveSelectedAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestion();
        }
    });

    $("#nextButton").click(function() {
        saveSelectedAnswer();
        
        // Alert if no answer is selected
        if ($("input[name='answer']:checked").length === 0) {
            alert("Please select an answer before moving to the next question.");
            return;
        }

        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            updateQuestion();
        }
    });

    $("#submitButton").click(function(event) {
        event.preventDefault();

        var selectedAnswerIndex = $("input[name='answer']:checked").val();

        if (selectedAnswerIndex === undefined) {
            alert("Please select an answer before submitting.");
            return;
        }

        userAnswers[currentQuestionIndex] = parseInt(selectedAnswerIndex);
        finishQuiz();
    });


    $("#restartButton").click(function() {
        resetQuiz();
    });

    updateTimer();
    $("#quiz").hide();
    $("#result").hide();
});

