import Phaser from "phaser";
import { sharedInstance as events } from "./EventCentre";

export default class UI extends Phaser.Scene{
    private starsLabel!: Phaser.GameObjects.Text;
    private starsCount = 0;
    private graphics !: Phaser.GameObjects.Graphics;

    constructor(){
        super({key:'ui'});
    }

    init(){
        this.starsCount = 0;
    }

    create(){
        this.graphics = this.add.graphics();

        this.starsLabel = this.add.text(16,800, `Stars: ${this.starsCount}`,{
            fontSize: '16px'
        });

        this.setButterBar(0);
        this.setCheeseBar(0);

        events.on('star-collected', this.handleStarCollected, this);
        events.on('butter-changed', this.handleButterChanged,this);
        events.on('cheese-changed', this.handleCheeseChanged,this);

        this.events.once(Phaser.Scenes.Events.DESTROY, ()=>{
            events.off('star-collected', this.handleStarCollected, this)
        })
    }

    private setButterBar(value:number){
        const width = 200
        this.graphics.fillStyle(0x808080);
        this.graphics.fillRect(16,832,width,12);

        this.graphics.fillStyle(0xf6e2b9);
        this.graphics.fillRect(16,832,(value/4)*width,12);
    }

    private setCheeseBar(value: number){
        const width = 200
        this.graphics.fillStyle(0x808080);
        this.graphics.fillRect(16,848,width,12);

        this.graphics.fillStyle(0xffa600);
        this.graphics.fillRect(16,848,(value/4)*width,12);
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