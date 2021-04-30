// Variables
var textJson;
var countEvi;
var listEvi = [];
var listGhost = [];
var boolList = [];
var curBtnEvi, timeOut = 0, timeOutCheck = 0;

$(document).ready(function() {
    // Select language screen
    $(".btn-lang").click(function () {
        setLang($(this).html()); // Set language from selected language (./lang/lang??.json)
    });

    // Patch note & version
    $.getJSON( "version.json", function( data ) {
        $(".footer-version").html(data.app + " v" + data.version);
        $(".about-h strong").html(data.app + " v" + data.version);
        var patchList = $(".about ul");
        for (i in data.patchnote) {
            patchList.append("<li>"+ data.patchnote[i] +"</li>");
        }
    });
});

/************ MULTILANGUAGE FUNCTIONS *************
***************************************************/
function setLang(lang) {
    $.getJSON( "./lang/lang"+lang+".json", function( data ) {
        textJson = data;
        selectLangHide();
        initPhasmoo(); // Initialize all functions once json is parsed
    });
}
var divSelectLang = $(".select-lang");
function selectLangShow() { divSelectLang.removeAttr("hide"); }
function selectLangHide() { divSelectLang.attr("hide", true); }

/************ INITIALISATION *************
******************************************/
function initPhasmoo() {
    // INIT Evidence List
    $(".btn-evi").each(function (i) {
        listEvi[i] = new Evidence(textJson.evidence[i].name);
        $(this).html(textJson.evidence[i].short);
    });

    // INIT Ghost List
    $(".btn-ghost").each(function (i) {
        listGhost[i] = new Ghost(
            textJson.ghost[i].name,
            textJson.ghost[i].listEvi[0],
            textJson.ghost[i].listEvi[1],
            textJson.ghost[i].listEvi[2],
            textJson.ghost[i].strength,
            textJson.ghost[i].weak
        );
        $(this).html(textJson.ghost[i].name);
    });
    $(".btn-pas-ghost").html(textJson.noGhost);

    // INIT all texts
    updateTxt();

    // INIT Boolean List to true => List of all potential Ghosts
    resetList();

    // INIT Hammer.js (plugin)
    var sidenoteOpen = new Hammer(document.querySelector(".mainContent"));
    sidenoteOpen.on('swipeleft', function(ev) {
        showSidenote();
    });
    var sidenoteClose = new Hammer(document.querySelector(".sidenote"));
    sidenoteClose.on('swiperight', function(ev) {
        hideSidenote();
    });
    
    // Run the main function
    updateList();
}

function updateTxt() {
    // Ghost description
    $(".desc-ghost-cont .strength").html(textJson.description.strength);
    $(".desc-ghost-cont .weak").html(textJson.description.weak);
    $(".desc-ghost-cont .evid").html(textJson.description.evid);
    // About
    $(".btn-view[to='about']").html(textJson.about.btn);
    $(".about-h span").html(textJson.about.title);
    $(".about p").html(textJson.about.desc);
    // Sidenote
    $(".btn-view[to='sidenote']").html(textJson.sidenote.title);
    $(".sidenote h1").html(textJson.sidenote.title);
    $("#ghostName").attr("placeholder", textJson.sidenote.placeholder);
    $(".btn-answer").each(function (i) { $(this).html(textJson.sidenote.answer[i]); });
    $(".todo-item").each(function (i) {
        $(this).html("● " + textJson.quest[i]);
    });
    $(".chrono-config-item:nth-child(1)").html(textJson.difficulty[0]);
    $(".chrono-config-item:nth-child(2)").html(textJson.difficulty[1]);
    $(".chrono-config-item:nth-child(3)").html(textJson.difficulty[2]);
    // Footer
    $("footer div:first-child").html(textJson.footer);
}

/********** BUTTONS BEHAVIORS ************
******************************************/
// Button Evidence
$('.btn-evi').on('mousedown touchstart', function(e) {
    e.preventDefault();
    curBtnEvi = $(this);
    timeOutCheck = 0;
    
    //calls switchState between 0 and 2 if btn-evi held for 250ms.
    timeOut = setTimeout(function(){
        switchState("2", "2", "0");
        timeOutCheck++;
    }, 250);
}).bind('mouseup touchend', function(e) {
    //prevents default touchend behaviour for mobile browsers (can pop up a menu otherwise)
    e.preventDefault();
    
    //checks if the first switchState was called, and if not, calls a switchState between 0 and 1
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
    resetList(); // Reset the list

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
    resetTimer();
});

$(".sidenote-nav").children().eq(1).click(function() {
    hideSidenote();
});

// Chronometer
var timer;
var minutereset = 5; // Initiate at difficulty 1
var minute = 5;
var second = 0;

$(".chrono-config div").click(function () {
    div = $(this);
    div.siblings().removeAttr("toggle");
    div.attr("toggle", true);

    switch (div.index()) {
        case 0: minutereset = 5; 
        $(".btn-answer").removeClass("sidenote-disable");
        $(".btn-answer").siblings().removeAttr("toggle");
        break;
        case 1: minutereset = 2; 
        $(".btn-answer").removeClass("sidenote-disable");
        $(".btn-answer").siblings().removeAttr("toggle");
        break;
        case 2: minutereset = 0; 
        $(".btn-answer").addClass("sidenote-disable");
        $(".btn-answer").siblings().removeAttr("toggle");
        break;
    }
    resetTimer();
});

$(".chrono").click(function () {
    if (!$(this).attr("toggle")) {
        startTimer();
        $(this).attr("toggle", true);
        $(".chrono-config").attr("toggle", true);
    } else {
        clearInterval(timer);
        resetTimer();
        $(this).removeAttr("toggle");
        $(".chrono-config").removeAttr("toggle");
    }
});

function startTimer() { timer = setInterval(timerImmune, 1000); }
function resetTimer() {
    minute = minutereset;
    second = 0;
    clearInterval(timer);
    $(".chrono-config").removeAttr("toggle");
    $(".chrono").removeAttr("toggle");
    $(".chrono").html(minute + ":00");
}

function timerImmune() {
    if (second == 0) {
        if (minute > 0) {
            second = 59;
            minute--;
        } else clearInterval(timer);
    } else second--;

    var text;
    if (second >= 10) text = minute + ":" + second;
    else text = minute + ":0" +second;
    $(".chrono").html(text);
}

/*************** ABOUT FUNCTIONS *****************
**************************************************/
var divAboutCont = $(".about-cont");
$(".btn-view[to='about']").click(function () { showAbout(); });
$(".about-close").click(function () { hideAbout(); });
function showAbout() { divAboutCont.removeAttr("hide"); }
function hideAbout() { divAboutCont.attr("hide", true); }
