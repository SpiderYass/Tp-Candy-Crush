import Grille from "./grille.js";

// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

let grille;

function init() {
  console.log("Page et ressources prêtes à l'emploi");

  // Créer une nouvelle grille
  grille = new Grille(9, 9);
  grille.showCookies();

  // Gestionnaire d'événements pour le bouton "Tester alignement"
  let boutonTesterAlignement = document.querySelector("#buttonTestAlignement");
  boutonTesterAlignement.onclick = () => {
    let existeAlignement = grille.testAlignementDansTouteLaGrille();
    console.log("Existe Alignement : " + existeAlignement);
  }

  // Gestionnaire d'événements pour le bouton "Tester chute"
  let boutonTesterChute = document.querySelector("#buttonTestDrop");
  boutonTesterChute.onclick = () => {
    // Pour chaque colonne
    for (let colonne = 0; colonne < grille.colonnes; colonne++) {
      // Appliquer la chute et le traitement
      grille.chuteColonne(colonne);

      // Redétecter les alignements après la chute et le compactage des colonnes
      let alignementsTrouves = true;
      while (alignementsTrouves) {
        alignementsTrouves = grille.detecteAlignements();
        if (alignementsTrouves) {
          grille.compacteToutesLesColonnes();
        }
      }
    }
  }
}


