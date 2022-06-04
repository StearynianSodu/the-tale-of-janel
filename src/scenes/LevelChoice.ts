import Phaser from "phaser";
import WebFontFile from "./WebFontFile";


export default class LevelChoice extends Phaser.Scene{
    private keys;
    private levelCount = 5;
    private currentLevel;
    private levelLabel;
    constructor(){
        super('level-choice');
        this.currentLevel = 1;
    }

    init(){
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP, 
            down: Phaser.Input.Keyboard.KeyCodes.DOWN, 
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            primary: Phaser.Input.Keyboard.KeyCodes.C,
            secondary: Phaser.Input.Keyboard.KeyCodes.X,
            tertiary: Phaser.Input.Keyboard.KeyCodes.Z,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    preload(){
        const fonts = new WebFontFile(this.load, 'Homemade Apple');
        this.load.addFile(fonts);
    }

    create(){
        this.levelLabel = this.add.text(400,400,`${this.currentLevel}`,{
            fontSize:'96px',
            fontFamily: 'Homemade Apple'
        }).setOrigin(0.5,0.5);
        this.add.text(400,470,`Press space to play the level\nUse the arrow keys to choose`,{
            fontSize:'24px',
            align: 'center'
        }).setOrigin(0.5,0.5);
    }

    update(time: number, delta: number): void {
        if(Phaser.Input.Keyboard.JustDown(this.keys.up)){
            this.currentLevel = Phaser.Math.Clamp(this.currentLevel+1,1,this.levelCount);
            this.levelLabel.text = `${this.currentLevel}`
        }
        if(Phaser.Input.Keyboard.JustDown(this.keys.down)){
            this.currentLevel = Phaser.Math.Clamp(this.currentLevel-1,1,this.levelCount);
            this.levelLabel.text = `${this.currentLevel}`
        }
        if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
            this.scene.start('game',{level: this.currentLevel});
        }
    }



}