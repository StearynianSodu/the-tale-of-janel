import Phaser from "phaser";
import EnemyController from "./EnemyController";
import ObstaclesController from "./ObstaclesController";
import PlayerController from "./PlayerController";

export default class Game extends Phaser.Scene{
    private player?: Phaser.Physics.Matter.Sprite;
    private playerController?: PlayerController;
    private keys;
    private map;
    private obstacles!: ObstaclesController;
    private paused = false;
    private veil;
    private pauseTxt;
    private currentLevel;
    private enemies: EnemyController[] = [];

    constructor(){
        super('game');
    }

    init(d: {level: number}){
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
            this.destroy();
        })

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
        console.log(this.keys);

        this.obstacles = new ObstaclesController();
        this.enemies = [];

        const data = Object.assign({level:1}, d);
        this.currentLevel = data.level;
    }

    preload(){
        this.load.image('tiles', 'assets/ForestTilesetNew.png');
        this.load.tilemapTiledJSON('tilemap', `levels/level${this.currentLevel}.json`);
        this.load.atlas('janel', 'assets/janel.png','assets/janel.json');
        this.load.atlas('enemy','assets/enemyTmp.png','assets/enemyTmp.json');

        this.load.image('star', 'assets/Star.png');
        //this.load.image('bg', 'assets/Background.png');
        this.load.image('cheese','assets/Cheese.png');
        this.load.image('butter','assets/Butter.png');

        this.load.audio('hurt1','assets/Hurt1.mp3');
        this.load.audio('hurt2','assets/Hurt2.mp3');
        this.load.audio('hurt3','assets/Hurt3.mp3');

        this.load.audio('happy1','assets/Happy1.mp3');
        this.load.audio('happy2','assets/Happy2.mp3');
        this.load.audio('happy3','assets/Happy3.mp3');
    }

    create(){
        this.scene.launch('ui');

        //this.add.image(0,0,'bg').setOrigin(0,0);

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


        this.createMap();

        this.createCamera();

        this.createObjects();

        console.log(this.keys);

        this.playerController = new PlayerController(this.player, this.keys, this.obstacles, this);

    }

    destroy(){
        this.scene.stop('ui');
        this.enemies.forEach(enemy => enemy.destroy()); 
    }

    update(t: number, dt: number){
        this.playerController?.update(dt); 
        
        this.enemies.forEach(enemy => {
            enemy.update(dt);
        });
    }

    private createMap(){
        this.map = this.make.tilemap({key: 'tilemap'});
        const tileset = this.map.addTilesetImage('ForestTilesetNew', 'tiles');

        const ground = this.map.createLayer('ground', tileset); 
        
        this.map.createLayer('obstacles', tileset);

        ground.setCollisionByProperty({collides: true});
        this.matter.world.convertTilemapLayer(ground);

    }

    private createCamera(){
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 0;
    }

    private createPlayer(x: number, y: number){
        this.player = this.matter.add.sprite(x,y,'player');
        this.player.setFixedRotation();
        this.player.setFriction(0);
        this.player.setBounce(0);

    }

    private createStar(x:number, y:number){
        const star = this.matter.add.sprite(x,y,'star',undefined, {
            isStatic: true,
            isSensor: true
        }).setData({type:'star'});

    }

    private createCheese(x:number,y:number){
        const cheese = this.matter.add.sprite(x,y,'cheese',undefined,{
            isStatic:false,
        }).setData({type: 'cheese'});
    }

    private createButter(x:number,y:number){
        const cheese = this.matter.add.sprite(x,y,'butter',undefined,{
            isStatic:false
        }).setData({type: 'butter'});
    }

    private createObjects(){
        const objectsLayer = this.map.getObjectLayer('objects');
        objectsLayer.objects.forEach(objData =>{
            const {x,y,name,width = 0,height = 0}  = objData;

            switch(name){
                case 'playerSpawn':
                    this.createPlayer(x,y);
                    break;
                case 'star':
                    this.createStar(x,y);
                    this.createCheese(x,y);
                    this.createButter(x,y);
                    break;
                case 'spike':
                    const spike = this.matter.add.rectangle(x+width*0.5, y+height*0.5, width, height, {
                        isStatic: true,
                        isSensor: true
                    });

                    this.obstacles.add('spike',spike);
                    break;
                case 'enemySpawn':
                    const enemy = this.matter.add.sprite(x,y,'enemy').setFixedRotation();
                    enemy.setFriction(0);
                    this.enemies.push(new EnemyController(enemy,this));
                    this.obstacles.add('enemy',enemy.body as MatterJS.BodyType);
                    break;
            } 


        })
    }
}