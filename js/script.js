// Variables
var countEvi;
var listEvi = [];
var listGhost = [];
var boolList = [];
var curBtnEvi, timeOut = 0, timeOutCheck = 0;

$(document).ready(function() {  initPhasmoo(); });

// When the page is completely loaded
$(window).on('load', function() {
    // Pour l'instant rien du tout, mais pour l'implémentation d'un loading, si l'appli est lourde
});

/************ INITIALISATION *************
******************************************/
function initPhasmoo() {
    // INIT Evidence List
    listEvi[0] = new Evidence("EMF5");
    listEvi[1] = new Evidence("Empreinte digitale");
    listEvi[2] = new Evidence("Température glaciale");
    listEvi[3] = new Evidence("Orbe fantômatique");
    listEvi[4] = new Evidence("Ecriture fantômatique");
    listEvi[5] = new Evidence("Spirit Box");

    // INIT Ghost List
    listGhost[0] = new Ghost("Banshee", 0, 1, 2, "Chasse toujours la même personne, jusqu'à sa mort.", "Les crucifix sont plus efficaces contre elle (5m).");
    listGhost[1] = new Ghost("Demon", 2, 4, 5, "Plus aggressif que n'importe quelle autre entité.", "La planche Ouija ne draine pas la santé mentale.");
    listGhost[2] = new Ghost("Jinn", 0, 3, 5, "Plus la cible est loin, plus il est rapide.", "Eteindre les lumières lui enlèvera cette capacité.");
    listGhost[3] = new Ghost("Cauchemar", 2, 3, 5, "Attaquera plus fréquement dans le noir.", "Allumer les lumières réduira ses chances d'attaquer.");
    listGhost[4] = new Ghost("Oni", 0, 4, 5, "Est plus actif en présence d'un groupe de personne.", "...donc plus facilement identifiable.");
    listGhost[5] = new Ghost("Fantôme", 0, 2, 3, "Le regarder fait grandement baisser la santé mentale.", "Disparait brièvement s'il est pris en photo pendant une chasse.");
    listGhost[6] = new Ghost("Poltergeist", 1, 3, 5, "Bouge activement les objets autour de lui.", "Plus vulnérable sans objet dans la pièce.");
    listGhost[7] = new Ghost("Revenant", 0, 1, 4, "Très rapide en chasse.", "Se cacher le ralentira considérablement.");
    listGhost[8] = new Ghost("Ombre", 0, 3, 4, "Réduit son activité en présence d'un groupe de personne.", "...donc moins enclin à attaquer face à un groupe.");
    listGhost[9] = new Ghost("Esprit", 1, 4, 5, "Aucune.", "L'utilisation de bâton d'encens préviendra toute attaque pendant un certain temps.");
    listGhost[10] = new Ghost("Spectre", 1, 2, 5, "Flotte, ne laisse pas d'empreinte au sol et traverse les murs.", "Réaction toxique au sel.");
    listGhost[11] = new Ghost("Yurei", 2, 3, 4, "Réduit plus rapidement la santé mentale.", "L'utilisation de bâton d'encens la contraindra à rester aux alentours.");

    // INIT Boolean List to true => List of all potential Ghosts
    resetList();

    // Run the main function
    updateList();

    // INIT Hammer.js (plugin)
    var sidenoteOpen = new Hammer(document.querySelector(".mainContent"));
    sidenoteOpen.on('swipeleft', function(ev) {
        showSidenote();
    });
    var sidenoteClose = new Hammer(document.querySelector(".sidenote"));
    sidenoteClose.on('swiperight', function(ev) {
        hideSidenote();
    });
}

/********** BUTTONS BEHAVIORS ************
******************************************/
// Button Evidence
$('.btn-evi').on('mousedown touchstart', function(e) {
    e.preventDefault();
    curBtnEvi = $(this);
    timeOutCheck = 0;
    timeOut = setTimeout(function(){
        switchState("2", "2", "0");
        timeOutCheck++;
    }, 250);
}).bind('mouseup touchend', function(e) {
    e.preventDefault();
    if(timeOutCheck == 0)
        switchState("1", "1", "0");
    clearInterval(timeOut);
});

// Button Reset
$(".mainContent .btn-reset").click(function() {
    $(".btn-evi").attr("state", "0");
    resetList();
    updateList();
});

// Button sidenote
$(".btn-view[to='sidenote']").click(function () {
    showSidenote();
});

function resetList() {
    for (i=0; i<listGhost.length; i++) {
        boolList[i] = true;
    }
    countEvi = 0;
    $(".btn-pas-ghost").attr("hide", true);
    $(".btn-evi").removeAttr("pot");
    $(".mainContent").attr("final", "0");
}

// Bouton Fantomes
$(".btn-ghost").click(function() {
    if ($(this).attr("state") == "0") {
        $(this).siblings().attr("state", "0");
        $(this).attr("state", "1");
    }
    else {
        $(this).attr("state", "0");
    }
    
    // Show or Hide description div
    if (!$(".desc-ghost-cont").hasClass("desc-ghost-cont-show")) { showDesc(); }
    else {  hideDesc(); }
    
    updateDesc(this);
});

