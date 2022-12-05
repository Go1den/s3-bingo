var bingoBoard = [];
var randomWeaponPool = [];
var isRandomWeaponsPoolPopulated = false;

var bingo = function(bingoList, size, useMagicSquare) {

	function gup( name ) {
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( window.location.href );
		if(results == null)
			 return "";
		return results[1];
	}

	var LANG = gup( 'lang' );
	if (LANG == '') LANG = 'name';
	var SEED = gup( 'seed' );
	var MODE = gup( 'mode' );

	if(SEED == "") return reseedPage();

	var cardtype = "Normal";

	if (typeof size == 'undefined') size = 5;

	Math.seedrandom(SEED); //sets up the RNG
	var MAX_SEED = 999999; //1 million cards
	var results = $("#results");
	results.append ("<p>Splatoon 3 Weapons Bingo <strong>v1</strong>&emsp;Seed: <strong>" +
	SEED + "</strong></p><p>&emsp;Join us on <strong><a href=\"https://discord.gg/CErcb4gVqE\">Discord</a></strong></p></p>");

	var noTypeCount = 0;

	var lineCheckList = [];

	if (size == 5) {
		lineCheckList[1]  = [1,2,3,4,5,10,15,20,6,12,18,24];
		lineCheckList[2]  = [0,2,3,4,6,11,16,21];
		lineCheckList[3]  = [0,1,3,4,7,12,17,22];
		lineCheckList[4]  = [0,1,2,4,8,13,18,23];
		lineCheckList[5]  = [0,1,2,3,8,12,16,20,9,14,19,24];

		lineCheckList[6]  = [0,10,15,20,6,7,8,9];
		lineCheckList[7]  = [0,12,18,24,5,7,8,9,1,11,16,21];
		lineCheckList[8]  = [5,6,8,9,2,12,17,22];
		lineCheckList[9]  = [4,12,16,20,9,7,6,5,3,13,18,23];
		lineCheckList[10]  = [4,14,19,24,8,7,6,5];

		lineCheckList[11] = [0,5,15,20,11,12,13,14];
		lineCheckList[12] = [1,6,16,21,10,12,13,14];
		lineCheckList[13] = [0,6,12,18,24,20,16,8,4,2,7,17,22,10,11,13,14];
		lineCheckList[14] = [3,8,18,23,10,11,12,14];
		lineCheckList[15] = [4,9,19,24,10,11,12,13];

		lineCheckList[16] = [0,5,10,20,16,17,18,19];
		lineCheckList[17] = [15,17,18,19,1,6,11,21,20,12,8,4];
		lineCheckList[18] = [15,16,18,19,2,7,12,22];
		lineCheckList[19] = [15,16,17,19,23,13,8,3,24,12,6,0];
		lineCheckList[20] = [4,9,14,24,15,16,17,18];

		lineCheckList[21] = [0,5,10,15,16,12,8,4,21,22,23,24];
		lineCheckList[22] = [20,22,23,24,1,6,11,16];
		lineCheckList[23] = [2,7,12,17,20,21,23,24];
		lineCheckList[24] = [20,21,22,24,3,8,13,18];
		lineCheckList[25] = [0,6,12,18,20,21,22,23,19,14,9,4];
	}

	$('.popout').click(function() {
	    refreshBoard(false);
		var mode = null;
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

	function mirror(i) {
		if      (i == 0) { i = 4; }
		else if (i == 1) { i = 3; }
		else if (i == 3) { i = 1; }
		else if (i == 4) { i = 0; }
		return i;
	}

	function difficulty(i) {
		// To create the magic square we need 2 random orderings of the numbers 0, 1, 2, 3, 4.
		// The following creates those orderings and calls them Table5 and Table1

		var Num3 = SEED%1000;	// Table5 will use the ones, tens, and hundreds digits.

		var Rem8 = Num3%8;
		var Rem4 = Math.floor(Rem8/2);
		var Rem2 = Rem8%2;
		var Rem5 = Num3%5;
		var Rem3 = Num3%3;	// Note that Rem2, Rem3, Rem4, and Rem5 are mathematically independent.
		var RemT = Math.floor(Num3/120);	// This is between 0 and 8

		// The idea is to begin with an array containing a single number, 0.
		// Each number 1 through 4 is added in a random spot in the array's current size.
		// The result - the numbers 0 to 4 are in the array in a random (and uniform) order.
		var Table5 = [0];
		Table5.splice(Rem2, 0, 1);
		Table5.splice(Rem3, 0, 2);
		Table5.splice(Rem4, 0, 3);
		Table5.splice(Rem5, 0, 4);

		Num3 = Math.floor(SEED/1000);	// Table1 will use the next 3 digits.
		Num3 = Num3%1000;

		Rem8 = Num3%8;
		Rem4 = Math.floor(Rem8/2);
		Rem2 = Rem8%2;
		Rem5 = Num3%5;
		Rem3 = Num3%3;
		RemT = RemT * 8 + Math.floor(Num3/120);	 // This is between 0 and 64.

		var Table1 = [0];
		Table1.splice(Rem2, 0, 1);
		Table1.splice(Rem3, 0, 2);
		Table1.splice(Rem4, 0, 3);
		Table1.splice(Rem5, 0, 4);

		i--;
		RemT = RemT%5;		//  Between 0 and 4, fairly uniformly.
		x = (i+RemT)%5;		//  RemT is horizontal shift to put any diagonal on the main diagonal.
		y = Math.floor(i/5);

		// The Tables are set into a single magic square template
		// Some are the same up to some rotation, reflection, or row permutation.
		// However, all genuinely different magic squares can arise in this fashion.
		var e5 = Table5[(x + 3*y)%5];
		var e1 = Table1[(3*x + y)%5];

		// Table5 controls the 5* part and Table1 controls the 1* part.
		value = 5*e5 + e1;

        value++;
		return value;
	}

	function checkLine (i, typesA) {
		var synergy = 0;
		if (typeof typesA != 'undefined') {
			for (var j=0; j<lineCheckList[i].length; j++) {
				var typesB = bingoBoard[lineCheckList[i][j]+1].types;
				if (typeof typesB != 'undefined') {
					for (var k=0; k < typesA.length; k++) {
						for (var l=0; l < typesB.length; l++) {
							if (typesA[k] == typesB[l]) {
								synergy++; // if match increase
								if (k==0) { synergy++; } // if main type increase
								if (l==0) { synergy++; } // if main type increase
							}
						}
					}
				}
			}
		}
		return synergy;
	}

//	var bingoBoard = []; //the board itself stored as an array first
	for (var i=1;i<=25;i++) {
	    if (useMagicSquare) {
		    bingoBoard[i] = {difficulty: difficulty(i)}; //array with objects that store difficulty in order 1-25
         } else {
            bingoBoard[i] = {difficulty: 1}; //set it to 1 because we are expecting all elements to be in bingoList[1]
         }
		console.log(bingoBoard[i].difficulty);
	}

	//populate the bingo board in the array
	if (useMagicSquare) {
        for (i=1; i<=25; i++) {
            var getDifficulty = bingoBoard[i].difficulty; // difficulty of current square
            var RNG = Math.floor(bingoList[getDifficulty].length * Math.random());
            if (RNG == bingoList[getDifficulty].length) { RNG--; } //fix a miracle
            var j = 0, synergy = 0, currentObj = null, minSynObj = null;

            do {
                currentObj = bingoList[getDifficulty][(j+RNG)%bingoList[getDifficulty].length];
                synergy = checkLine(i, currentObj.types);
                if (minSynObj == null || synergy < minSynObj.synergy) {
                  minSynObj = { synergy: synergy, value: currentObj };
                }
                j++;
            } while ((synergy != 0) && (j<bingoList[getDifficulty].length));

            bingoBoard[i].types = minSynObj.value.types;
            bingoBoard[i].name = minSynObj.value[LANG] || minSynObj.value.name;
            bingoBoard[i].synergy = minSynObj.synergy;
            bingoBoard[i].image = minSynObj.value.image;
        }
	} else { //since everything is in bingoList[1], we just want to generate a unique list of 25 elements to grab
	    var indices = [];
	    for (i=0; i<25; i++) {
	        var foundUnusedElement = false;
	        do {
                var RNG = Math.floor(bingoList[1].length * Math.random());
                if (RNG == bingoList[1].length) { RNG--; }
                if (!indices.includes(RNG)) {
                    indices.push(RNG);
                    foundUnusedElement = true;
                }
            } while (!foundUnusedElement);
	    }
	    for (i=1; i<=25; i++) {
	        currentObj = bingoList[1][indices[i-1]];
	        console.log(currentObj)
//            bingoBoard[i].types = currentObj.value.types;
//            bingoBoard[i].synergy = currentObj.synergy;
            bingoBoard[i].name = currentObj.name;
            bingoBoard[i].image = currentObj.image;
	    }
	}

	//populate the actual table on the page
	for (i=1; i<=25; i++) {
	  $('#slot'+i).append("<image width=70px height=70px src=" + bingoBoard[i].image + ">");
	  $('#slot'+i).append(bingoBoard[i].name);
	}

	return true;
}; // setup

function refreshBoard(showNames) {
    console.log("refreshing board");
    for (i=1; i<=25; i++) {
      document.getElementById("slot" + i).innerHTML = "";

      if (showNames) {
        $('#slot'+i).append("<image width=70px height=70px src=" + bingoBoard[i].image + ">");
        $('#slot'+i).append(bingoBoard[i].name);
      } else {
        $('#slot'+i).append("<image src=" + bingoBoard[i].image + ">");
      }
    }
}

function getAllWeapons() {
    return bingoList[1];
}

function disableCheckboxes() {
    if (document.getElementById("randomIgnore").checked === true) {
        document.getElementById("randomObey").disabled = true;
    } else {
        document.getElementById("randomIgnore").disabled = true;
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
}

function populateRandomWeaponPool() {
    if (!isRandomWeaponsPoolPopulated) {
        if (document.getElementById("randomCardOnly").checked === true) {
            randomWeaponPool = bingoBoard.slice(1);
        } else {
            randomWeaponPool = getAllWeapons();
        }
        isRandomWeaponsPoolPopulated = true;
    }
}

function alterRNG() {
    if (document.getElementById("randomIgnore").checked === true) {
        Math.seedrandom();
    }
}

function getIndex() {
    var result;
    result = Math.floor(randomWeaponPool.length * Math.random());
    if (result == randomWeaponPool.length) {
        result--;
    }
    return result;
}

function filterRandomWeaponPool(currentObj) {
    if (document.getElementById("randomNoDuplicates").checked === true) {
        randomWeaponPool = randomWeaponPool.filter(function(value) {
            return value != currentObj;
        });
    }
}

function randomWeapon() {
    var currentObj, img, name, idx;
    document.getElementById("randomWeapon").innerHTML = "";
    disableCheckboxes();
    populateRandomWeaponPool();
    alterRNG();
    idx = getIndex();
    currentObj = randomWeaponPool[idx];
    filterRandomWeaponPool(currentObj);
    if (currentObj === undefined) {
        $('#randomWeapon').append("<td><image width=70px height=70px src=\"../sheldon/sheldon.png\"></td>");
        $('#randomWeapon').append("<td><strong style=\"color: orange\">No More Weapons</strong><br><strong style=\"color: white\">There are no more weapons to loan!</strong></td>");
    } else {
        img = currentObj.image;
        name = currentObj.name;
        $('#randomWeapon').append("<td><image width=70px height=70px src=" + img + "></td>");
        $('#randomWeapon').append("<td><strong style=\"color: orange\">Supplied Weapon</strong><br><strong style=\"color: white\">You have been loaned the " + name + "!</strong></td>");
    }
    document.getElementById("randomWeapon").style = "background-color: grey";
}

function reseedPage() {
	Math.seedrandom();
	var qSeed = "?seed=" + Math.ceil(999999 * Math.random());
	window.location = qSeed;
	return false;
}

// Backwards Compatability
var srl = { bingo:bingo };