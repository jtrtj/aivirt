let newGame;

const logo = $("#logo");
const logoMessage = $("#logo-message");

logoMessage.hide();

logo.on("click", function() {
  location.reload();
});
logoMessage.on("click", function() {
  location.reload();
});

$(".navbar-brand").mouseenter(function() {
  logo.hide();
  logoMessage.show();
});

$(".navbar-brand").mouseleave(function() {
  logoMessage.hide();
  logo.show();
});

async function createGame() {
  let gameSection = $("#game");
  gameSection.empty();
  const api_url =
    "https://aivirt-staging.herokuapp.com/api/v1/games/todays-game";
  const response = await fetch(api_url);
  const gameData = await response.json();
  newGame = new Game(gameData);
  newGame.questions.forEach(question => {
    gameSection.append(question.hero);
  });
}

class Game {
  constructor(attributes) {
    this.id = attributes.id;
    this.date = attributes.date;
    this.questions = createQuestions(attributes.questions);
    this.score = 0;
    this.questions_answered = 0;
  }
}

class Question {
  constructor(attributes) {
    this.text = attributes.question;
    this.correct_answer = attributes.correct_answer;
    this.answers = attributes.answers;
    this.image_url = attributes.image_url;
    this.image_author = attributes.image_author;
    this.image_author_profile = attributes.image_author_profile;
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
                <li><a href="${this.image_author_profile}">Image by: ${
      this.image_author
    }</a></li>
                <li><a href="https://unsplash.com/developers">Provided by: Unsplash </a></li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    `;
  }

  get answerButtons() {
    return this.answers
      .map((answer, i) => {
        return `
      <tr>
        <td>
          <a class="button is-danger is-inverted is-outlined answer-button" id="answer-${i}" data-correct=${answer ===
          this.correct_answer}>${answer}</a>
        </td>
      </tr>
      `;
      })
      .join("");
  }
}

function handleAnswerClick(e) {
  newGame.questions_answered++;
  if (e.target.dataset.correct === "true") {
    newGame.score++;
    e.target.parentElement.parentElement.parentElement.replaceWith("Correct!");
    checkGameStatus();
  } else {
    e.target.parentElement.parentElement.parentElement.replaceWith(
      "Incorrect!"
    );
    checkGameStatus();
  }
}

function checkGameStatus() {
  if (newGame.questions_answered === newGame.questions.length) {
    endGame();
  }
}

$("#game").on("click", e => {
  if (e.target.classList.contains("answer-button")) {
    handleAnswerClick(e);
  } else if (e.target.id === "start-game") {
    createGame();
  }
});

const createQuestions = questionsList => {
  return questionsList.map(questionData => {
    return new Question(questionData);
  });
};

window.onload = startScreen();

function endGame() {
  $("#game").empty();
  $("#game").append(
    `
    <section class="hero is-dark is-fullheight">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Game Over
          </h1>
          <h2 class="subtitle">
            You answered ${newGame.score} of ${
      newGame.questions.length
    } questions correctly!
          </h2>
          <h2 class="subtitle">
            <a class="button is-danger is-inverted is-outlined" id="start-game">Play again?</a>
          </h2>
        </div>
      </div>
    </section>

    `
  );
}
function startScreen() {
  $("#game").append(
    `
    <section class="hero is-dark is-fullheight">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Welcome to Aivirt
          </h1>
          <h2 class="subtitle">
            <a class="button is-danger is-inverted is-outlined" id="start-game">Play today's game</a>
          </h2>
        </div>
      </div>
    </section>

    `
  );
}