// Description functions
$(".desc-ghost-cont").click(function() { hideDesc(); });

function updateDesc(div) {
    var ghost = listGhost[$(".btn-ghost").index(div)];
    // Update ghost info
    $(".desc-title").html(ghost.name);
    $(".desc-strength").html(ghost.strength);
    $(".desc-weak").html(ghost.weak);
    $(".desc-evi").html(listEvi[ghost.eviA].name + ", " + listEvi[ghost.eviB].name + ", " + listEvi[ghost.eviC].name + ".");
}

function showDesc() {
    $(".desc-ghost-cont").addClass("desc-ghost-cont-show");
}
function hideDesc() {
    $(".desc-ghost-cont").removeClass("desc-ghost-cont-show");
    $(".btn-ghost").attr("state", "0");
}

// Sidenotes show
function showSidenote() {
    $(".sidenote").removeAttr("hide");
    $(".mainContent").attr("sidenote", true);
    $(".desc-ghost-cont").attr("sidenote", true);
}
function hideSidenote() {
    $(".sidenote").attr("hide", true);
    $(".mainContent").removeAttr("sidenote");
    $(".desc-ghost-cont").removeAttr("sidenote");
}

/***************** MAIN FUNCTIONS *******************
*****************************************************/
function updateList() {
    // Reset the list
    resetList();

    // Refresh the ghost list : check the state of all Evidence buttons
    $(".btn-evi").each(function (index) {
        switch ($(this).attr("state")) {
            // Case potential : Remove ghost-s (i) that don't have the evidence (index), and increment the nb of selected Evi button (countEvi)
            case '1':
                for (i=0; i<listGhost.length; i++) {
                    if (!listGhost[i].listEvi[index]) {
                        boolList[i] = false;
                    }
                }
                countEvi++;
                break;
            // Case excluded : Remove ghost-s (i) that do have the evidence (index)
            case '2':
                for (i=0; i<listGhost.length; i++) {
                    if (listGhost[i].listEvi[index]) {
                        boolList[i] = false;
                    }
                }
                break;
            // Case default : Do nothing
            case '0':
                break;
        }
    });

    // Show or hide ghosts given their state
    for (i=0; i<boolList.length; i++) {
        if (!boolList[i]) {
            $(".btn-ghost").eq(i).attr("hide", true);
        } else {
            $(".btn-ghost").eq(i).removeAttr("hide");
        }
    }

    // Show potential evidences given the remaining ghosts
    if (countEvi >= 2) {
        $(".btn-ghost").each(function (index) {
            // Put a box-shadow for all button Evi that meets the remaining ghosts
            if (!$(this).attr("hide")) {
                $(".btn-evi").eq(listGhost[index].eviA).attr("pot", true);
                $(".btn-evi").eq(listGhost[index].eviB).attr("pot", true);
                $(".btn-evi").eq(listGhost[index].eviC).attr("pot", true);
            }
            
        });
        // Remove the box-shadow for evi button with state at 1
        $(".btn-evi[state='1']").removeAttr("pot");
    }

    // If one ghost or zero remaining
    var countGhost = $(".btn-ghost:not([hide])").length;
    if (countGhost == 0) {
        $(".btn-pas-ghost").removeAttr("hide");
        $(".mainContent").attr("final", "2");
    }
    if (countGhost == 1) {
        $(".mainContent").attr("final", "1");
    }
}

//switches states values from 0 =to> firstSwitchState && from secondSwitchStateSrc =to> secondSwitchState
function switchState(firstSwitchState, secondSwitchStateSrc, secondSwitchState){
    switch (curBtnEvi.attr("state")) {
        case "0":                   curBtnEvi.attr("state", firstSwitchState); break;
        case secondSwitchStateSrc:  curBtnEvi.attr("state", secondSwitchState); break;
    }
    updateList();
}

/*************** SIDENOTE FUNCTIONS *****************
*****************************************************/
$(".btn-answer").click(function () {
    $(this).siblings().removeAttr("toggle");
    $(this).attr("toggle", true);
});

var todoItem = $(".todo-item");

todoItem.click(function () {
    var count = 10 - $(".todo-item[state='0']").length;
    switch ($(this).attr("state")) {
        case '0':
            if (count <= 3) $(this).attr("state", "1");
            break;
        case '1': $(this).attr("state", "2"); break;
        case '2': $(this).attr("state", "0"); break;
    }
});

// Reset and close buttons for sidenote
$(".sidenote-nav").children().eq(0).click(function () {
    $("#ghostName").val('');
    $(".btn-answer").removeAttr("toggle");
    todoItem.attr("state", "0");
});

$(".sidenote-nav").children().eq(1).click(function() {
    hideSidenote();
});