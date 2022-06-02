import StateMachine from "../stateMachine/StateMachine";

export default class EnemyController{
    private sprite: Phaser.Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private moveTime: number;

    constructor(sprite: Phaser.Physics.Matter.Sprite){
        this.sprite = sprite;
        this.stateMachine = new StateMachine(this, 'enemy');

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
    }

    update(dt: number){
        this.stateMachine.update(dt);
    }

    //TODO: create global anims for the enemy
}