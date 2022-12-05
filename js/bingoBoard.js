class BingoBoard {

    //The 8 possible bingo boards where each row/col/diag contains 5 unique weapon map keys
    #t1 = [[0, 7, 14, 16, 23], [1, 8, 10, 17, 24], [2, 9, 11, 18, 20], [3, 5, 12, 19, 21], [4, 6, 13, 15, 22]];
    #t2 = [[0, 8, 11, 19, 22], [1, 9, 12, 15, 23], [2, 5, 13, 16, 24], [3, 6, 14, 17, 20], [4, 7, 10, 18, 21]];
    #t3 = [[0, 7, 14, 16, 23], [1, 8, 10, 17, 24], [2, 6, 13, 19, 20], [3, 9, 12, 15, 21], [4, 5, 11, 18, 22]];
    #t4 = [[0, 8, 14, 17, 21], [1, 5, 12, 19, 23], [2, 9, 11, 18, 20], [3, 7, 10, 16, 24], [4, 6, 13, 15, 22]];
    #t5 = [[0, 9, 13, 16, 22], [1, 5, 12, 19, 23], [2, 8, 11, 15, 24], [3, 6, 14, 17, 20], [4, 7, 10, 18, 21]];
    #t6 = [[0, 8, 11, 19, 22], [1, 7, 14, 18, 20], [2, 5, 13, 16, 24], [3, 9, 12, 15, 21], [4, 6, 10, 17, 23]];
    #t7 = [[0, 8, 14, 17, 21], [1, 9, 12, 15, 23], [2, 6, 13, 19, 20], [3, 7, 10, 16, 24], [4, 5, 11, 18, 22]];
    #t8 = [[0, 9, 13, 16, 22], [1, 7, 14, 18, 20], [2, 8, 11, 15, 24], [3, 5, 12, 19, 21], [4, 6, 10, 17, 23]];
    #allTemplates = [this.#t1, this.#t2, this.#t3, this.#t4, this.#t5, this.#t6, this.#t7, this.#t8];

    constructor(weaponMap, seed, isBalancedCard) {
        Math.seedrandom(seed);
        this.seed = seed;
        this.weaponMap = weaponMap;
        this.isBalancedCard = isBalancedCard;
        this.template = this.#allTemplates[Math.floor(Math.random() * this.#allTemplates.length)];
        this.board = this.setupBoard();
    }

    getBoard() {
        return this.board;
    }

    setupBoard() {
        if (this.isBalancedCard) {
            return this.getBalancedBoard();
        } else {
            return this.getUnbalancedBoard();
        }   
    }

    getUnbalancedBoard() {
        let board = new Array(25);
        let tempWeapons = [];
        let tempKeys = Array.from(this.weaponMap.keys());
        for (let key in tempKeys) {
            let value = this.weaponMap.get(tempKeys[key]);
            for (let val in value) {
                tempWeapons.push(value[val]);
            }
        }
        for (let i=0; i<25; i++) {
            let index = Math.floor(Math.random() * tempWeapons.length);
            let chosenWeapon = tempWeapons[index];
            board[i] = chosenWeapon;
            tempWeapons.splice(index, 1);
        }
        return board;
    }

    getBalancedBoard() {
        let board = new Array(25);
        let tempWeaponsMap = new Map(JSON.parse(JSON.stringify([...this.weaponMap]))) //Deep copy the map
        let keys = Array.from(tempWeaponsMap.keys());
        keys.push('Shooter'); //Put this in twice because there are enough shooters, we can afford 10 of them on a board
        let chosenKeys = [];
        for (let i=0; i<5; i++) {
            let index = Math.floor(Math.random() * keys.length);
            let chosenKey = keys[index];
            chosenKeys.push(chosenKey);
            keys.splice(index, 1);
        }
        for (let j=0; j<5; j++) {
            let currentKey = chosenKeys[j];
            let currentWeaponList = tempWeaponsMap.get(currentKey);
            for (let k=0; k<5; k++) {
                let index = Math.floor(Math.random() * currentWeaponList.length);
                let chosenWeapon = currentWeaponList[index];
                let boardIndex = this.template[j][k];
                board[boardIndex] = chosenWeapon;
                currentWeaponList.splice(index, 1);
            }
            tempWeaponsMap.set(currentKey, currentWeaponList);
        }
        return board;
    }


}