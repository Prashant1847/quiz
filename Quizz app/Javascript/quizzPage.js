//quizz container and it'a related div element
const quizz_div = document.querySelector(".quizz-container");
const question_div = document.querySelector(".question");
const timer_div = document.querySelector(".timer-div");
const answer_div = document.querySelector(".answer-container");
const quesInProgressBar = document.querySelector('.current-question');
const questionNumber_div = document.querySelector(".question-number");
const progress = document.querySelector(".progress");

//reset div 
const reset_div = document.querySelector(".reset-container");

//total score div and it's related element
const totalScore_outer_div = document.querySelector('.totalScore-container');
const score_div = document.querySelector(".score");


//array of list element with  answers
const allChoices = document.querySelector(".answer-container").getElementsByTagName('li'); //getting all the choices

//icon used 
const correctIcon = '<i class="fa-solid fa-circle-check"></i>';
const totalCorrect = document.querySelector(".correct-icon-container");
const total_InCorrect = document.querySelector(".incorrect-icon-container");
const incorrectIcon = '<i class="fa-solid fa-circle-xmark"></i>'

//all buttons
const resetButton = document.querySelector("#resetButton");
const restartButton = document.querySelector('#restart');
const homeButton = document.querySelector('#Home');
const submitButton = document.querySelector("#submitbutton");
const clearButton = document.querySelector("#clearbutton");


//js related to which data will be used  
let CustomQuizData = {
    Title: 'Custom',
    noOfCorrectAnswer: 0,
    noOfIncorrectAnswer: 0,
    totalQuestions: 4,
    
    ArrayOfQuestionData: [

        {
            question: "Grand Central Terminal, Park Avenue, New York is the world's",
            correctAnswer: "largest railway station",
            choices: ["largest railway station",
                      "longest railway station",
                      "highest railway station",
                      "None of the above"]
        },

        {
            question: "When was C programming developed?",
            correctAnswer: "1970s",
            choices: ["1980s", "1990s", "1940s", "1970s"]
        },

        {
            question: "Corey Anderson who has hit the fastest ODI century in 36 balls is from?",
            correctAnswer: "New Zealand",
            choices: ["England", "Australia", "New Zealand", "India"]
        },

        {
            question: "Galileo was an astronomer who?",
            correctAnswer: "discovered four satellites of Jupiter",
            choices: [" discovered that the movement of pendulum produces a regular time measurement",
                "developed the telescope", "discovered four satellites of Jupiter", "All of the above"]
        }
    ]

}

let QuizzData =  (function (){
    data = sessionStorage.getItem('currentQuiz');
    if(data != null) {
        sessionStorage.removeItem('currentQuiz'); //removing the data so that we can play custom quizz when we 
        //click the play quizz link once again
        return JSON.parse(data);
    }
    else return CustomQuizData; 
})();

//end 

//this class contains some reset and loadnext methods with some private method except stop timer which is used in 
//another method also outsite the class

class LoadOrReset {
    #currentQuestionIndex = 0;
    #currentQuestion;
    #timerIntevalId;

    loadNextQuestion() {
        if ((this.#currentQuestionIndex + 1) > QuizzData.totalQuestions) {//current question should not exceed total question
            displayTotalScore_div();
            return 'we made it to the end';
        }
        const currentQuesData = QuizzData.ArrayOfQuestionData[this.#currentQuestionIndex];
        this.#currentQuestion = currentQuesData;
        const queschoices = currentQuesData.choices;

        question_div.textContent = currentQuesData.question;
        //chanding the choice and resetting privous selected choice with id
        Array.from(allChoices).forEach((choice, index)=>{
            if(choice.hasAttribute('id')) choice.removeAttribute('id'); //resetting the choice or privous question
            choice.innerHTML = "<input type='checkbox'></input>" + queschoices[index];
        })

        this.#updateProgressBar();
        this.#updateQuestionNumber_div();
        this.#startTimer();
        removeRedOrGreenBackgroundColor();
        this.#currentQuestionIndex++;
    }
    
    resetQuizz() {
        this.#currentQuestionIndex = 0;
        //remvong whatever is displayed on screen and replacing with quizz container
        if(reset_div.style.display == 'flex') showOrRemove_div(reset_div);
        else showOrRemove_div(totalScore_outer_div);
        this.#resetCorrectIncorrect();
        this.loadNextQuestion();
    }

    #updateProgressBar() {
        progress.style.width = `${((this.#currentQuestionIndex + 1) / QuizzData.totalQuestions) * 100}%`;
        quesInProgressBar.textContent = `${(this.#currentQuestionIndex + 1)} / ${QuizzData.totalQuestions}`;
    }

    #resetCorrectIncorrect(){
        QuizzData.noOfCorrectAnswer = 0;
        QuizzData.noOfIncorrectAnswer = 0;
        total_InCorrect.innerHTML = `${incorrectIcon} ${0}`;
        totalCorrect.innerHTML = `${correctIcon} ${0}`
    }

    getCurrentQuestion() {
        return this.#currentQuestion;
    }

