
const newQuizTextBar = document.querySelector('#AddNewQuizBar');

const quizzList_container = document.querySelector('select');
const question_container = document.querySelector('.question-container');
const questionTextBar_Form = document.querySelector('#inputQuesTextBar');
const addQuestion_Span = document.querySelector('#addQuestion_Span');
const questionForm_div = document.querySelector('.questionForm-container');

const allAnswerTextBar_Form = document.querySelector('#inputAnswerOL').getElementsByTagName('input');
const allRadio_form = document.querySelector('#SelectedAnswer-div').getElementsByTagName('input');

const SaveButton = document.querySelector('#saveButton');
const cancelButton = document.querySelector('#cancelButton');
const deletQuizButton = document.querySelector('#deleteQuizz');
const playButton = document.querySelector('#PlayButton');

const playLink = document.querySelector('a');

const newQuizAddIcon = document.querySelector('#addnewQuiz-icon');

const ButtonHtml = `<span>
<button class="deleteButton">Delete</button>
<button class="editButton">Edit</button>
</span>`;


//js relating to data usage
let allQuizzesData = (function () {

    arrayOfQuizzes = [];
    if (localStorage.getItem('allQuizzes') != null) {
        arrayOfQuizzes = JSON.parse(localStorage.getItem('allQuizzes'));
        for (const quizzObj of arrayOfQuizzes) addNewQuiz_OptionTag(quizzObj.Title)
    }
    return {
        getArrayOfQuizzes() {
            return arrayOfQuizzes;
        },

        addQuizzInArray(data) {
            arrayOfQuizzes.push(data);
        },

    }

})();


let currentQuizz = (function () {
    let activeQuizz;

    return {
        getCurrentQuiz() {
            return activeQuizz;
        },

        setCurrentQuiz(quizData) {
            activeQuizz = quizData;
            sessionStorage.setItem('currentQuiz', JSON.stringify(quizData))
        }
    }
})();


class Quiz {
    constructor(title) {
        this.Title = title;
        this.noOfCorrectAnswer = 0,
            this.noOfIncorrectAnswer = 0,
            this.totalQuestions = 0,
            this.ArrayOfQuestionData = [];
    }
}

function Question() {
    this.question = "";
    this.correctAnswer = "";
    this.choices = [];
}

function saveData() {
    localStorage.setItem('allQuizzes', JSON.stringify(allQuizzesData.getArrayOfQuizzes()));
    sessionStorage.setItem('currentQuiz', JSON.stringify(currentQuizz.getCurrentQuiz()))
}

// end 

//  js for adding new quizz

newQuizAddIcon.addEventListener('click', (event) => {
    if (newQuizTextBar.value == '') alert('Plase Enter some value');
    else buildNewQuizz(newQuizTextBar.value);
    newQuizTextBar.value = null;
})

newQuizTextBar.addEventListener('keydown',(event)=>{
    if(event.key.toLowerCase() == 'enter'){
        if(newQuizTextBar.value == '') alert("Please enter some value");
        else buildNewQuizz(newQuizTextBar.value)
        newQuizTextBar.value = null;
    }
})


function buildNewQuizz(title) {
    const newQuizz = new Quiz(title);
    allQuizzesData.addQuizzInArray(newQuizz);
    currentQuizz.setCurrentQuiz(newQuizz);
    addNewQuiz_OptionTag(title);
    changeDropDownValue(title.trim());
    updateDisplayedQuestions(newQuizz);
    saveData();
}


function addNewQuiz_OptionTag(quizzTitle) {
    let optionTag = document.createElement('option');
    optionTag.textContent = quizzTitle;
    quizzList_container.appendChild(optionTag);
}


function updateDisplayedQuestions(quizData) {
    const ol = reBuildEmptyOrderedList();
    question_container.appendChild(ol); 
    for (let questionObj of quizData.ArrayOfQuestionData) createNewQuesList(questionObj.question, ol);
}


function createNewQuesList(questionTitle, OList) {
    const  list = document.createElement('li');
    list.innerHTML = questionTitle + ButtonHtml;
    OList.appendChild(list);
}

//end

//add question form js
SaveButton.addEventListener('click', () => {
    for (const input of allAnswerTextBar_Form) {
        if (input.value == '' || input.value == null) {
            alert("Please fill out all answers");
            return;
        }
    }
    if (questionTextBar_Form.value == '' || questionTextBar_Form.value == null) {
        alert("Please fill the question bar");
        return;
    }
    else if (!checkIfRadioSelected(allRadio_form)) {
        alert('Please check one correct answer')
    }
    addNewQuestion();
    showOrRemove_AddQuestionForm();
});

function checkIfRadioSelected(radioArray) {
    for (const radio of radioArray) if (radio.checked == true) return true;
    return false;
}

