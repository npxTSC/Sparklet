// This file is like a JSON, but better :)
import { $Unit } from "./staticConf";
import Decimal from "./_decimal";

export default [
    {
        name: "DoubleUp Shepherds",
        desc: "2x Power!",
        cost: new Decimal("5_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEPHERD]: 1,
            }
        }
    },

    {
        name: "DoubleUp Shearers",
        desc: "2x Power!",
        cost: new Decimal("50_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEARER]: 1,
            }
        }
    },

    {
        name: "Sheepdog Training",
        desc: "This guy can help herd the sheep.",
        cost: new Decimal("100_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEPHERD]: 1,
            }
        }
    },

    {
        name: "Better Shears",
        desc: "These ones actually work!",
        cost: new Decimal("150_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEARER]: 1,
            }
        }
    },

    {
        name: "DoubleUp Knitters",
        desc: "2x Power!",
        cost: new Decimal("400_000"),
        upgrade: {
            multiBoost: {
                [$Unit.KNITTER]: 1,
            }
        }
    },

    {
        name: "Reinforced Ingot Shears",
        desc: "These shears contain a LOT of copper.",
        cost: new Decimal("400_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEARER]: 1,
            }
        }
    },

    {
        name: "Faster Knitting",
        desc: "Is this possible?",
        cost: new Decimal("600_000"),
        upgrade: {
            multiBoost: {
                [$Unit.KNITTER]: 2,
            }
        }
    },

    {
        name: "Now Hiring Shepherds",
        desc: "We need some more help...",
        cost: new Decimal("1_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEPHERD]: 2,
            }
        }
    },

    {
        name: "Sheep Bomb Ability",
        desc: "Is this possible?",
        cost: new Decimal("2_000_000"),
        upgrade: {
            /*multiBoost: {
                [$Unit.SHEPHERD]:	2,
            }*/
        }
    },

    {
        name: "Drill Shears",
        desc: "VRRRRRRRRR... Hold D to shear rapidly!",
        cost: new Decimal("5_000_000"),
        upgrade: {
            /*multiBoost: {
                [$Unit.SHEPHERD]:	2,
            }*/
        }
    },

    {
        name: "Sweater Shop",
        desc: "Capitalism at its finest.",
        cost: new Decimal("25_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.KNITTER]: 4,
            }
        }
    },

    {
        name: "Larger Duffel Bags",
        desc: "The wool isn't gonna package itself!",
        cost: new Decimal("50_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEARER]: 1.5,
            }
        }
    },

    {
        name: "Relaxing Music",
        desc: "Calms sheep down while shearing.",
        cost: new Decimal("144_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEARER]: 2.5,
            }
        }
    },

    {
        name: "Customized Bells",
        desc: "Sheep don't like getting lost in the woods.",
        cost: new Decimal("350_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEPHERD]: 2.5,
            }
        }
    },

    {
        name: "Customer Service",
        desc: "And yet, still no refunds allowed.",
        cost: new Decimal("470_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.KNITTER]: 2.5,
            }
        }
    },

    {
        name: "Magical Shears",
        desc: "These shears... ACTUALLY work... hopefully?",
        cost: new Decimal("650_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEARER]: 5,
            }
        }
    },

    {
        name: "Shepherd University",
        desc: "Better training.",
        cost: new Decimal("900_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEPHERD]: 6,
            }
        }
    },

    {
        name: "Specialized Looms",
        desc: "Faster clothing production.",
        cost: new Decimal("1_500_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.KNITTER]: 15,
            }
        }
    },

    {
        name: "Wool Duplication Liquid",
        desc: "Wait, doesn't this mean less money for us?",
        cost: new Decimal("2_000_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.SHEARER]: 10,
            }
        }
    },

    {
        name: "Board Games for Lambs",
        desc: "More entertainment while being taken care of.",
        cost: new Decimal("10_000_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.BABYSITTER]: 1.5,
            }
        }
    },

    {
        name: "Sheep Playgrounds",
        desc: "Sheep swings, sheep slides, and sheep see-saws.",
        cost: new Decimal("25_000_000_000"),
        upgrade: {
            multiBoost: {
                [$Unit.BABYSITTER]: 3,
            }
        }
    },
];
