"use strict";

class State {
    /**
     * @param {Position} playerPos;
     * @param {Position} oldBoxPos
     */
    constructor(playerPos, oldBoxPos) {
        /**
         * @private {Position}
         */
        this.playerPos = playerPos;
        /**
         * @private {Position}
         */
        this.oldBoxPos = oldBoxPos;
    }

    get playerPosition() {
        return this.playerPos;
    }

    get bosPosition() {
        return this.oldBoxPos;
    }
}
