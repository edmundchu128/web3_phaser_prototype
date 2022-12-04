export default class LoadingScreen extends Phaser.Scene {
    constructor() {
        super("loadGame");
    }

    preload() {

        // var progressBar = this.add.graphics();
        // var progressBox = this.add.graphics();
        // progressBox.fillStyle(535353, 0.8);
        // progressBox.fillRect(this.cameras.main.width / 2 - 160, this.cameras.main.height / 2, 320, 25);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 25,
            text: 'Loading...',
            style: {
                font: '20px Arial',
                fill: '#000000'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 25,
            text: '0%',
            style: {
                font: '18px Arial',
                fill: '#000000'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px Arial',
                fill: '#000000'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            // progressBar.clear();
            // progressBar.fillStyle(0xffffff, 1);
            // progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        this.load.on('complete', function () {
            // progressBar.destroy();
            // progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        this.load.image('logo', 'images/logo.png');
        for (var i = 0; i < 1; i++) {
            this.load.image('logo' + i, 'images/logo.png');
        }

        this.load.image('tiles1', 'tiles/[Base]BaseChip_pipo.png');
        this.load.tilemapTiledJSON('map_test', 'tiles/map.json')
    }

    create() {


        const scene = this.scene

        var logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'logo').setScale(0.05).setDepth(9999)

        this.tweens.add({
            targets: logo,
            ease: 'Sine.easeInOut',
            duration: 3000,
        });

        this.cameras.main.fadeIn(3000)
        this.cameras.main.once('camerafadeincomplete', function (camera) {
            camera.fadeOut(3000)
        })

        this.input.keyboard.once('keydown-SPACE', () => {
            // fade to black
            this.cameras.main.fadeOut(1000, 0, 0, 0)
        })

        this.cameras.main.once('camerafadeoutcomplete', function () {
            scene.start("startScreen")
        })



    }

}
