// Classes for use in other files
"use strict";

const NUMBER_SUFFIXES = ["", "k", "Mil", "Bil", "T", "Q",
    "ℚ", "S", "7̶", "O", "N", "D"];

import upgradeDB from "./upgrades";
import Decimal from "./_decimal";
import { $Unit } from "./staticConf";

export interface UnitData {
    count: number;
    multi: number;
    element: HTMLElement;
}

export interface ResearchDesignData {
    upgrade: Upgrade;
    element: HTMLElement;
    purchased: boolean;
}

export interface UpgradeTable {
    // Amount added to multipliers
    multiBoost?: { [key in $Unit]?: number };
    action?: (() => void);
}

class Upgrade {
    public static list: Upgrade[] = [];

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly cost: Decimal,
        public readonly upgrade: UpgradeTable
    ) {
        Upgrade.list.push(this);
    }

    createHTMLElement(): HTMLElement {
        const fCost = formatDecimal(this.cost);
        const element = document.createElement("p");
        element.classList.add("upgrade", "col-9", "mx-auto")
        element.innerText = `${this.name} (${fCost})`;

        return element;
    }
}

export function formatDecimal(dec: Decimal): string {
    return `${significantCoefficient(dec)}${getDecimalSuffix(dec)}`
}

// Returns string representation of truncated SN coefficient
function significantCoefficient(dec: Decimal,
    decimalPlaces = 3) {
    const str = dec.trunc().toString();


    // Values 0-999
    if (dec.e < 3) return str;

    // Values with dedicated suffixes (like k, mil, etc.)
    else if (dec.e) {
        // Modulo str.length except map 0 to 3
        let preDecimalDigits = (str.length) % 3;
        if (preDecimalDigits === 0) preDecimalDigits = 3;

        return str.slice(0, preDecimalDigits) + "." +
            str.slice(preDecimalDigits,
                preDecimalDigits + decimalPlaces);
    }

    // Values without a dedicated suffix (S. notation format)
    else return str[0] + "." + str.slice(1, 1 + decimalPlaces);
}

function getDecimalSuffix(dec: Decimal): string {
    // The "suffix bracket" of the number (goes up every 3 digits)
    const exp3pair = Math.floor(dec.e / 3);

    // If over 999 Decillion, just spit out the scientific notation
    if (exp3pair <= NUMBER_SUFFIXES.length)
        return NUMBER_SUFFIXES[exp3pair];
    else return `e${dec.e}`;
}

class Unit {
    constructor(
        public name: string,
        public desc: string,
        // argument: current level, returns NEXT LEVEL's cost
        public cost: (lv: number) => number,
    ) { }
}


// Initialize units
export const units = [
    new Unit("Shepherd", "These guys can help you manage your business.",
        (lv) => (Math.ceil((lv * 9 + 3) / 4) + 15)),

    new Unit("Shearer", "Shearers are trained for this task. " +
        "Leave it to the pros!",
        (lv) => (Math.ceil((lv * 6 + 1) / 3) + Math.ceil(lv / 3))),

    new Unit("Knitter", "The kind knitters down the street have " +
        "agreed to knit goods for your business.",
        (lv) => (Math.ceil((lv * 439 + 490) * 0.9) + lv + 219000)),

    new Unit("Babysitter", "You're too busy to watch ALL the sheep. " +
        "Why not hire some caretakers?",
        (lv) => (Math.floor(lv ** 4 * 0.9) + lv + 10000000)),

    new Unit("Sheep Pizza", "Pizza, pasta, put it in a box!",
        (lv) => (lv ** 7 + 500000000)),
];

// Initialize upgrades
upgradeDB.forEach((u, i) => {
    const upgradeObj = new Upgrade(
        i,
        u.name,
        u.desc,
        u.cost,
        u.upgrade,
    );
});

export const upgrades = Upgrade.list;
