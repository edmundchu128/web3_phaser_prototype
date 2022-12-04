import eventsCenter from './EventsCenter.js'

export default class HUDOverlay extends Phaser.Scene {
    constructor() {
        super('HUDOverlay')
    }

    preload() {
        this.load.image('pouchPopUp', 'images/pouchPopUp.png')
    }
    create() {
        this.inventory = []
        this.playerItems;
        //prod build requires class for each

        this.pouchPopUp = this.add.sprite(250, 350, `pouchPopUp`)
            .setVisible(false)

        this.icnCharacter = this.add.sprite(16, 28, `icnCharacter`)
            .setScale(0.3)
            .setDepth(9999)
            .setInteractive()

        this.icnPouch = this.add.sprite(16, 92, `icnPouch`)
            .setScale(0.5)
            .setDepth(9999)
            .setInteractive()
            .once('pointerdown', () => {
                this.pouchPopUp.visible = !this.pouchPopUp.visible
            })

        this.icnSettings = this.add.sprite(16, 156, `icnSettings`)
            .setScale(0.3)
            .setDepth(9999)
            .setInteractive()
        this.icnHowTo = this.add.sprite(16, 220, `icnHowTo`)
            .setScale(0.3)
            .setDepth(9999)
            .setInteractive()
        this.icnLogOut = this.add.sprite(16, 284, `icnLogOut`)
            .setScale(0.3)
            .setDepth(9999)
            .setInteractive()

        this.labelMissionTitle = this.add.text(724, 188, `Mission: `
            , { font: "24 px Arial", align: "center", color: '#ffffff' })

        this.labelMissionDesc = this.add.text(724, 228, 'Talk to Asira'
            , { font: "20px Arial", align: "center", color: '#ffffff' }).setWordWrapWidth('250')


        eventsCenter.on('update-mission', this.updateMission, this)
        eventsCenter.on('update-inventory', this.refreshInventory, this)
    }

    updateMission(labelMissionDescText) {
        console.log(labelMissionDescText)
        this.labelMissionDesc.text = labelMissionDescText
    }

    updateInventory(itemData) {
        this.inventory.push(itemData)
    }

    refreshInventory(itemUpdate) {
        if (itemUpdate[0] != "") {
            this.updateInventory(itemUpdate)
            console.log(this.inventory)
        }
        this.playerItems = this.add.group()

    }


    update() {

    }
}