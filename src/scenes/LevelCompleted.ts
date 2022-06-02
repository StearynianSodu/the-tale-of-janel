import Phaser from "phaser";

export default class GameOver extends Phaser.Scene{
    private keys;
    private currentLevel;

    constructor(){
        super('level-completed');
    }

    init(d: {level: number}){
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

        
        const data = Object.assign({level:1}, d);
        this.currentLevel = data.level;
    }

    create(){
        const{width,height} = this.scale;

        this.add.text(width *0.5, height * 0.3, 'Level Completed', {
            fontSize: '64px'
        }).setOrigin(0.5);
    }

    
    update(time: number, delta: number): void {
        
        if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
            this.scene.start('game',this.currentLevel);
        }
        if(Phaser.Input.Keyboard.JustDown(this.keys.primary)){
            this.scene.start('level-choice');
        }
    }

}