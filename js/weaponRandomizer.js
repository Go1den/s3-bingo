class WeaponRandomizer {
    constructor(bingoBoard, seed, isUsingAllWeapons, isAllowingRepeats, isIgnoreSeed) {
        this.weaponMap = bingoBoard.weaponMap;
        this.board = bingoBoard.board;
        this.seed = seed;
        this.isIgnoreSeed = isIgnoreSeed;
        this.isUsingAllWeapons = isUsingAllWeapons;
        this.isAllowingRepeats = isAllowingRepeats;
        this.pool = this.setupPool();
        this.index = -1;
    }

    getLength() {
        return this.pool.length;
    }

    getWeaponNumber() {
        return this.index+1;
    }

    nextWeapon() {
        if (this.index >= this.pool.length) {
            return null;
        } else {
            this.index += 1;
            return this.pool[this.index];
        }
    }

    previousWeapon() {
        if (this.index <= 0) {
            return null;
        } else {
            this.index -= 1;
            return this.pool[this.index];
        }
    }

    getAllWeapons() {
        let result = [];
        let mapKeys = Array.from(this.weaponMap.keys());
        for (let key in mapKeys) {
            let value = this.weaponMap.get(mapKeys[key]);
            for (let val in value) {
                result.push(value[val]);
            }
        }
        return result;
    }

    setupPool() {
        this.index = -1;
        if (this.isIgnoreSeed) {
            Math.seedrandom();
        } else {
            Math.seedrandom(this.seed);
        }
        let tempPool;
        if (this.isUsingAllWeapons) {
            tempPool = this.getAllWeapons();
        } else {
            tempPool = this.board.slice();
        }
        let result;
        if (this.isAllowingRepeats) {
            result = new Array(1000);
            for(let i=0; i<1000; i++) {
                let index = Math.floor(Math.random() * tempPool.length);
                result[i] = tempPool[index];
            }
        } else {
            result = new Array(tempPool.length);
            let tempLength = tempPool.length;
            for(let i=0; i<tempLength; i++) {
                let index = Math.floor(Math.random() * tempPool.length);
                result[i] = tempPool[index];
                tempPool = tempPool.filter(function(value) {
                    return value != result[i];
                });
            }
        }
        return result;
    }


}