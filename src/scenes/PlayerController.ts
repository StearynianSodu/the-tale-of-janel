import Phaser from "phaser";
import StateMachine from "../stateMachine/StateMachine";
import {sharedInstance as events} from "./EventCentre";

type InputKeys = {
    up: Phaser.Input.Keyboard.Key, 
    down: Phaser.Input.Keyboard.Key, 
    left: Phaser.Input.Keyboard.Key,
    right: Phaser.Input.Keyboard.Key,
    primary: Phaser.Input.Keyboard.Key,
    secondary: Phaser.Input.Keyboard.Key,
    tertiary: Phaser.Input.Keyboard.Key,
    space: Phaser.Input.Keyboard.Key
}

export default class PlayerController{
    private sprite: Phaser.Physics.Matter.Sprite;
    private keys: InputKeys;
    private stateMachine: StateMachine;
    private doubleJumped: boolean = false;
    private health = 100;
    private butter = 0;
    private cheese = 0;


    constructor(sprite: Phaser.Physics.Matter.Sprite, keys: InputKeys){
        this.sprite = sprite;
        this.keys = keys;

        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'player');

        this.stateMachine.addState('idle',{
            onEnter: ()=>{
                this.sprite.play('player-idle');
                this.sprite.setVelocityX(0);
            },
            onUpdate: ()=>{
                if(this.keys.left.isDown || this.keys.right.isDown){
                    this.stateMachine.setState('run');
                }

                if(Phaser.Input.Keyboard.JustDown(this.keys.up)){
                    this.stateMachine.setState('jump');
                }

                if(this.keys.tertiary.isDown){
                    this.stateMachine.setState('dash');
                }

                if(this.sprite.body.velocity.y>0.1){
                    this.stateMachine.setState('fall');
                }

            }
        })
        .addState('run',{
            onEnter: ()=>{
                this.sprite.play('player-run');
            },
            onUpdate: ()=>{
                if(Phaser.Input.Keyboard.JustDown(this.keys.up)){
                    this.stateMachine.setState('jump')
                }

                if(this.keys.tertiary.isDown){
                    this.stateMachine.setState('dash')
                }

                if(this.sprite.body.velocity.y>0.1){
                    this.stateMachine.setState('fall');
                }

                if(this.keys.left.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x -0.5)
                    if(this.sprite.body.velocity.x <= -5){
                        this.sprite.setVelocityX(-5);
                    }
                    this.sprite.flipX = true;
                }else if(this.keys.right.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x +0.5)
                    if(this.sprite.body.velocity.x >= 5){
                        this.sprite.setVelocityX(5);
                    }
                    this.sprite.flipX = false;
                }else{
                    this.stateMachine.setState('idle');
                }
            }
        })
        .addState('jump',{
            onEnter: ()=>{
                this.sprite.play('player-jump');

                this.sprite.setVelocityY(-10);
            },
            onUpdate: ()=>{
                if(this.sprite.body.velocity.y>0.1){
                    this.stateMachine.setState('fall');
                }

                if(Phaser.Input.Keyboard.JustDown(this.keys.up)&&!this.doubleJumped){
                    this.stateMachine.setState('double-jump');
                }

                if(this.keys.down.isDown){
                    this.stateMachine.setState('smash');
                }

                if(this.keys.tertiary.isDown){
                    this.stateMachine.setState('dash');
                }

                if(this.keys.left.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x -0.5)
                    if(this.sprite.body.velocity.x <= -5){
                        this.sprite.setVelocityX(-5);
                    }
                    this.sprite.flipX = true;
                }else if(this.keys.right.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x +0.5)
                    if(this.sprite.body.velocity.x >= 5){
                        this.sprite.setVelocityX(5);
                    }
                    this.sprite.flipX = false;
                }else{
                    this.sprite.setVelocityX(0);
                }
            }
        })
        .addState('fall',{
            onEnter: ()=>{
                this.sprite.play('player-fall');
            },
            onUpdate: ()=>{
                if(Phaser.Input.Keyboard.JustDown(this.keys.up)&&!this.doubleJumped){
                    this.stateMachine.setState('double-jump');
                }

                if(this.keys.down.isDown){
                    this.stateMachine.setState('smash');
                }

                if(this.keys.tertiary.isDown){
                    this.stateMachine.setState('dash');
                }

                
                if(this.keys.left.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x -0.5)
                    if(this.sprite.body.velocity.x <= -5){
                        this.sprite.setVelocityX(-5);
                    }
                    this.sprite.flipX = true;
                }else if(this.keys.right.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x +0.5)
                    if(this.sprite.body.velocity.x >= 5){
                        this.sprite.setVelocityX(5);
                    }
                    this.sprite.flipX = false;
                }else{
                    this.sprite.setVelocityX(0);
                }
            }
        })
        .addState('double-jump',{
            onEnter: ()=>{
                this.sprite.play('player-double-jump');
                this.sprite.setVelocityY(-10);
                this.doubleJumped = true;
            },
            onUpdate: ()=>{
                if(this.sprite.body.velocity.y>0.1){
                    this.stateMachine.setState('fall');
                }

                if(this.keys.down.isDown){
                    this.stateMachine.setState('smash');
                }

                if(this.keys.tertiary.isDown){
                    this.stateMachine.setState('dash');
                }

                if(this.keys.left.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x -0.5)
                    if(this.sprite.body.velocity.x <= -5){
                        this.sprite.setVelocityX(-5);
                    }
                    this.sprite.flipX = true;
                }else if(this.keys.right.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x +0.5)
                    if(this.sprite.body.velocity.x >= 5){
                        this.sprite.setVelocityX(5);
                    }
                    this.sprite.flipX = false;
                }else{
                    this.sprite.setVelocityX(0);
                }
            }
        })
        .addState('dash',{
            onEnter: ()=>{
                this.sprite.play('player-dash');
                if(this.sprite.flipX==true){
                    this.sprite.setVelocity(0,0);
                    this.sprite.applyForce(new Phaser.Math.Vector2(-0.06,0));
                }else{
                    this.sprite.setVelocity(0,0);
                    this.sprite.applyForce(new Phaser.Math.Vector2(0.06,0));
                }

                this.sprite.body.gameObject.setIgnoreGravity(true);
            },
            onUpdate: ()=>{
                if(this.sprite.body.velocity.x <= 2 && this.sprite.body.velocity.x >= -2){
                    this.stateMachine.setState('fall');
                }

                if(this.sprite.body.velocity.x<0){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x + 1.2);
                }else{
                    this.sprite.setVelocityX(this.sprite.body.velocity.x - 1.2);
                }

            },
            onExit: ()=>{
                this.sprite.body.gameObject.setIgnoreGravity(false);
            }
        })
        .addState('smash',{
            onEnter: ()=>{
                this.sprite.play('player-smash');
                this.sprite.applyForce(new Phaser.Math.Vector2(0,0.07));
            },
            onUpdate: ()=>{

            }
        })
        .addState('land',{
            onEnter: ()=>{
                this.sprite.play('player-land');
                this.doubleJumped = false;
            },
            onUpdate: ()=>{
                if(this.keys.left.isDown||this.keys.right.isDown){
                    this.stateMachine.setState('run');
                }else{
                    this.stateMachine.setState('idle');
                }
            }
        });

        this.stateMachine.setState('idle');

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair)=>{
            const bodyA = data.bodyA as MatterJS.BodyType;
            const gameObjectA = bodyA.gameObject;

            if(!gameObjectA){
                return;
            }

            if(gameObjectA instanceof Phaser.Physics.Matter.TileBody){
                if((this.stateMachine.isCurrentState('fall') || this.stateMachine.isCurrentState('smash')) && data.collision.normal.y==1){
					this.stateMachine.setState('land');
				}
				return;
            }

            const bodyB = data.bodyB as MatterJS.BodyType;
            const gameObjectB = bodyB.gameObject;

            if(gameObjectB instanceof Phaser.Physics.Matter.Sprite){
                const sprite = gameObjectB as Phaser.Physics.Matter.Sprite;
                const type = sprite.getData('type');
                

                switch(type){
                    case 'star':
                        console.log("Collided with star");
                        events.emit('star-collected');
                        sprite.destroy();
                        break;
                    case 'spikes':
                        break;
                    case 'butter':
                        this.butter = Phaser.Math.Clamp(this.butter+1,0,4);
                        events.emit('butter-changed', this.butter);
                        sprite.destroy();
                        break;
                    case 'cheese':
                        this.cheese = Phaser.Math.Clamp(this.cheese+1,0,4);
                        events.emit('cheese-changed', this.cheese);
                        sprite.destroy();       
                        break;

                }
            }

        })
    }

    update(dt: number){
        this.stateMachine.update(dt);
    }

    private createAnimations(){
        this.sprite.anims.create({
            key: 'player-idle',
            frameRate: 8,
            frames: [{
                key: 'janel',
                frame: 'jane.png'
            }],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-run',
            frames: [{
                key: 'janel',
                frame: 'jane.png'
            }],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-jump',
            frames: [{
                key: 'janel',
                frame: 'jane.png'
            }],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-fall',
            frames: [{
                key: 'janel',
                frame: 'jane.png'
            }],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-double-jump',
            frames: [{
                key: 'janel',
                frame: 'jane.png'
            }],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-dash',
            frames: [{
                key: 'janel',
                frame: 'jane.png'
            }],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-smash',
            frames: [{
                key: 'janel',
                frame: 'jane.png'
            }],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-land',
            frames: [{
                key: 'janel',
                frame: 'jane.png'
            }],
            repeat: -1
        })
    }
    
}