addQuestion_Span.addEventListener('click', () => {
    if (currentQuizz.getCurrentQuiz() == null) {
        alert("There is no quizz selected! Create one..")
        return;
    }
    showOrRemove_AddQuestionForm();
})

cancelButton.addEventListener('click', () => {
    clearFormValue();
    showOrRemove_AddQuestionForm();
})

function showOrRemove_AddQuestionForm() {
    if (questionForm_div.classList.contains('hide')) {
        questionForm_div.classList.remove('hide');
        addQuestion_Span.classList.add('hide');
    } else {
        questionForm_div.classList.add('hide');
        addQuestion_Span.classList.remove('hide');
    }
}


function addNewQuestion() {
    const questionObj = new Question();
    
    const inputtedAnswer = [];
    for (const input of allAnswerTextBar_Form) {
        inputtedAnswer.push(input.value);
    }
    
    questionObj.question = questionTextBar_Form.value;
    questionObj.choices = inputtedAnswer;

    Array.from(allRadio_form).forEach((radio, index) => {
        if (radio.checked == true) questionObj.correctAnswer = inputtedAnswer[index];
    })//strong the correct answer as a string

    currentQuizz.getCurrentQuiz().ArrayOfQuestionData.push(questionObj);
    const ol = document.querySelector('#allQuestion');
    createNewQuesList(questionObj.question, ol);

    currentQuizz.getCurrentQuiz().totalQuestions += 1;
    clearFormValue();
    saveData();
}

function clearFormValue() {
    questionTextBar_Form.value = null;
    for (const input of allAnswerTextBar_Form) input.value = null;
    for (const radio of allRadio_form) if (radio.checked == true) radio.checked = false;
}

// end


// changing displayed quizz selected from quizz list js 
quizzList_container.addEventListener('change', (event) => {
    changeQuizz(event.target.value);
})

function changeQuizz(titleSelected) {
    for (const quizz of allQuizzesData.getArrayOfQuizzes()) {
        if (quizz.Title == titleSelected) {
            currentQuizz.setCurrentQuiz(quizz);
            updateDisplayedQuestions(currentQuizz.getCurrentQuiz());
        }
    }
}
// end

//delete and edit buton js 

question_container.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() == 'button') {
        if (event.target.textContent.toLowerCase() == 'delete') deleteQuestion(event);
        if (event.target.textContent.toLowerCase() == 'edit') {
            enableOrDisableButtons(event.target.parentElement, true)
            editQuestion(event);
        }
    }
})

function enableOrDisableButtons(spanTag, disable){
    const deleteAndEditBtn = spanTag.getElementsByTagName('button');
    if(disable){
        deleteAndEditBtn[0].disabled = true;
        deleteAndEditBtn[1].disabled = true;
    } else{
        deleteAndEditBtn[0].disabled = false;
        deleteAndEditBtn[1].disabled = false;
    }
}

function deleteQuestion(event) {
    const list = event.target.parentElement.parentElement;
    const stringToCompare = list.textContent.split('\n')[0];
    const questionArray = currentQuizz.getCurrentQuiz().ArrayOfQuestionData;

    questionArray.forEach((quesObj, index) => {
        if (quesObj.question == stringToCompare) questionArray.splice(index, 1);
    }); //removing question from data

    currentQuizz.getCurrentQuiz().totalQuestions -= 1; //decreasing the total count of question
    list.remove();
    saveData();
}

function editQuestion(event) {
    const list = event.target.parentElement.parentElement;
    const stringToCompare = list.textContent.split('\n')[0];
    const questionArray = currentQuizz.getCurrentQuiz().ArrayOfQuestionData;
    for (const quesObj of questionArray) if (quesObj.question == stringToCompare) updateTemplate(quesObj, list);
}

function updateTemplate(quesObj, list) {
    const template = document.importNode(questionForm_div, true);

    template.classList.remove('hide');
    addStyleUsingClassToTemplate(template)

    //chaning the intital content 
    template.querySelector('#inputQuesTextBar').value = quesObj.question;
    const inputAnswerTextBoxArray = getAnswerInputElementsArray_template(template);
    // let index = 0;

    let indexOfCorrectAnswer;
    Array.from(inputAnswerTextBoxArray).forEach((input, index) =>{
        input.value = quesObj.choices[index];
        if(quesObj.correctAnswer == quesObj.choices[index]) indexOfCorrectAnswer = index;
    })
    // for (const input of inputAnswerTextBoxArray) {
    //     input.value = quesObj.choices[index];
    //     if(quesObj.correctAnswer == quesObj.choices[index]) indexOfCorrectAnswer = index;
    //     index++;
    // }

    const radioButtons = template.querySelector('#SelectedAnswer-div').getElementsByTagName('input');
    radioButtons[indexOfCorrectAnswer].checked = true;

    attachListnerToTemplate(template, quesObj, list);
    list.after(template);
}

