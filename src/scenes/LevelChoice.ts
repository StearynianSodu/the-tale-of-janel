import Phaser from "phaser";


export default class LevelChoice extends Phaser.Scene{
    private keys;
    private levelCount = 3;
    private currentLevel = 1;
    private levelLabel;
    constructor(){
        super('level-choice');
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

    create(){
        this.levelLabel = this.add.text(400,400,`${this.currentLevel}`,{
            fontSize:'32px'
        })
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
            this.scene.start('game');
        }
    }

}