class QuizQuestion {
    constructor(index, questionText, incorrectAnswers, correctAnswer) {
        this.index = index;
        this.questionText = questionText;
        this.incorrectAnswers = incorrectAnswers;
        this.correctAnswer = correctAnswer;
    }

    render() {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'questionContainer';
        questionDiv.id = `question_${this.index}`;
        const allOptions = [...this.incorrectAnswers, this.correctAnswer];
        questionDiv.innerHTML = `
                <h3>Question ${this.index + 1}</h3>
                <p>${this.questionText}</p>
                <form id="form_${this.index}">
                    ${allOptions.map((option, idx) => `
                        <input type="radio" id="q${this.index}_option${idx}" name="q${this.index}" value="${option}">
                        <label for="q${this.index}_option${idx}">${option}</label><br>
                    `).join('')}
                </form>
            `;

        return questionDiv
    }
}
export {QuizQuestion}