function addStyleUsingClassToTemplate(template){
    template.querySelector('ol').style.backgroundColor = '#1fd1f7b8';
    template.querySelector('#SelectedAnswer-div').style.backgroundColor = '#1fd1f7b8';
    template.classList.add('margin-property');
}

function getAnswerInputElementsArray_template(template) {
    return template.querySelector('#inputAnswerOL').getElementsByTagName('input');
}

function getQuestionTextBox_template(template) {
    return template.querySelector('#inputQuesTextBar');
}


function attachListnerToTemplate(template, quesObj, list) {
    template.querySelector('#saveButton').addEventListener('click', () => {
        for (const input of getAnswerInputElementsArray_template(template)) {
            if (input.value == '' || input.value == null) {
                alert("Please fill out all answers");
                return;
            }
        }
        if (getQuestionTextBox_template(template).value == '' || getQuestionTextBox_template(template).value == null) {
            alert("Please fill the question bar");
            return;
        } else if (!checkIfRadioSelected(getRadioButtonArray_template(template))) {
            alert('Please check one correct answer')
            return;
        }

        updateEditedQuestion(template, quesObj, list);
        clearTemplateValue(template);
        saveData();
        template.remove();
        enableOrDisableButtons(list.lastElementChild, false);
    })

    template.querySelector('#cancelButton').addEventListener('click', () => {
        template.classList.add('hide');
        enableOrDisableButtons(list.lastElementChild, false);
    })
}


function getRadioButtonArray_template(template) {
    return template.querySelector('#SelectedAnswer-div').getElementsByTagName('input')
}

function updateEditedQuestion(template, quesObj, list) {
    quesObj.question = getQuestionTextBox_template(template).value;
    const inputtedAnswer = getAnswerInputElementsArray_template(template);

    Array.from(inputtedAnswer).forEach((input, index) =>{ quesObj.choices[index] = input.value; })

    const allradioButton = template.querySelector('#SelectedAnswer-div').getElementsByTagName('input');
    Array.from(allradioButton).forEach((radio, index) => {
        if (radio.checked == true) quesObj.correctAnswer = inputtedAnswer[index].value;
    })
    list.innerHTML = quesObj.question + ButtonHtml;
}

function clearTemplateValue(template) {
    getQuestionTextBox_template(template).value = null;
    const inputtedAnswer = getAnswerInputElementsArray_template(template);
    for (const input of inputtedAnswer) input.value = null;
    const allradioButton = template.querySelector('#SelectedAnswer-div').getElementsByTagName('input');
    for (const radio of allradioButton) if (radio.checked == true) radio.checked = false;
}

// end 

//  delete and play button of whole quizz js 

playButton.addEventListener('click', () => {
    playLink.click()
})

deletQuizButton.addEventListener('click', () => {
    if (currentQuizz.getCurrentQuiz() == null) {
        alert("No quiz to delte!!!");
        return;
    } else deleteQuiz();
})

function deleteQuiz() {
    let currentQuizObj = currentQuizz.getCurrentQuiz();
    const arrayofQuiz = allQuizzesData.getArrayOfQuizzes();
    arrayofQuiz.forEach((quizObj, index) => {
        if (quizObj == currentQuizObj) {
            arrayofQuiz.splice(index, 1);
            const quizzList = document.getElementsByTagName('option');
            for (const listOption of quizzList) if (listOption.textContent == currentQuizObj.Title) listOption.remove();

             if (arrayofQuiz.length == 0) {
                currentQuizz.setCurrentQuiz(null);
                question_container.appendChild( reBuildEmptyOrderedList() );
            } else if ((arrayofQuiz.length - 1) < index)  changeQuizz(arrayofQuiz[index - 1].Title);
            else changeQuizz(arrayofQuiz[index].Title)
        }
    })
    if(currentQuizz.getCurrentQuiz() != null) changeDropDownValue(currentQuizz.getCurrentQuiz().Title);
    saveData();
}

function changeDropDownValue(title){
    quizzList_container.value = title;
}

function reBuildEmptyOrderedList(){ //it return ol list with attribute id set
    document.querySelector('#allQuestion').remove();
    const ol = document.createElement('ol');
    ol.setAttribute('id', 'allQuestion');
    return ol;
}


function checkIfAllowedToPlay(event) {
    event.stopPropagation();
    if (currentQuizz.getCurrentQuiz() == null) {
        alert("No quizz selected to play");
        return false;
    }
    else if (currentQuizz.getCurrentQuiz().ArrayOfQuestionData.length >= 1) return true
    else {
        alert("Quiz should have at least one question to play!!!");
        return false;
    }
}