import Phaser from "phaser";
import { sharedInstance as events } from "./EventCentre";

export default class UI extends Phaser.Scene{
    private starsLabel!: Phaser.GameObjects.Text;
    private starsCount = 0;
    private graphics !: Phaser.GameObjects.Graphics;
    private lastHealth = 100;
    private paused = false;
    private veil;
    private pauseTxt;
    private keys;

    constructor(){
        super({key:'ui'});
    }

    init(){
        this.starsCount = 0;
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
        this.graphics = this.add.graphics();

        this.starsLabel = this.add.text(32,870, `Stars: ${this.starsCount}`,{
            fontSize: '16px'
        });

        this.setButterBar(0);
        this.setCheeseBar(0);
        this.setHealthBar(100);

        events.on('star-collected', this.handleStarCollected, this);
        events.on('butter-changed', this.handleButterChanged, this);
        events.on('cheese-changed', this.handleCheeseChanged, this);
        events.on('health-changed', this.handleHealthChanged, this);

        this.events.once(Phaser.Scenes.Events.DESTROY, ()=>{
            events.off('star-collected', this.handleStarCollected, this)
        })

        this.veil = this.add.graphics({x:0,y:0});
        this.veil.fillStyle(0x000000, 0.3);
        this.veil.fillRect(0,0,768,960);
        this.veil.setScrollFactor(0);

        this.pauseTxt = this.add.text(32,32,'Paused',{
            fontSize: '64px'
        });

        this.veil.setDepth(1);
        this.pauseTxt.setDepth(1);

        this.veil.setVisible(this.paused);
        this.pauseTxt.setVisible(this.paused);
    }

    update(time: number, delta: number): void {
        
        if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
            if(this.paused===true){
                this.paused = false;
                this.scene.resume('game');
            }else{
                this.paused = true;
                this.scene.pause('game');
            } 
            this.veil.setVisible(this.paused);
            this.pauseTxt.setVisible(this.paused);
        }
    }

    private setHealthBar(value:number){
        const width = 300;
        const percent = Phaser.Math.Clamp(value/100,0,100);

        this.graphics.fillStyle(0x808080);
        this.graphics.fillRect(32,810, width, 16);

        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(32,810,percent*width,16);
    }

    private setButterBar(value:number){
        const width = 200
        this.graphics.fillStyle(0x808080);
        this.graphics.fillRect(32,832,width,12);

        this.graphics.fillStyle(0xf6e2b9);
        this.graphics.fillRect(32,832,(value/4)*width,12); 
    }

    private setCheeseBar(value: number){
        const width = 200
        this.graphics.fillStyle(0x808080);
        this.graphics.fillRect(32,848,width,12);

        this.graphics.fillStyle(0xffa600);
        this.graphics.fillRect(32,848,(value/4)*width,12);
    }

    private handleHealthChanged(value:number){
        this.tweens.addCounter({
            from: this.lastHealth,
            to: value,
            duration: 200,
            onUpdate: tween =>{
                const val = tween.getValue();
                this.setHealthBar(val);
            }
        })
        this.lastHealth = value;
    }

    private handleStarCollected(){
        ++this.starsCount;
        this.starsLabel.text = `Stars: ${this.starsCount}`;
    }

    private handleButterChanged(value:number){
        this.setButterBar(value);
    }

    private handleCheeseChanged(value:number){
        this.setCheeseBar(value);
    }
}