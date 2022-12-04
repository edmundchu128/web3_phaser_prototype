export default class StartScreen extends Phaser.Scene {
    constructor() {
        super("startScreen");
    }

    preload() {
        // this.load.image('tiles1', 'tiles/[Base]BaseChip_pipo.png');
        // this.load.tilemapTiledJSON('map_test', 'tiles/map.json');
        this.load.image('startScreenBG', 'images/rndl_bg.jpg')
        this.load.image('startButton', 'images/Start.png')
        this.load.image('skipButton', 'images/Skip.png')
        this.load.image('settingsButton', 'images/Settings.png')
        this.load.image('icnCharacter', 'images/credits.png')
        this.load.image('icnPouch', 'images/pouch.png')
        this.load.image('icnSettings', 'images/config.png')
        this.load.image('icnHowTo', 'images/howto.png')
        this.load.image('icnLogOut', 'images/exit.png')

    }

    create() {
        const scene = this.scene
        this.cameras.main.fadeIn(3000)
        const backgroundimg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'startScreenBG').setOrigin(.5, .5);
        const startButton = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'startButton'
        )
            .setScale(1)
            .setDepth(9999)
            .setInteractive().on('pointerover', function (pointer) {
                startButton.setScale(1.3)
            })
            .on('pointerout', function (pointer) {
                startButton.setScale(1)
            })

        const settingsButton = this.add.sprite(this.cameras.main.width / 2 + 25, this.cameras.main.height / 2 + 120, 'settingsButton'
        )
            .setScale(1)
            .setDepth(9999)
            .setInteractive()
            .on('pointerover', function (pointer) {
                settingsButton.setScale(1.3)
            })
            .on('pointerout', function (pointer) {
                settingsButton.setScale(1)
            })

        const APP_ID = "FenTSXcze1oGL2cRKMOz9woy4uUGCuEtUzR4VhLV";
        const SERVER_URL = "https://ye49k0nz6dg9.usemoralis.com:2053/server";

        Moralis.initialize(APP_ID); // Application id from moralis.io
        Moralis.serverURL = SERVER_URL; //Server url from moralis.io
        async function login(scene) {
            console.log('login')
            try {
                await Moralis.Web3.authenticate();
                scene.scene.restart();
            } catch (error) {
                console.log(error);
            }
        }

        async function logout(scene) {
            try {
                await Moralis.User.logOut();
                scene.scene.restart();
            } catch (error) {
                console.log(error);
            }
        }

        const currentUser = Moralis.User.current();
        if (currentUser) {
            // function to start the game, open scene
            startButton.on('pointerdown', () => { scene.start("tutorialScene") })
            startButton.on('pointerdown', () => { console.log('false') })

        } else {
            startButton.on('pointerdown', () => { login(this) })
            startButton.on('pointerdown', () => { console.log('login') })
        }

    }

}