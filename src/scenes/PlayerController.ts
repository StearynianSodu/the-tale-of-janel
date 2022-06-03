import Phaser from "phaser";
import StateMachine from "../stateMachine/StateMachine";
import {sharedInstance as events} from "./EventCentre";
import ObstaclesController from "./ObstaclesController";

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
    private obstacles;
    private scene;
    private starsCollected;
    private enemies;
    private level;
    private damage;

    private lastEnemy?: Phaser.Physics.Matter.Sprite;


    constructor(sprite: Phaser.Physics.Matter.Sprite, keys: InputKeys, obstacles: ObstaclesController, scene: Phaser.Scene, enemies: number, level){
        this.sprite = sprite;
        this.keys = keys;
        this.obstacles = obstacles;
        this.scene = scene;
        this.starsCollected = 0;
        this.enemies = enemies;
        this.level = level;

        events.on('enemy-dead',()=>{
            this.enemies--;
            if(this.starsCollected===5 && this.enemies === 0){
                this.CheckWin();
            }
        },this);

        events.off('enemy-dead',()=>{
            this.enemies--;
            if(this.starsCollected===5 && this.enemies === 0){
                this.CheckWin();
            }
        },this);


        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'player');

        this.stateMachine
        .addState('idle',{
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
                    this.sprite.flipX = false;
                }else if(this.keys.right.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x + 0.5)
                    if(this.sprite.body.velocity.x >= 5){
                        this.sprite.setVelocityX(5);
                    }
                    this.sprite.flipX = true;
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
                    this.sprite.flipX = false;
                }else if(this.keys.right.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x +0.5)
                    if(this.sprite.body.velocity.x >= 5){
                        this.sprite.setVelocityX(5);
                    }
                    this.sprite.flipX = true;
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
                    this.sprite.flipX = false;
                }else if(this.keys.right.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x +0.5)
                    if(this.sprite.body.velocity.x >= 5){
                        this.sprite.setVelocityX(5);
                    }
                    this.sprite.flipX = true;
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
                    this.sprite.flipX = false;
                }else if(this.keys.right.isDown){
                    this.sprite.setVelocityX(this.sprite.body.velocity.x +0.5)
                    if(this.sprite.body.velocity.x >= 5){
                        this.sprite.setVelocityX(5);
                    }
                    this.sprite.flipX = true;
                }else{
                    this.sprite.setVelocityX(0);
                }
            }
        })
        .addState('dash',{
            onEnter: ()=>{
                this.sprite.play('player-dash');
                if(this.sprite.flipX==false){
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
        })
        .addState('spike-hit',{
            onEnter: ()=>{
                this.sprite.setVelocityY(-8);


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

                this.setHealth(this.health-10);
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
                    this.stateMachine.setState('run');
                }else if(this.keys.right.isDown){
                    this.stateMachine.setState('run');
                }else{
                    this.stateMachine.setState('idle');
                }
            }
        })
        .addState('enemy-hit',{
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

                this.setHealth(this.health-10);
                
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
                    this.stateMachine.setState('run');
                }else if(this.keys.right.isDown){
                    this.stateMachine.setState('run');
                }else{
                    this.stateMachine.setState('idle');
                }
            }
        })
        .addState('primary',{

        })
        .addState('special',{

        })
        .addState('enemy-damaged',{
            onEnter:()=>{
                events.emit('enemy-damaged',this.lastEnemy,this.damage);
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
                    this.stateMachine.setState('run');
                }else if(this.keys.right.isDown){
                    this.stateMachine.setState('run');
                }else{
                    this.stateMachine.setState('idle');
                }
            }
        })
        .addState('dead',{
            onEnter: ()=>{
                this.sprite.anims.play('player-death');
                this.sprite.setOnCollide(()=>{});

                this.scene.time.delayedCall(1000,()=>{
                    this.scene.scene.start('gameover',{level: this.level});
                })
            }
        });

        this.stateMachine.setState('idle');

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair)=>{
            if(this.stateMachine.isCurrentState('dead')){
                return;
            }
            const bodyA = data.bodyA as MatterJS.BodyType;
            const gameObjectA = bodyA.gameObject;
            const bodyB = data.bodyB as MatterJS.BodyType;
            const gameObjectB = bodyB.gameObject;

            if(this.obstacles.is('spike',bodyB)){
                this.stateMachine.setState('spike-hit');
                return;
            }

            if(this.obstacles.is('enemy',bodyB)){
                this.lastEnemy = bodyB.gameObject;
                if(this.stateMachine.isCurrentState('dash')||this.stateMachine.isCurrentState('smash')){
                    this.damage = 1;
                    this.stateMachine.setState('enemy-damaged');
                    return;
                }
                this.stateMachine.setState('enemy-hit');
                return;
            }

            if(!gameObjectA){
                return;
            }

            if(gameObjectA instanceof Phaser.Physics.Matter.TileBody){
                if((this.stateMachine.isCurrentState('fall') || this.stateMachine.isCurrentState('smash')) && data.collision.normal.y==1){
					this.stateMachine.setState('land');
				}
				return;
            }


            if(gameObjectB instanceof Phaser.Physics.Matter.Sprite){
                const sprite = gameObjectB as Phaser.Physics.Matter.Sprite;
                const type = sprite.getData('type');
                

                switch(type){
                    case 'star':
                        this.starsCollected++;
                        console.log("Collided with star ");
                        events.emit('star-collected');
                        this.scene.sound.play(`happy${Math.floor(Math.random()*3)+1}`);
                        sprite.destroy();
                        if(this.starsCollected===5 && this.enemies === 0){
                            this.CheckWin();
                        }
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

    private setHealth(value: number){
        this.health = Phaser.Math.Clamp(value,0,100);

        events.emit('health-changed', this.health);
        this.scene.sound.play(`hurt${Math.floor(Math.random()*3)+1}`);

        if(this.health <= 0){
            this.stateMachine.setState('dead');
        }
    }

    private CheckWin(){
        console.log(this.starsCollected+" "+this.enemies);
        if(this.starsCollected===5 && this.enemies===0){
            this.scene.time.delayedCall(1000,()=>{
                this.scene.scene.start('level-completed',{level: `${this.level}`});
            })
        }
    }

    private createAnimations(){
        this.sprite.anims.create({
            key: 'player-idle',
            frameRate: 4,
            frames: [
                {
                    key: 'janel',
                    frame: 'idle1.png'
                },{
                    key: 'janel',
                    frame: 'idle2.png'
                },{
                    key: 'janel',
                    frame: 'idle3.png'
                },{
                    key: 'janel',
                    frame: 'idle4.png'
                },{
                    key: 'janel',
                    frame: 'idle5.png'
                },{
                    key: 'janel',
                    frame: 'idle6.png'
                },{
                    key: 'janel',
                    frame: 'idle7.png'
                },{
                    key: 'janel',
                    frame: 'idle8.png'
                }
            ],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-run',
            frameRate: 4,
            frames: [
                {
                    key: 'janel',
                    frame: 'walk1.png'
                },{
                    key: 'janel',
                    frame: 'walk2.png'
                },{
                    key: 'janel',
                    frame: 'walk3.png'
                },{
                    key: 'janel',
                    frame: 'walk4.png'
                },
            ],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-jump',
            frameRate: 4,
            frames: [
                {
                    key: 'janel',
                    frame: 'jump1.png'
                },{
                    key: 'janel',
                    frame: 'jump2.png'
                },{
                    key: 'janel',
                    frame: 'jump-air.png'
                }
            ],
            repeat: 0
        })

        this.sprite.anims.create({
            key: 'player-fall',
            frameRate: 4,
            frames: [
                {
                    key: 'janel',
                    frame: 'fall1.png'
                },{
                    key: 'janel',
                    frame: 'fall2.png'
                }
            ],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-double-jump',
            frameRate: 4,
            frames: [                
                {
                    key: 'janel',
                    frame: 'jump1.png'
                },{
                    key: 'janel',
                    frame: 'jump2.png'
                },{
                    key: 'janel',
                    frame: 'jump-air.png'
                }
            ],
            repeat: 0
        })

        this.sprite.anims.create({
            key: 'player-dash',
            frames: [
                {
                    key: 'janel',
                    frame: 'dash1.png'
                },{
                    key: 'janel',
                    frame: 'dash2.png'
                }
            ],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-smash',
            frames: [
                {
                    key: 'janel',
                    frame: 'land1.png'
                }
            ],
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-land',
            frameRate: 4,
            frames: [
                {
                    key: 'janel',
                    frame: 'land1.png'
                },{
                    key: 'janel',
                    frame: 'land2.png'
                }
            ],
            repeat: 0
        })

        this.sprite.anims.create({
            key: 'player-special-attack',
            frameRate: 4,
            frames:[
                {
                    key: 'janel',
                    frame: 'beam1.png'
                },{
                    key: 'janel',
                    frame: 'beam2.png'
                },{
                    key: 'janel',
                    frame: 'beam3.png'
                },{
                    key: 'janel',
                    frame: 'beam4.png'
                },{
                    key: 'janel',
                    frame: 'beam5.png'
                },{
                    key: 'janel',
                    frame: 'beam6.png'
                },{
                    key: 'janel',
                    frame: 'beam7.png'
                },{
                    key: 'janel',
                    frame: 'beam8.png'
                },{
                    key: 'janel',
                    frame: 'beam9.png'
                },{
                    key: 'janel',
                    frame: 'beam10.png'
                },{
                    key: 'janel',
                    frame: 'beam11.png'
                }
            ],
            repeat: 0
        })
        this.sprite.anims.create({
            key: 'player-primary-attack',
            frameRate: 4,
            frames:[
                {
                    key: 'janel',
                    frame: 'shoot1.png'
                },{
                    key: 'janel',
                    frame: 'shoot2.png'
                },{
                    key: 'janel',
                    frame: 'shoot3.png'
                },{
                    key: 'janel',
                    frame: 'shoot4.png'
                },{
                    key: 'janel',
                    frame: 'shoot5.png'
                }
            ],
            repeat: 0
        })

        this.sprite.anims.create({
            key: 'player-death',
            frameRate: 4,
            frames:[
                {
                    key:'janel',
                    frame:'death1.png'
                },{
                    key:'janel',
                    frame:'death2.png'
                },{
                    key:'janel',
                    frame:'death3.png'
                },{
                    key:'janel',
                    frame:'death4.png'
                }
            ],
            repeat: 0
        })
    }
    
}