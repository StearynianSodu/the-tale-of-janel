import StateMachine from "../stateMachine/StateMachine";
import { sharedInstance as events } from "./EventCentre";

export default class EnemyController{
    private sprite: Phaser.Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private moveTime: number;
    private scene: Phaser.Scene;

    constructor(sprite: Phaser.Physics.Matter.Sprite, scene: Phaser.Scene){
        this.sprite = sprite;
        this.stateMachine = new StateMachine(this, 'enemy');
        this.scene = scene;

        this.stateMachine
        .addState('move-left',{
            onEnter: ()=>{
                this.sprite.setVelocityX(-3);
                this.sprite.flipX = false;
                this.moveTime = 0;
            },
            onUpdate: (dt: number)=>{
                this.sprite.setVelocityX(-3);
                this.moveTime += dt;

                if(this.moveTime > 1200){
                    this.stateMachine.setState('move-right');
                }
            }
        })
        .addState('move-right',{
            onEnter: ()=>{
                this.sprite.setVelocityX(3);
                this.sprite.flipX = true;
                this.moveTime = 0;
            },
            onUpdate: (dt: number)=>{
                this.sprite.setVelocityX(3);
                this.moveTime += dt;

                if(this.moveTime > 1200){
                    this.stateMachine.setState('move-left');
                }
            }
        })
        .addState('dead',{

        });

        this.stateMachine.setState('move-right');

        events.on('enemy-damaged', this.handleDamaged, this);
    }

    private handleDamaged(enemy: Phaser.Physics.Matter.Sprite){
        if(this.sprite !== enemy){
            return;
        }

        events.off('enemy-damaged', this.handleDamaged, this);

        this.scene.tweens.add({
            targets: this.sprite,
            displayHeight: 0,
            y: this.sprite.y + (this.sprite.displayHeight * 0,5),
            duration: 200,
            onComplete:()=>{
                this.sprite.destroy();
            }
        })

        this.stateMachine.setState('dead');
    }

    destroy(){
        events.off('enemy-damaged', this.handleDamaged, this);
    }

    update(dt: number){
        this.stateMachine.update(dt);
    }

    //TODO: create global anims for the enemy
}