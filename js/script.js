// Variables
var evi1, evi2, evi3, evi4, evi5, evi6;
var currentSel;
var nbEviMin = 0;
var nbEviMax = 3;
var nbEvi = [];
var listGhost;
var listDivEvi;

$(document).ready(function() {
    initPhasmoo();
});

/************ INITIALISATION *************
******************************************/
function initPhasmoo() {
    // INIT Liste des preuves
    evi1 = new Evidence("EMF5", 1);
    evi2 = new Evidence("Empreinte digitale", 2);
    evi3 = new Evidence("Température glaciale", 3);
    evi4 = new Evidence("Orbe fantômatique", 4);
    evi5 = new Evidence("Ecriture fantômatique", 5);
    evi6 = new Evidence("Spirit Box", 6);

    // INIT Liste des fantomes
    ghost1 = new Ghost("Banshee", 1, evi1, evi2, evi3, "Chasse toujours la même personne, jusqu'à sa mort.", "Les crucifix sont plus efficaces contre elle (5m).");
    ghost2 = new Ghost("Demon", 2, evi3, evi5, evi6, "Plus aggressif que n'importe quelle autre entité.", "La planche Ouija ne draine pas la santé mentale.");
    ghost3 = new Ghost("Jinn", 3, evi1, evi4, evi6, "Plus la cible est loin, plus il est rapide.", "Eteindre les lumières lui enlèvera cette capacité.");
    ghost4 = new Ghost("Cauchemar", 4, evi3, evi4, evi6, "Attaquera plus fréquement dans le noir.", "Allumer les lumières réduira ses chances d'attaquer.");
    ghost5 = new Ghost("Oni", 5, evi1, evi5, evi6, "Est plus actif en présence d'un groupe de personne.", "...donc plus facilement identifiable.");
    ghost6 = new Ghost("Fantôme", 6, evi1, evi3, evi4, "Le regarder fait grandement baisser la santé mentale.", "Disparait brièvement s'il est pris en photo pendant une chasse.");
    ghost7 = new Ghost("Poltergeist", 7, evi2, evi4, evi6, "Bouge activement les objets autour de lui.", "Plus vulnérable sans objet dans la pièce.");
    ghost8 = new Ghost("Revenant", 8, evi1, evi2, evi5, "Très rapide en chasse.", "Se cacher le ralentira considérablement.");
    ghost9 = new Ghost("Ombre", 9, evi1, evi4, evi5, "Réduit son activité en présence d'un groupe de personne.", "...donc moins enclin à attaquer face à un groupe.");
    ghost10 = new Ghost("Esprit", 10, evi2, evi5, evi6, "Aucune.", "L'utilisation de bâton d'encens préviendra toute attaque pendant un certain temps.");
    ghost11 = new Ghost("Spectre", 11, evi2, evi3, evi6, "Flotte, ne laisse pas d'empreinte au sol et traverse les murs.", "Réaction toxique au sel.");
    ghost12 = new Ghost("Yurei", 12, evi3, evi4, evi5, "Réduit plus rapidement la santé mentale.", "L'utilisation de bâton d'encens la contraindra à rester aux alentours.");
    listGhost = [ghost1, ghost2, ghost3, ghost4, ghost5, ghost6, ghost7, ghost8, ghost9, ghost10, ghost11, ghost12];

    afficheListGhost();
}

/********** BOUTONS ************
 * ****************************/
// Bouton Preuves
$(".btn-evi").click(function() {
    currentSel = window["evi"+parseInt($(".btn-evi").index(this)+1)];
    
    // Test pour la selection (pas plus de 3 et pas moins de 0)
    if (!currentSel.toggle) {
        nbEviAdd(this);
    } else {
        nbEviSub(this);
    }
});

// Bouton Reset
$(".btn-reset").click(function() {
    nbEvi = [];
    for (i=1; i<=6; i++) window["evi"+i].toggle = false;
    $(".btn-evi").removeClass("btn-evi-on");
    enleveDescription();
    afficheListGhost();
});

