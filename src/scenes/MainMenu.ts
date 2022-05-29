import Phaser from "phaser";


export default class MainMenu extends Phaser.Scene{
    private keys;

    constructor(){
        super('menu')
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
        this.add.text(400,400,"Press Space to Start",{
            fontSize:'32px'
        }).setOrigin(0.5,0.5);
    }

    update(time: number, delta: number): void {
        if(this.keys.space.isDown){
            this.scene.start('level-choice');
        }
    }
}