import eventsCenter from './EventsCenter.js'

export default class itemNotificationHUD extends Phaser.Scene {
    constructor() {
        super('itemNotificationHUD')
    }
    init(data) {
        this.itemData = data.itemData
        this.labelMissionDescText = data.mission
        console.log(`hello ${this.itemData}`)
    }
    preload() {
        this.load.image('dropButton', 'images/dropButton.png')
        this.load.image('takeButton', 'images/takeButton.png')
        this.load.image('itemNotificationHUD', 'images/itemNotificationHUD.png')
    }
    create() {
        var context = this;

        if (this.itemData !== 'null') {
            console.log('running hud')
            var itemNotificationHUD = this.add.sprite(475, 500, 'itemNotificationHUD').setScale(1)
            const dropButton = this.add.sprite(307, 541, 'dropButton'
            )
                .setScale(0.8)
                .setDepth(9999)
                .setInteractive().on('pointerover', (pointer) => {
                    dropButton.setScale(1)
                })
                .once('pointerout', (pointer) => {
                    dropButton.setScale(0.8)
                }).once('pointerdown', () => {
                    this.scene.stop('itemNotificationHUD')
                    // this.scene.run('tutorialScene')
                    //pass to inventory or mission
                })
            const takeButton = this.add.sprite(624, 541, 'takeButton'
            )
                .setScale(0.8)
                .setDepth(9999)
                .setInteractive().on('pointerover', (pointer) => {
                    takeButton.setScale(1)
                })
                .once('pointerout', (pointer) => {
                    takeButton.setScale(0.8)
                }).once('pointerdown', () => {
                    this.scene.stop('itemNotificationHUD')
                    // this.scene.run('tutorialScene')
                    eventsCenter.emit('update-mission', this.labelMissionDescText)
                    eventsCenter.emit('update-inventory', this.itemData)
                    //pass to inventory or mission
                })


            this.itemData_add_text = this.add.text(339, 428, '1x Mission', { font: "30px Arial", align: "center", color: '#000000' })


        }
        else {
            this.scene.stop();
            this.scene.run('tutorialScene');
        }
    }

}