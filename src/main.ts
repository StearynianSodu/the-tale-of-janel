import Phaser from "phaser";

import Game from "./scenes/Game";
import UI from "./scenes/UI";
import MainMenu from "./scenes/MainMenu";
import LevelChoice from "./scenes/LevelChoice";
import GameOver from "./scenes/GameOver";
import LevelCompleted from "./scenes/LevelCompleted";


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 768,
    height: 960,
    physics: {
        default: 'matter',
        matter:{
            debug: false,
            gravity: {x: 0, y: 1.5}
        }
    },
    audio:{
        disableWebAudio: true
    },
    backgroundColor: '#2f3e46', 
    scene: [MainMenu,LevelChoice,Game,UI,GameOver,LevelCompleted]
}

export default new Phaser.Game(config);