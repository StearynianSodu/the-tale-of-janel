import StateMachine from "../stateMachine/StateMachine";
import { sharedInstance as events } from "./EventCentre";

export default class EnemyController{
    private sprite: Phaser.Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private moveTime: number;
    private scene: Phaser.Scene;
    private obstacles;
    private health;
    private nextState;

    constructor(sprite: Phaser.Physics.Matter.Sprite, scene: Phaser.Scene){
        this.sprite = sprite;
        this.stateMachine = new StateMachine(this, 'enemy');
        this.scene = scene;
        this.obstacles = this.obstacles;
        this.health = 3;

        this.stateMachine
        .addState('move-left',{
            onEnter: ()=>{
                this.sprite.play('enemy-walk');
                this.sprite.setVelocityX(-2);
                this.sprite.flipX = false;
                this.moveTime = 0;
            },
            onUpdate: (dt: number)=>{
                this.sprite.setVelocityX(-2);
                this.moveTime += dt;

                if(this.moveTime > 2000){
                    this.nextState = 'move-right';
                    this.stateMachine.setState('attack');
                }
            }
        })
        .addState('move-right',{
            onEnter: ()=>{
                this.sprite.play('enemy-walk');
                this.sprite.setVelocityX(2);
                this.sprite.flipX = true;
                this.moveTime = 0;
            },
            onUpdate: (dt: number)=>{
                this.sprite.setVelocityX(2);
                this.moveTime += dt;

                if(this.moveTime > 2000){
                    this.nextState = 'move-left';
                    this.stateMachine.setState('attack');
                }
            }
        })
        .addState('dead',{
            onEnter: ()=>{
                events.emit('enemy-dead');
                this.scene.tweens.add({
                    targets: this.sprite,
                    displayHeight: 0,
                    y: this.sprite.y + (this.sprite.displayHeight * 0,5),
                    duration: 200,
                    onComplete:()=>{
                        this.sprite.stop();
                        this.sprite.destroy();
                    }
                })
            }
        })
        .addState('damaged',{
            onEnter: ()=>{
                const startColor = Phaser.Display.Color.ValueToColor(0xffffff);
                const endColor = Phaser.Display.Color.ValueToColor(0xff0000);
                this.scene.tweens.addCounter({
                    from: 0,
                    to: 100,
                    duration: 100,
                    repeat: 2,
                    yoyo: true,
                    ease: Phaser.Math.Easing.Sine.InOut,
                    onUpdate: tween =>{
                        const value = tween.getValue()
                        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                            startColor,
                            endColor,
                            100,
                            value
                        );

                        const color = Phaser.Display.Color.GetColor(
                            colorObject.r,
                            colorObject.g,
                            colorObject.b
                        )

                        this.sprite.setTint(color);
                    }
                })
            },
            onUpdate: ()=>{
                this.stateMachine.setState('move-left');
            }
        })
        .addState('attack',{
            onEnter: ()=>{
                this.sprite.play('enemy-attack');
                this.sprite.setVelocityX(0);
            },
            onUpdate: ()=>{
                this.scene.time.delayedCall(1000,()=>{
                    this.stateMachine.setState(this.nextState);
                })
            }
        });

        this.stateMachine.setState('move-right');

        events.on('enemy-damaged', this.handleDamaged, this);
        //events.off('enemy-damaged', this.handleDamaged, this);
    }

    private handleDamaged(enemy: Phaser.Physics.Matter.Sprite){
        if(this.sprite !== enemy){
            return;
        }

        if(this.stateMachine.isCurrentState('attack')){
            return;
        }
        this.health = Phaser.Math.Clamp(this.health - 1, 0, 3);
        if(this.health<=0)
            this.stateMachine.setState('dead');
        else
            this.stateMachine.setState('damaged');
    }

    destroy(){
        events.off('enemy-damaged', this.handleDamaged, this);
    }

    update(dt: number){
        if(!this.stateMachine.isCurrentState('dead'))
            this.stateMachine.update(dt);
    }
}