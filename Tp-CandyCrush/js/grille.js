import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  cookiesSelectionnees = [];

  constructor(l, c) {
    this.colonnes = c;
    this.lignes = l;
    // le tableau des cookies
    this.cookies = create2DArray(l);

    //let existeAlignement = false;
    this.remplirTableauDeCookies(6);
    }

 showCookies() {
    // on récupère tous les divs de la grille pour y mettre les images 
    let caseDivs = document.querySelectorAll("#grille div");

    // on parcourt tous les divs de la grille
    caseDivs.forEach((div, index) => {
      // on calcule la ligne et la colonne de la case 
      let ligne = Math.floor(index / this.lignes);
      let colonne = index % this.colonnes;

      let cookie = this.cookies[ligne][colonne];
      let img = cookie.htmlImage;

      // On met un écouteur de click sur l'image
      img.onclick = (event) => {
        let cookieClickee = this.getCookieFromImage(event.target);

        // on regarde combien on a de cookies selectionnées
        if (this.cookiesSelectionnees.length === 0) {
          cookieClickee.selectionnee();
          this.cookiesSelectionnees.push(cookieClickee);
        } else if (this.cookiesSelectionnees.length === 1) {
          cookieClickee.selectionnee();
          console.log("On essaie de swapper !")
          this.cookiesSelectionnees.push(cookieClickee);
          // on essaie de swapper
          Cookie.swapCookies(this.cookiesSelectionnees[0],
            this.cookiesSelectionnees[1]);
          // on remet le tableau des cookies selectionnées à 0
          this.cookiesSelectionnees = [];
        } else {
          console.log("Deux cookies sont déjà sélectionnées...")
        }
      }

      // On met un écouteur de drag'n'drop sur l'image
      img.g = (event) => {
        let cookieDragguee = this.getCookieFromImage(event.target);
        cookieDragguee.selectionnee();

        // on remet à zero le tableau des cookies selectionnees
        this.cookiesSelectionnees = [];
        this.cookiesSelectionnees.push(cookieDragguee);
      }

      img.ondragover = (event) => {
        return false;
      }

      img.ondragenter = (event) => {
        const i = event.target;
        i.classList.add("imgDragOver");
      }

      img.ondragleave = (event) => {
        const i = event.target;
        i.classList.remove("imgDragOver");
      }

      img.ondrop = (event) => {
        let cookieDragguee = this.getCookieFromImage(event.target);
        cookieDragguee.selectionnee();

        // on ajoute au tableau la deuxième cookie
        this.cookiesSelectionnees.push(cookieDragguee);

        // et on regarde si on peut les swapper
        Cookie.swapCookies(this.cookiesSelectionnees[0], this.cookiesSelectionnees[1]);

        // on remet le tableau des cookies selectionnées à 0
        this.cookiesSelectionnees = [];
        cookieDragguee.htmlImage.classList.remove("imgDragOver");
      }

      div.appendChild(img);
    });
  }

  getCookieFromImage(i) {
    let ligneCookie = i.dataset.ligne;
    let colonneCookie = i.dataset.colonne;
    return this.cookies[ligneCookie][colonneCookie];
  }
  
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    for (let l = 0; l < this.lignes; l++) {
      for (let c = 0; c < this.colonnes; c++) {
        //console.log("ligne = " + l + " colonne = " + c);
        const type = Math.round(Math.random() * (nbDeCookiesDifferents - 1))
        this.cookies[l][c] = new Cookie(type, l, c);
      }
    }
  }


  // Test des alignements de 3 cookies ou plus, horizontalement et verticalement

  testAlignementDansTouteLaGrille() {
    let alignementExisteLignes = false;
    let alignementExisteColonnes = false;

    alignementExisteLignes = this.testAlignementToutesLesLignes();
    alignementExisteColonnes = this.testAlignementToutesLesColonnes();

    return (alignementExisteLignes || alignementExisteColonnes);
  }

  testAlignementToutesLesLignes() {
    let alignementLignes = false;

    for (let i = 0; i < this.lignes; i++) {
      alignementLignes = this.testAlignementLigne(i);
    }

    return alignementLignes;
  }

  testAlignementLigne(ligne) {
    let alignement = false;

    // on récupère le tableau qui correspond à la ligne
    let tabLigne = this.cookies[ligne];

    //on parcours les colonnes de la ligne courante
    for (let c = 0; c <= this.lignes - 3; c++) {
      let cookie1 = tabLigne[c];
      let cookie2 = tabLigne[c + 1];
      let cookie3 = tabLigne[c + 2];

      if ((cookie1.type === cookie2.type) && (cookie2.type === cookie3.type)) {
        cookie1.cachee();
        cookie2.cachee();
        cookie3.cachee();
        
        alignement = true;
      }
    }
    return alignement;
  }
  testAlignementToutesLesColonnes() {
    let alignementColonnes = false;
    for (let i = 0; i < this.colonnes; i++) {
      alignementColonnes = this.testAlignementColonne(i);
    }

    return alignementColonnes;
  }

  testAlignementColonne(colonne) {
    let alignement = false;

    // on parcourt les lignes de la colonne courante
    for (let l = 0; l <= this.colonnes - 3; l++) {
      let cookie1 = this.cookies[l][colonne];
      let cookie2 = this.cookies[l+1][colonne];
      let cookie3 = this.cookies[l+2][colonne];

      if ((cookie1.type === cookie2.type) && (cookie2.type === cookie3.type)) {
        cookie1.cachee();
        cookie2.cachee();
        cookie3.cachee();
        alignement = true;
      }
    }
    return alignement;
  }

  detecteAlignements() {
    let alignementExiste = false;

    // Parcourez toutes les colonnes de la grille
    for (let c = 0; c < this.colonnes; c++) {
        // Vérifiez s'il y a un alignement dans la colonne actuelle
        if (this.testAlignementColonne(c)) {
            // Si un alignement est trouvé, mettez alignementExiste à true et sortez de la boucle
            alignementExiste = true;
            break;
        }
    }

    // Retournez true si un alignement est trouvé, sinon retournez false
    return alignementExiste;
}


 // maintenant on va tester si on peut faire un drop
 // on ércite une fonction chute pour chaque colonne

 // fonction compacteColonne(indexDebut, indexFin) qui en gros en gros, faire descend le haut de la colonne jusqu'au trou, il peut y avoir un autre trou au dessus mais on le descend aussi.
 chuteColonne(colonne) {
  let trouTrouve = false;
  
  // Parcours de la colonne de bas en haut pour trouver le premier trou
  for (let l = this.lignes - 1; l >= 0; l--) {
      if (this.cookies[l][colonne].htmlImage.style.display === "none") {
          trouTrouve = true;
          let indexDebut = l;
          let indexFin = this.trouveCookieRempli(l, colonne);
          this.compacteColonne(indexDebut, indexFin, colonne);
          break;
      }
  }
  
  // Si aucun trou n'est trouvé, on arrête la fonction
  if (!trouTrouve) {
      return;
  }

  // Parcours de la colonne de bas en haut pour remplir les éventuels trous
  for (let l = 0; l < this.lignes; l++) {
      if (this.cookies[l][colonne].htmlImage.style.display === "none") {
          this.cookies[l][colonne] = new Cookie(Math.floor(Math.random() * nbDeCookiesDifferents), l, colonne);
      }
  }
  
  // Redétection et traitement des alignements après la chute
  while (this.detecteAlignements()) {
      for (let c = 0; c < this.colonnes; c++) {
          this.chuteColonne(c);
      }
  }
}

compacteColonne(indexDebut, indexFin, colonne) {
  // Déplacement des cookies vers le bas pour combler le trou
  for (let l = indexFin; l >= 0; l--) {
      if (this.cookies[l][colonne].htmlImage.style.display === "none") {
          let cookieAuDessus = this.cookies[this.trouveCookieRempli(l, colonne)][colonne];
          this.cookies[l][colonne] = cookieAuDessus;
          this.cookies[this.trouveCookieRempli(l, colonne)][colonne] = new Cookie(Math.floor(Math.random() * nbDeCookiesDifferents), l, colonne);
      }
  }
}

trouveCookieRempli(ligne, colonne) {
  // Parcours de la colonne de bas en haut pour trouver la première case remplie
  for (let l = ligne; l >= 0; l--) {
      if (this.cookies[l][colonne].htmlImage.style.display !== "none") {
          return l;
      }
  }
  return 0; // Si aucune case remplie n'est trouvée, on retourne la première ligne
}
  
 }