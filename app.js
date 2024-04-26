import {QuizQuestion} from "./questionModel.js";

document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    let currentQuestionIndex = 0;
    let userResponses = {};

    const questionIndices = document.querySelectorAll('.q-index_container li');
    const questionIndicesParentDiv = document.querySelector('.q-index_container');
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');
    const questionContainers = document.getElementById('questionContainers');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');
    const shimmerQuestions = document.getElementById('shimmerQuestions');

    const clickHandler = function(event) {
        if (event.target.tagName === 'LI') {
            const liId = parseInt(event.target.id);
            currentQuestionIndex = liId;
            domUpdater();
        }
    };
    questionIndicesParentDiv.addEventListener('click', clickHandler);

    function createQuestionContainers() {
        questionContainers.innerHTML = '';
        questions.forEach((question,index) => {
            const questionObj=new QuizQuestion(
                index, 
                question.question.text,
                question.incorrectAnswers,
                question.correctAnswer
            );
            const questionElement = questionObj.render();
            questionContainers.appendChild(questionElement);
        });
        // questions.forEach((question, i) => {
        //     const questionDiv = document.createElement('div');
        //     questionDiv.className = 'questionContainer';
        //     questionDiv.id = `question_${i}`;
        //     const options = [...question.incorrectAnswers, question.correctAnswer];
        //     questionDiv.innerHTML = `
        //         <h3>Question ${i + 1}</h3>
        //         <p>${question.question.text}</p>
        //         <form id="form_${i}">
        //             ${options.map((option, idx) => `
        //                 <input type="radio" id="q${i}_option${idx}" name="q${i}" value="${option}">
        //                 <label for="q${i}_option${idx}">${option}</label><br>
        //             `).join('')}
        //         </form>
        //     `;
        //     questionContainers.appendChild(questionDiv);
        // });
    }

    function showQuestion(index) {
        const containers = document.querySelectorAll('.questionContainer');
        containers.forEach(container => container.style.display = 'none');
        containers[index].style.display = 'block';

        prevButton.style.display = (index > 0) ? 'inline-block' : 'none';
        nextButton.style.display = (index < containers.length - 1) ? 'inline-block' : 'none';
        submitButton.style.display = (index === containers.length - 1) ? 'inline-block' : 'none';

        if (index === containers.length - 1) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    function domUpdater() {
        questionIndices.forEach(li => {
            const liId = parseInt(li.id); 
            if (liId === currentQuestionIndex) {
                li.classList.add('activeQuestion');
                showQuestion(currentQuestionIndex);
            } else {
                li.classList.remove('activeQuestion');
            }
        });
    }

    function fetchData() {
        fetch('https://the-trivia-api.com/v2/questions')
            .then(res => res.json())
            .then((data) => {
                if (data?.length) {
                    console.log(data)
                    questions = [...questions, ...data];
                    shimmerQuestions.style.display='none'
                    questionContainers.style.display='block'
                    createQuestionContainers();
                    domUpdater();
                } else {
                    console.error('No questions found');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
            domUpdater();
        }
    }

    function goToNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
            domUpdater();
        }
    }

    function handleSubmitQuiz() {
        let totalScore = 0;
        let attemptedQuestions = 0;
    
        questions.forEach((question, index) => {
            const userResponse = userResponses[index];
    
            if (userResponse !== undefined) {
                attemptedQuestions++;
                if (userResponse === question.correctAnswer) {
                    totalScore++;
                }
            } else {
                totalScore += 0;
                attemptedQuestions++;
            }
        });
    
        const scorePercentage = (questions.length > 0) ? Math.round((totalScore / questions.length) * 100) : 0;
        resultElement.textContent = `You scored ${totalScore} out of ${questions.length} (${scorePercentage}%)`;
        resultElement.style.display = 'block';
        submitButton.style.display = 'none';
        prevButton.style.display = 'none';
        questionIndicesParentDiv.removeEventListener('click', clickHandler);

        
    }
    

    function handleFormSubmission(event) {
        const selectedOption = event.target.value;
        const questionIndex = parseInt(event.target.name.replace('q', ''));

        userResponses[questionIndex] = selectedOption;
        console.log(`User response for question ${questionIndex}: ${selectedOption}`);
        
    }

    prevButton.addEventListener('click', goToPreviousQuestion);
    nextButton.addEventListener('click', goToNextQuestion);
    submitButton.addEventListener('click', handleSubmitQuiz);
    questionContainers.addEventListener('change', handleFormSubmission);

    fetchData(); 
});


