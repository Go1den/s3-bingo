var bingoBoard = [];
var randomWeaponPool = [];
var isRandomWeaponsPoolPopulated = false;
var myBingoBoard;
var myWeaponRandomizer;

var bingo = function(weaponMap) {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let SEED = urlParams.get('seed');
	if(SEED === undefined || SEED === null || SEED === "") {
        return reseedPage(true);
    }
	Math.seedrandom(SEED); //sets up the RNG

    let MODE = urlParams.get('mode');
    if (MODE === undefined || MODE === null || MODE.toLowerCase() !== "chaos") {
        MODE = "normal";
    }

    let isBalancedCard = true;
    if(MODE.toLowerCase() == "chaos") {
        isBalancedCard = false;
    }

    myBingoBoard = new BingoBoard(weaponMap, SEED, isBalancedCard);

	var results = $("#results");
	results.append ("<p>Splatoon 3 Weapons Bingo <strong>v3</strong>&emsp;Mode: <strong>" + MODE[0].toUpperCase() + MODE.substring(1) + "</strong>&emsp;Seed: <strong>" +
	SEED + "</strong></p><p>Download the <strong><a href=\"https://bingo.splat.pw\">OBS Plugin</a></strong>&emsp;Join us on <strong><a href=\"https://discord.gg/CErcb4gVqE\">Discord</a></strong></p></p>");

	$('.popout').click(function() {
	    refreshBoard(false);
		var line = $(this).attr('id');
		var name = $(this).html();
		var items = [];
		var cells = $('#bingo .'+ line);
		for (var i = 0; i < 5; i++) {
		  items.push( encodeURIComponent($(cells[i]).html()) );
		}
        window.open('popout.html#'+ name +'='+ items.join(';;;'),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=100, height=600");
	});

	$("#bingo tr td:not(.popout), #selected td").toggle(
		function () { $(this).addClass("greensquare"); },
		function () { $(this).addClass("redsquare").removeClass("greensquare"); },
		function () { $(this).removeClass("redsquare"); }
	);

	$("#row1").hover(function() { $(".row1").addClass("hover"); }, function() {	$(".row1").removeClass("hover"); });
	$("#row2").hover(function() { $(".row2").addClass("hover"); }, function() {	$(".row2").removeClass("hover"); });
	$("#row3").hover(function() { $(".row3").addClass("hover"); }, function() {	$(".row3").removeClass("hover"); });
	$("#row4").hover(function() { $(".row4").addClass("hover"); }, function() {	$(".row4").removeClass("hover"); });
	$("#row5").hover(function() { $(".row5").addClass("hover"); }, function() {	$(".row5").removeClass("hover"); });

	$("#col1").hover(function() { $(".col1").addClass("hover"); }, function() {	$(".col1").removeClass("hover"); });
	$("#col2").hover(function() { $(".col2").addClass("hover"); }, function() {	$(".col2").removeClass("hover"); });
	$("#col3").hover(function() { $(".col3").addClass("hover"); }, function() {	$(".col3").removeClass("hover"); });
	$("#col4").hover(function() { $(".col4").addClass("hover"); }, function() {	$(".col4").removeClass("hover"); });
	$("#col5").hover(function() { $(".col5").addClass("hover"); }, function() {	$(".col5").removeClass("hover"); });

	$("#tlbr").hover(function() { $(".tlbr").addClass("hover"); }, function() {	$(".tlbr").removeClass("hover"); });
	$("#bltr").hover(function() { $(".bltr").addClass("hover"); }, function() {	$(".bltr").removeClass("hover"); });

	//populate the actual table on the page
	for (i=0; i<25; i++) {
	  $('#slot'+(i+1)).append("<image width=70px height=70px src=" + myBingoBoard.board[i].image + ">");
	  $('#slot'+(i+1)).append(myBingoBoard.board[i].name);
	}

	return true;
}; // setup

function refreshBoard(showNames) {
    for (i=0; i<25; i++) {
      document.getElementById("slot" + (i+1)).innerHTML = "";

      if (showNames) {
        $('#slot'+(i+1)).append("<image width=70px height=70px src=" + myBingoBoard.board[i].image + ">");
        $('#slot'+(i+1)).append(myBingoBoard.board[i].name);
      } else {
        $('#slot'+(i+1)).append("<image src=" + myBingoBoard.board[i].image + ">");
      }
    }
}

function disableSettingsFields() {
    if (document.getElementById("randomIgnore").checked === true) {
        document.getElementById("randomObey").disabled = true;
        document.getElementById("randomSet").disabled = true;
    } else if (document.getElementById("randomObey").checked === true) {
        document.getElementById("randomIgnore").disabled = true;
        document.getElementById("randomSet").disabled = true;
    } else {
        document.getElementById("randomIgnore").disabled = true;
        document.getElementById("randomObey").disabled = true;
    }
    if (document.getElementById("randomCardOnly").checked === true) {
        document.getElementById("randomAll").disabled = true;
    } else {
        document.getElementById("randomCardOnly").disabled = true;
    }
    if (document.getElementById("randomNoDuplicates").checked === true) {
        document.getElementById("randomYesDuplicates").disabled = true;
    } else {
        document.getElementById("randomNoDuplicates").disabled = true;
    }
    document.getElementById("mySeed").disabled = true;
}

function initializeRandomizer() {
    disableSettingsFields();
    let isUsingAllWeapons = true;
    if (document.getElementById("randomCardOnly").checked === true) {
        isUsingAllWeapons = false;
    }
    let isAllowingRepeats = true;
    if (document.getElementById("randomNoDuplicates").checked === true) {
        isAllowingRepeats = false;
    }
    let isIgnoreSeed = false;
    if (document.getElementById("randomIgnore").checked === true) {
        isIgnoreSeed = true;
    }
    let seed = myBingoBoard.seed;
    if (document.getElementById("randomSet").checked === true) {
        seed = document.getElementById("mySeed").value;
    }
    myWeaponRandomizer = new WeaponRandomizer(myBingoBoard, seed, isUsingAllWeapons, isAllowingRepeats, isIgnoreSeed);
}

function updateRandomWeapon(currentObj) {
    if (currentObj === undefined || currentObj === null) {
        $('#randomWeapon').append("<td><image width=70px height=70px src=\"../sheldon/sheldon.png\"></td>");
        $('#randomWeapon').append("<td><strong style=\"color: orange\">No More Weapons</strong><br><strong style=\"color: white\">There are no more weapons to loan!</strong></td>");
    } else {
        let img = currentObj.image;
        let name = currentObj.name;
        $('#randomWeapon').append("<td><image width=70px height=70px src=" + img + "></td>");
        $('#randomWeapon').append("<td><strong style=\"color: orange\">Supplied Weapon #" + myWeaponRandomizer.getWeaponNumber() + " of " + myWeaponRandomizer.getLength() + "</strong><br><strong style=\"color: white\">You have been loaned the " + name + "!</strong></td>");
    }
    document.getElementById("randomWeapon").style = "background-color: grey";
}

function randomWeaponNext() {
    if (myWeaponRandomizer === undefined) {
        initializeRandomizer();
    }
    document.getElementById("randomWeapon").innerHTML = "";
    updateRandomWeapon(myWeaponRandomizer.nextWeapon());
}

function randomWeaponPrevious() {
    if (myWeaponRandomizer !== undefined && myWeaponRandomizer.getWeaponNumber() > 1) {
        document.getElementById("randomWeapon").innerHTML = "";
        updateRandomWeapon(myWeaponRandomizer.previousWeapon());
    }
}

function disableSeed() {
    document.getElementById("mySeed").disabled = true;
}

function enableSeed() {
    document.getElementById("mySeed").disabled = false;
}

function reseedPage(isBalancedCard) {
    Math.seedrandom();
	var urlParams = "?seed=" + Math.ceil(999999 * Math.random());
    if (!isBalancedCard) {
        urlParams = urlParams + "&mode=chaos";
    }
	window.location = urlParams;
	return false;
}

// Backwards Compatability
var srl = { bingo:bingo };