// Ajout ou retrait de preuves
function nbEviAdd(div) {
    if (nbEvi.length < nbEviMax) {
        currentSel.toggle = true;
        nbEvi.push(currentSel);
        $(div).addClass("btn-evi-on");

        afficheListGhost();
    }
}
function nbEviSub(div) {
    if (nbEvi.length >= 0) {
        currentSel.toggle = false;
        nbEvi.splice($.inArray(currentSel, nbEvi), 1);
        $(div).removeClass("btn-evi-on");

        afficheListGhost();
    }
}

// Bouton Fantomes
$(".btn-ghost").click(function() {
    if (!$(this).hasClass("btn-ghost-on")) {
        $(this).siblings().removeClass("btn-ghost-on");
        $(this).addClass("btn-ghost-on");
        refreshDescription(listGhost[$(".btn-ghost").index(this)]);
        afficheDescription();
    } else {
        $(this).removeClass("btn-ghost-on");
        enleveDescription();
    }
});

// Bouton Descriptions
$(".desc-ghost-cont").click(function() {
    enleveDescription();
});

function afficheDescription() { $(".desc-ghost-cont").addClass("desc-ghost-cont-show"); }
function enleveDescription() { $(".desc-ghost-cont").removeClass("desc-ghost-cont-show"); $(".btn-ghost").removeClass("btn-ghost-on"); }

function refreshDescription(ghost) {
    $(".desc-title").html(ghost.name);
    $(".desc-strength").html(ghost.strength);
    $(".desc-weak").html(ghost.weak);
    $(".desc-evi").html(ghost.eviA.name + ", " + ghost.eviB.name + " et " + ghost.eviC.name + ".");
}

/*********** FONCTION PRINCIPAL DE CALCUL *********
 **************************************************/
function afficheListGhost() {
    // Reset la liste des fantomes potentiels et leur affichage
    $(".btn-evi").removeClass("btn-evi-pot").removeClass("btn-evi-false").removeClass("btn-evi-true").removeClass("btn-evi-pot-true");
    $(".btn-ghost").removeClass("btn-ghost-true");
    $(".list-btn-ghost").children().removeClass("btn-ghost-show");
    $(".btn-ghost").each(function (index) {
        listGhost[index].potential = true;
    });
    
    // Teste toute la liste des fantomes pour trouver ceux n'ayant PAS la ou les preuves en question, et les enlève de la liste des potentiels
    if (nbEvi != 0) {
        for (i=0; i<nbEvi.length; i++) {
            for (j=0; j<listGhost.length; j++) {
                if (listGhost[j].potential) {
                    if (!listGhost[j].listEvi[nbEvi[i].id-1]) {
                        listGhost[j].potential = false;
                    }
                }
            }
        }
    }
    
    // Affiche la liste de tous les fantômes potentiels, après le test
    $(".btn-ghost").each(function (index) {
        if (listGhost[index].potential) {
            $(this).addClass("btn-ghost-show");
            if (nbEvi.length == 2) {
                $(".btn-evi").eq(listGhost[index].eviA.id-1).addClass("btn-evi-pot");
                $(".btn-evi").eq(listGhost[index].eviB.id-1).addClass("btn-evi-pot");
                $(".btn-evi").eq(listGhost[index].eviC.id-1).addClass("btn-evi-pot");
            }
        }
    });
    $("div.btn-evi-on.btn-evi-pot").removeClass("btn-evi-pot");

    // Cas ou la liste est vide, ou avec 1 seul élément
    if ($(".btn-ghost-show").length == 0) {
        $(".btn-pas-ghost").addClass("btn-ghost-show");
        $(".btn-evi-on").addClass("btn-evi-false");
    } else if ($(".btn-ghost-show").length == 1) {
        $(".btn-evi-on").addClass("btn-evi-true");
        $(".btn-ghost-show").addClass("btn-ghost-true");
        $(".btn-evi-pot").addClass("btn-evi-pot-true");
    }
    
}
