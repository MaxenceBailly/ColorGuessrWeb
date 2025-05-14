// Initialisation
document.addEventListener("DOMContentLoaded", function() {
    generateColor();
    updateValidateButton();
    updateAverageScore();
});let realColor = {};
let slidersChanged = {
    r: false,
    g: false,
    b: false
};
let scoreHistory = [];

function generateColor() {
    realColor = {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };
    document.getElementById("colorBox").style.backgroundColor = `rgb(${realColor.r}, ${realColor.g}, ${realColor.b})`;
    
    // Réinitialiser le statut des sliders
    slidersChanged = {
        r: false,
        g: false,
        b: false
    };
    
    // Désactiver le bouton valider
    updateValidateButton();
    
    // Mettre à jour l'affichage de la moyenne des scores
    updateAverageScore();
}

function updateSliderValue(color) {
    const value = document.getElementById(`guess${color}`).value;
    document.getElementById(`value${color}`).textContent = value;
    
    // Marquer ce slider comme ayant été changé
    if (color === 'R') slidersChanged.r = true;
    if (color === 'G') slidersChanged.g = true;
    if (color === 'B') slidersChanged.b = true;
    
    // Mettre à jour l'état du bouton
    updateValidateButton();
}

function updateAverageScore() {
    if (scoreHistory.length > 0) {
        const sum = scoreHistory.reduce((total, score) => total + score, 0);
        const average = sum / scoreHistory.length;
        document.getElementById("averageScore").textContent = average.toFixed(2);
        document.getElementById("gamesCount").textContent = scoreHistory.length;
    } else {
        document.getElementById("averageScore").textContent = "0.00";
        document.getElementById("gamesCount").textContent = "0";
    }
}

function updateValidateButton() {
    const validateButton = document.getElementById("validateButton");
    const allSlidersChanged = slidersChanged.r && slidersChanged.g && slidersChanged.b;
    
    validateButton.disabled = !allSlidersChanged;
    validateButton.style.opacity = allSlidersChanged ? "1" : "0.5";
    validateButton.title = allSlidersChanged ? 
        "Valider votre réponse" : 
        "Veuillez ajuster tous les sliders (R, G, B) avant de valider";
}

// Affiche une popup temporaire
function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 5000);
}

function addToHistory(score, correctColor, userGuess) {
    const history = document.getElementById("history");
    const entry = document.createElement("div");
    entry.className = "history-entry";

    // Conteneur pour les couleurs et infos
    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";

    // Afficher la couleur correcte
    const correctColorCircle = document.createElement("span");
    correctColorCircle.className = "color-circle";
    correctColorCircle.style.backgroundColor = `rgb(${correctColor.r}, ${correctColor.g}, ${correctColor.b})`;
    
    // Afficher la couleur devinée par l'utilisateur
    const guessColorCircle = document.createElement("span");
    guessColorCircle.className = "color-circle";
    guessColorCircle.style.backgroundColor = `rgb(${userGuess.r}, ${userGuess.g}, ${userGuess.b})`;

    // Informations sur les couleurs
    const colorInfo = document.createElement("span");
    colorInfo.className = "color-info";
    colorInfo.textContent = `Correcte R:${correctColor.r} G:${correctColor.g} B:${correctColor.b} | Votre réponse R:${userGuess.r} G:${userGuess.g} B:${userGuess.b} → ${score.toFixed(2)}%`;

    infoContainer.appendChild(correctColorCircle);
    infoContainer.appendChild(guessColorCircle);
    infoContainer.appendChild(colorInfo);

    // Date et heure à droite
    const dateContainer = document.createElement("div");
    dateContainer.className = "date-container";
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR');
    const timeStr = now.toLocaleTimeString('fr-FR');
    dateContainer.textContent = `${dateStr} ${timeStr}`;

    entry.appendChild(infoContainer);
    entry.appendChild(dateContainer);
    history.prepend(entry);
    
    // Ajouter le score à l'historique et mettre à jour la moyenne
    scoreHistory.push(score);
    updateAverageScore();
}

function checkGuess() {
    const guessR = parseInt(document.getElementById("guessR").value);
    const guessG = parseInt(document.getElementById("guessG").value);
    const guessB = parseInt(document.getElementById("guessB").value);

    if (isNaN(guessR) || isNaN(guessG) || isNaN(guessB)) {
        alert("Remplis tous les champs RGB !");
        return;
    }

    // On capture la bonne couleur AVANT de changer realColor
    const correctColor = { ...realColor };
    
    // Capture de la réponse de l'utilisateur
    const userGuess = {
        r: guessR,
        g: guessG,
        b: guessB
    };

    const distance = Math.sqrt(
        Math.pow(correctColor.r - guessR, 2) +
        Math.pow(correctColor.g - guessG, 2) +
        Math.pow(correctColor.b - guessB, 2)
    );

    const maxDistance = Math.sqrt(3 * Math.pow(255, 2));
    const score = Math.max(0, 100 - (distance / maxDistance) * 100);

    showPopup(`🎯 Tu es à ${score.toFixed(2)}% de la bonne couleur !`);
    addToHistory(score, correctColor, userGuess);
    generateColor();
}