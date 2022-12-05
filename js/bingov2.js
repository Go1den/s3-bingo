var bingoBoard = [];
var randomWeaponPool = [];
var isRandomWeaponsPoolPopulated = false;

var bingo = function(weaponMap) {

	function gup( name ) {
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( window.location.href );
		if(results == null)
			 return "";
		return results[1];
	}

	var SEED = gup( 'seed' );
	if(SEED == "") return reseedPage();
	Math.seedrandom(SEED); //sets up the RNG
	var results = $("#results");
	results.append ("<p>Splatoon 3 Weapons Bingo <strong>v2</strong>&emsp;Seed: <strong>" +
	SEED + "</strong></p><p>&emsp;Join us on <strong><a href=\"https://discord.gg/CErcb4gVqE\">Discord</a></strong></p></p>");

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

	function isDuplicateType (myBoard, i, currentWeapon) {
        if(myBoard[i] !== undefined && myBoard[i] == currentWeapon) {
            return true;
        }
        return false;
	}

	function avoidsDuplicatingTypesInRows (myBoardArray, i, currentWeapon) {
	    var i;
	    var row = Math.floor(i/5);
	    var col = i % 5;
	    var isTLBR = (i % 6) == 0;
	    var isBLTR = (i % 4) == 0 && i > 0;
	    //if row contains same type, return false
	    for (var x=0+(5*row); x < 5+(5*row); x++) {
	        i = x;
	        if(isDuplicateType(myBoardArray, i, currentWeapon)) {
	            return false;
	        }
	    }
        //if column contains same type, return false
	    for (var y=0; y<5; y++) {
	        i = col + 5*y;
	        if(isDuplicateType(myBoardArray, i, currentWeapon)) {
	            return false;
	        }
	    }
	    //if isTLBR and TLBR contains same type, return false
	    if (isTLBR) {
	        var indices = [0, 6, 12, 18, 24];
	        for (index in indices) {
	            i = indices[index];
                if(isDuplicateType(myBoardArray, i, currentWeapon)) {
                    return false;
                }
	        }
	    }
	    //if isBLTR and BLTR contains same type, return false
	    if (isBLTR) {
            var indices = [4, 8, 12, 16, 20];
            for (index in indices) {
                i = indices[index];
                if(isDuplicateType(myBoardArray, i, currentWeapon)) {
                    return false;
                }
            }
	    }
	    return true;
	}

    function getArrayOfWeaponTypesForBoard() {
        var weaponTypes = Array.from(weaponMap.keys());
        var allWeaponsArray = [...weaponMap.values()].flat();
        var currentWeaponType;
        var mapOfWeaponTypesToFrequencyInBoard = new Map();
        var weaponTypesOnThisBoard = new Array(25);
        var retries;
        var foundAcceptableWeaponType;
        var thisBoardsWeapons = [];
        for (i=0; i<25; i++) {
            foundAcceptableWeaponType = false;
            retries = 200;
            do {
                var RNG = Math.floor(allWeaponsArray.length * Math.random());
                if (RNG == allWeaponsArray.length) {
                    RNG--;
                }
                currentWeaponType = allWeaponsArray[RNG].types;
                if (currentWeaponType == undefined) {
                    console.log("Error weapon type undefined");
                }
                if (!mapOfWeaponTypesToFrequencyInBoard.has(currentWeaponType)
                    || mapOfWeaponTypesToFrequencyInBoard.get(currentWeaponType) < weaponMap.get(currentWeaponType).length) {
                    var bingoBoardIndex = i;
                    if (i == 0) {
                        bingoBoardIndex = 12; //The center square is always chosen first to prevent weird biasing issues
                    }
                    if (i == 12) {
                        bingoBoardIndex = 0; //Fill in the top left most square when we would otherwise have filled the center
                    }
                    if (avoidsDuplicatingTypesInRows(weaponTypesOnThisBoard, bingoBoardIndex, currentWeaponType)) {
                        weaponTypesOnThisBoard[bingoBoardIndex] = currentWeaponType;
                        mapOfWeaponTypesToFrequencyInBoard.set(currentWeaponType, mapOfWeaponTypesToFrequencyInBoard.get(currentWeaponType) + 1 || 1);
                        foundAcceptableWeaponType = true;
                    }
                }
                retries -=1;
            } while (!foundAcceptableWeaponType && retries >= 0);
        }
//        for (let [key, value] of mapOfWeaponTypesToFrequencyInBoard) {
//            console.log(key + ": " + value);
//        }
        if (weaponTypesOnThisBoard.length < 25) {
            console.log("error unable to generate card");
            //break;
        }
        return weaponTypesOnThisBoard;
    }

	function generateBingoBoard() {
	    var weaponTypesOnThisBoard;
	    do {
	        weaponTypesOnThisBoard = getArrayOfWeaponTypesForBoard();
	    } while (weaponTypesOnThisBoard.includes(undefined));
        var thisBoardsWeapons = [];
        for (i=0; i<25; i++) {
            foundUnusedElement = false;
            retries = 50;
            do {
                var currentWeaponType = weaponTypesOnThisBoard.at(i);
                var currentWeaponTypeList = weaponMap.get(currentWeaponType);
                var RNG = Math.floor(currentWeaponTypeList.length * Math.random());
                if (RNG == currentWeaponTypeList.length) {
                    RNG--;
                }
                var currentObj = currentWeaponTypeList[RNG];
                if (!thisBoardsWeapons.includes(currentWeaponTypeList[RNG])) {
                    thisBoardsWeapons.push(currentWeaponTypeList[RNG]);
                    var remainingWeapons = currentWeaponTypeList.filter(function(value) {
                        return value != currentWeaponType;
                    });
                    weaponMap.set(currentWeaponType, remainingWeapons)
                    foundUnusedElement = true;
                } else {
                    retries--;
                }
            } while (!foundUnusedElement && retries > 0);
            if (retries <= 0) {
                break;
            }
        }
        return thisBoardsWeapons;
	}

	for (var i=1;i<=25;i++) {
        bingoBoard[i] = {difficulty: 1}; //set it to 1 because we are expecting all elements to be in bingoList[1]
	}

	//populate the bingo board
    var generatedCard = generateBingoBoard();
    for (i=0; i<25; i++) {
        currentObj = generatedCard[i];
//            bingoBoard[i].types = currentObj.value.types;
//            bingoBoard[i].synergy = currentObj.synergy;
        bingoBoard[i+1].name = currentObj.name;
        bingoBoard[i+1].image = currentObj.image;
    }

	//populate the actual table on the page
	for (i=1; i<=25; i++) {
	  $('#slot'+i).append("<image width=70px height=70px src=" + bingoBoard[i].image + ">");
	  $('#slot'+i).append(bingoBoard[i].name);
	}

	return true;
}; // setup

function refreshBoard(showNames) {
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
    var result = [];
    var mapKeys = Array.from(weaponMap.keys());
    for (key in mapKeys) {
        var value = weaponMap.get(mapKeys[key]);
        for (val in value) {
            result.push(value[val]);
        }
    }
    return result;
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