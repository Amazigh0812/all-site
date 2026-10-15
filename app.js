const minInput = document.querySelector(".min_range__input");
const minValue = document.querySelector(".min_range__value");

const maxInput = document.querySelector(".max_range__input");
const maxValue = document.querySelector(".max_range__value");

const refreshBtn = document.querySelector(".refresh_btn");
const submitBtn = document.querySelector(".submit_btn");
const input = document.querySelector(".input");
const verbe = document.querySelector(".verbe");

// Configuration de l'exercice
const QUESTION_TIME = "inf";
const ANSWER_TIME = "fr";

let verbs = [];
let currentVerb = null;
let answered = false;

// Mise à jour des valeurs affichées
function updateRangeValues() {
  minValue.textContent = minInput.value;
  maxValue.textContent = maxInput.value;
}

// Vérifie la cohérence des plages
function validateRanges(changedInput) {
  let min = Number(minInput.value);
  let max = Number(maxInput.value);

  if (min > max) {
    if (changedInput === minInput) {
      maxInput.value = min;
    } else {
      minInput.value = max;
    }
  }

  updateRangeValues();
}

// Tire un verbe aléatoire dans la plage choisie
function getRandomVerb() {
  const min = Number(minInput.value);
  const max = Number(maxInput.value);

  // Limite les indices à ceux disponibles dans le JSON
  const first = Math.max(0, min);
  const last = Math.min(verbs.length - 1, max);

  if (first > last) {
    throw new Error("La plage sélectionnée ne contient aucun verbe.");
  }

  const randomIndex = Math.floor(Math.random() * (last - first + 1)) + first;

  return verbs[randomIndex];
}

// Prépare une nouvelle question
function showVerb() {
  if (verbs.length === 0) return;

  currentVerb = getRandomVerb();
  answered = false;

  const question = currentVerb[QUESTION_TIME];

  verbe.textContent = question;

  input.value = "";
  input.placeholder = "Écris ta réponse...";
  input.classList.remove("right", "false");
  input.disabled = false;

  submitBtn.disabled = false;
  submitBtn.textContent = "Valider";
  input.focus();
}

// Vérifie la réponse

function checkAnswer() {
  if (!currentVerb || answered) return;

  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswer = String(currentVerb[ANSWER_TIME]).trim();

  // Réinitialise les couleurs
  input.classList.remove("right", "false", "empty");

  if (userAnswer === "") {
    // Champ vide : affiche la bonne réponse en noir
    input.value = "Bonne réponse: " + correctAnswer;
    input.classList.add("empty");
  } else if (userAnswer === correctAnswer.toLowerCase()) {
    // Bonne réponse : conserve le texte saisi
    input.classList.add("right");
  } else {
    // Mauvaise réponse : affiche la correction en rouge
    input.value = "Bonne réponse: " + correctAnswer;
    input.classList.add("false");
  }

  answered = true;
  input.disabled = true;
  submitBtn.disabled = true;
}

// Événements des curseurs
minInput.addEventListener("input", () => {
  validateRanges(minInput);
});

maxInput.addEventListener("input", () => {
  validateRanges(maxInput);
});

// Vérification de la réponse
submitBtn.addEventListener("click", checkAnswer);

// Permet de valider avec la touche Entrée
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// Génère une nouvelle question sans recharger la page
refreshBtn.addEventListener("click", showVerb);

// Chargement des verbes
async function init() {
  try {
    const response = await fetch("data/all.json");

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    verbs = data.verbe;

    if (!Array.isArray(verbs) || verbs.length === 0) {
      throw new Error("Aucun verbe disponible dans le fichier JSON.");
    }

    // Adapte les curseurs au nombre de verbes disponibles
    minInput.max = verbs.length - 1;
    maxInput.max = verbs.length - 1;

    minInput.value = Math.min(Number(minInput.value), verbs.length - 1);

    maxInput.value = Math.min(
      Math.max(Number(maxInput.value), Number(minInput.value)),
      verbs.length - 1,
    );

    updateRangeValues();
    showVerb();
  } catch (error) {
    console.error("Impossible de charger les verbes :", error);
    verbe.textContent = "Erreur lors du chargement des verbes.";
    submitBtn.disabled = true;
  }
}

init();
