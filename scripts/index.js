
async function createGame() {
  const api_url = 'https://aivirt-staging.herokuapp.com/api/v1/games/todays-game'
  const response = await fetch(api_url)
  const gameData = await response.json()
  let aGame = new Game(gameData)
  let gameSection = $("#game")
  aGame.questions.forEach(question => {
    gameSection.append(question.hero)
  })
}
  
class Game {
  constructor(attributes) {
    this.id = attributes.id
    this.date = attributes.date
    this.questions = createQuestions(attributes.questions)
  }
}

class Question {
  constructor(attributes) {
    this.text = attributes.question
    this.correct_answer = attributes.correct_answer
    this.answers = attributes.answers
    this.image_url = attributes.image_url
    this.image_author = attributes.image_author
    this.image_author_profile = attributes.image_author_profile
  }

  get hero() {
    return `
        <section class="hero is-dark is-medium" 
        style="background-image: url(${this.image_url}); 
        background-position: center center;
        background-repeat:  no-repeat;
        background-attachment: fixed;
        background-size:  cover;">
        <div class="hero-body">
          <div class="container">
            <h2 class="subtitle">
              <article class="media">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>${this.text}</strong>
                  </p>
                </div>
                <nav class="level is-mobile">
                  <div class="level-left">
                    <table class="answers-table">
                      ${this.answerButtons}
                    </table>
                  </div>
                </nav>
              </div>
            </article>
          </div>
        </div>
        <div class="hero-foot">
          <nav class="tabs is-boxed">
            <div class="container">
              <ul>
                <li><a href="${this.image_author_profile}">Image by: ${this.image_author}</a></li>
                <li><a href="https://unsplash.com/developers">Provided by: Unsplash </a></li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    `
  }

  get answerButtons() {
    return this.answers.map((answer, i) => {
      return `
      <tr>
        <td>
          <a class="button is-danger is-inverted is-outlined answer-button" id="answer-${i}" data-correct=${answer === this.correct_answer}>${answer}</a>
        </td>
      </tr>
      `
    }).join('')
  }

}



function handleAnswerClick(e) {
  if (e.target.dataset.correct === "true") {
    console.log('You are correct!!!')
  } else {
    console.log('Wrong!!!')
  }
}

$("#game").on("click", e => {
  if (e.target.classList.contains('answer-button')) {
    handleAnswerClick(e)
  }
})



const createQuestions = (questionsList) => {
  return questionsList.map(questionData => {
    return new Question(questionData)
  })
}

window.onload = createGame()