    #startTimer(){
       this.#timerIntevalId = Timer();
    }

    stopTimer(){
        clearInterval(this.#timerIntevalId);
    }

    #updateQuestionNumber_div(){
        questionNumber_div.textContent = `${(this.#currentQuestionIndex+1)} : `;
    }

}

const loadOrResetQuizObject = new LoadOrReset();

function Timer() {
    let timerCount = 30;
    return interval = setInterval(() => {
        timer_div.textContent = timerCount;
        if (timerCount == 0) {
            showOrRemove_div(reset_div);
            clearInterval(interval);
        }
        --timerCount;
    }, 1000);
}

// end 


//js related to selecting answers
answer_div.addEventListener("click", (event) => {
    const target = event.target;
    const tagName = target.tagName.toLowerCase();
    RemovePriviousSelectionAns();
    if (tagName == 'li') {
        setOrRemoveId(target);
        checkOrUncheckBox(target);
    } else if (tagName == 'input') setOrRemoveId(target.parentElement);

})

function RemovePriviousSelectionAns(){
    for(const list of allChoices) if(list.hasAttribute('id')) {
        setOrRemoveId(list);
        checkOrUncheckBox(list)
    }
}


function setOrRemoveId(element) {
    if (element.getAttribute('id') == null) element.setAttribute('id', 'selectedAnswer');
    else element.removeAttribute('id');
    
}

function checkOrUncheckBox(element) {
    let checkbox = element.firstChild;
    if (checkbox.checked == false) checkbox.checked = true;
    else checkbox.checked = false;
}

//end

//clear and sumbit and reset button js 

clearButton.addEventListener('click', resetChoice);

submitButton.addEventListener('click', checkAndLoadNextQuestion)

resetButton.addEventListener('click', ()=> {
    loadOrResetQuizObject.resetQuizz(); // passing the same object to that we can manipulate 
    //memebers in that class using the arguement
});

function resetChoice() {
    for (const list of allChoices) {
        if (list.hasAttribute('id')) {
            list.removeAttribute('id');
            list.firstChild.checked = false;
        }
    }
}

function checkIfAnyAnswerSelected(){
    for(const list of allChoices) if(list.hasAttribute('id')) return true;
    return false;
}

function checkAndLoadNextQuestion() {

    if(!checkIfAnyAnswerSelected()) {
        alert("Please select a choice");
        return 
    }

    loadOrResetQuizObject.stopTimer()// first stopping the timer 
    let  currentAnswerList; 
    for(const choice of allChoices) if (choice.hasAttribute('id'))  currentAnswerList = choice;

    const AnswerSelected = currentAnswerList.textContent;
    const CorrectAnswer = loadOrResetQuizObject.getCurrentQuestion().correctAnswer;

    if (AnswerSelected == CorrectAnswer) {
        currentAnswerList.classList.add('green-Bg');
        add1ToCorrectAnswer();
    } else {
        currentAnswerList.classList.add('red-Bg');
        // showing correct answer also
        for (let choice of allChoices) if (choice.textContent == CorrectAnswer) choice.classList.add('green-Bg');
        add1ToIncorrectAnswer();
    }
        setTimeout(()=>{
            loadOrResetQuizObject.loadNextQuestion();//giving user time to see the correct answer
        }, 2000);
}


function add1ToIncorrectAnswer() {
    QuizzData.noOfIncorrectAnswer += 1;
    total_InCorrect.innerHTML = `${incorrectIcon} ${QuizzData.noOfIncorrectAnswer}`;
}

function add1ToCorrectAnswer() {
    QuizzData.noOfCorrectAnswer += 1;
    totalCorrect.innerHTML = `${correctIcon} ${QuizzData.noOfCorrectAnswer}`;
}

function showCorrectAnswer() {
    const correctAnswer = loadOrResetQuizObject.getCurrentQuestion().correctAnswer;
    for (let choice of allChoices) if (choice.textContent == correctAnswer) choice.classList.add('green-Bg');
}

function removeRedOrGreenBackgroundColor(){
    for(const list of allChoices){
        if(list.classList.contains('green-Bg')) list.classList.remove('green-Bg')
        else if(list.classList.contains('red-Bg')) list.classList.remove('red-Bg');
    }
}


// total score relating js

restartButton.addEventListener('click', ()=> {
    loadOrResetQuizObject.resetQuizz(); // passing the same object to that we can manipulate 
    //memebers in that class using the arguement
});


function displayTotalScore_div(){
    showOrRemove_div(totalScore_outer_div);
    //for every question there is 10 points (total score == (totalquestion * 10))
    //score obtained == (correctquestion * 10)
    score_div.textContent = `${QuizzData.noOfCorrectAnswer * 10} / ${QuizzData.totalQuestions * 10}`;
}

function  showOrRemove_div(div_element){
    if (quizz_div.classList.contains('hide-div')) {
        quizz_div.classList.remove('hide-div');
        div_element.style.display = "none";
    } else {
        quizz_div.classList.add('hide-div');
        div_element.style.display = "flex";
    }
}


loadOrResetQuizObject.loadNextQuestion();