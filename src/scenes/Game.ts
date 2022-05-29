import Phaser from "phaser";
import PlayerController from "./PlayerController";


export default class Game extends Phaser.Scene{
    private player?: Phaser.Physics.Matter.Sprite;
    private playerController?: PlayerController;
    private keys;
    private map;

    constructor(){
        super('game');
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
        console.log(this.keys);
    }

    preload(){
        this.load.image('tiles', 'assets/ForestTilesetNew.png');
        this.load.tilemapTiledJSON('tilemap', 'levels/level02.json');
        this.load.atlas('janel', 'assets/janel-tmp.png','assets/janel-tmp.json');
        this.load.image('star', 'assets/Star.png');
        this.load.image('bg', 'assets/Background.png');
        this.load.image('cheese','assets/cheese.png');
        this.load.image('butter','assets/butter.png');
    }

    create(){
        this.scene.launch('ui');

        this.add.image(0,0,'bg').setOrigin(0,0);

        this.createMap();

        this.createCamera();

        this.createObjects();

        console.log(this.keys);

        this.playerController = new PlayerController(this.player, this.keys);
    }

    update(t: number, dt: number){
        if(!this.playerController){
            return;
        }

        this.playerController.update(dt); 
    }

    private createMap(){
        this.map = this.make.tilemap({key: 'tilemap'});
        const tileset = this.map.addTilesetImage('ForestTilesetNew', 'tiles');

        const ground = this.map.createLayer('ground', tileset);     

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
            const {x,y,name}  = objData;

            switch(name){
                case 'playerSpawn':
                    this.createPlayer(x,y);
                    break;
                case 'star':
                    this.createStar(x,y);
                    this.createCheese(x,y);
                    this.createButter(x,y);
                    break;
            } 


        })
    }
}