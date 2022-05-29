import Phaser from "phaser";

import Game from "./scenes/Game";
import UI from "./scenes/UI";
import MainMenu from "./scenes/MainMenu";
import LevelChoice from "./scenes/LevelChoice";


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 768,
    height: 900,
    physics: {
        default: 'matter',
        matter:{
            debug: true,
            gravity: {x: 0, y: 1.5}
        }
    },
    scene: [MainMenu,LevelChoice,Game,UI]
}

export default new Phaser.Game(config);