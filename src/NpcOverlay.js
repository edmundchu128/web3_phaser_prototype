
export default class NpcOverlay extends Phaser.Scene {
    constructor() {
        super('npcOverlay')
    }
    init(data) {
        this.npcID = data.npcID
        this.npcName = data.npcName
        console.log(this.npcName)
    }
    preload() {

    }

    create() {

        this.dialog = {
            "dialog1": [
                {
                    "speaker": "none",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": [""],
                    "dialogLines": "..."
                },
                {
                    "speaker": "npc",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": [""],
                    "dialogLines": "Hey Roundle! Are you heading to Kratoria?"
                },
                {
                    "speaker": "player",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": [""],
                    "dialogLines": "Yes, do you mind showing me the way?"
                },
                {
                    "speaker": "npc",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": [""],
                    "dialogLines": "Kratoria is heavily guarded at the moment after the Final battle. We believe that some of Kracht’s forces are still out there in Roundleverse."
                }, {
                    "speaker": "npc",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": [""],
                    "dialogLines": "How about you help me out to show that I can trust you and I’ll guide you into the city?"
                },
                {
                    "speaker": "player",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": [""],
                    "dialogLines": "Deal, how can I help?"
                },
                {
                    "speaker": "npc",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": [""],
                    "dialogLines": "The Resistance is repairing this school, would you please help me get some wood logs and hay? There’s some trees in front and you may ask the Farmer Roundle for hay."
                }
            ],

            "dialog2": [
                {
                    "speaker": "none",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": ["Hay"],
                    "dialogLines": "..."
                },
                {
                    "speaker": "npc",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": ["Hay"],
                    "dialogLines": "Hey traveller, how may I help you?"
                },
                {
                    "speaker": "player",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": ["Hay"],
                    "dialogLines": "Do you mind sparing me some Hay?"
                },
                {
                    "speaker": "npc",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": ["Hay"],
                    "dialogLines": "What’s the magic word?"
                },
                {
                    "speaker": "player",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": ["Hay"],
                    "dialogLines": "What?"
                },
                {
                    "speaker": "npc",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": ["Hay"],
                    "dialogLines": "Here you go!"
                },
                {
                    "speaker": "none",
                    "missionDescription": "Get 1x Wood and 5x Hay",
                    "items": ["Hay"],
                    "dialogLines": "(The farmer has handed you 5x Hay)"
                }
            ]
        };
        var context = this;
        this.dialog_add_text;
        this.dialogLineNumber = 0;
        this.printTimer = this.time.addEvent({
            callback: () => {
            }
        });

        var buttonNormalScale = 0.7
        var buttonEnlargeScale = 1


        this.overlayNpcSpeak = this.add.sprite(480, 480, `overlay${this.npcID}NpcSpeak`);
        this.overlayNpcSpeak.visible = false;

        this.overlayStart = this.add.sprite(480, 480, `overlay${this.npcID}Start`);
        this.overlayStart.visible = true;

        this.overlayUserSpeak = this.add.sprite(480, 480, `overlay${this.npcID}UserSpeak`);
        this.overlayUserSpeak.visible = false;


        const prevButton = this.add.sprite(40, 900, 'prevButton')
            .setScale(buttonNormalScale)
            .setDepth(9999)
            .setInteractive().on('pointerover', function (pointer) {
                prevButton.setScale(buttonEnlargeScale)
            })
            .on('pointerout', function (pointer) {
                prevButton.setScale(buttonNormalScale)
            })
        prevButton.on('pointerdown', function (pointer) {
            if (context.dialogLineNumber != 0) {
                --context.dialogLineNumber;
                context.dialog_add_text.setText('');

                console.log(context.dialog[`dialog${context.npcID}`][context.dialogLineNumber].dialogLines)
                typewriteText(context.dialog[`dialog${context.npcID}`][context.dialogLineNumber].dialogLines);
                ;
            }
        })

        const nextButton = this.add.sprite(820, 900, 'nextButton')
            .setScale(buttonNormalScale)
            .setDepth(9999)
            .setInteractive().on('pointerover', function (pointer) {
                nextButton.setScale(buttonEnlargeScale)
            })
            .on('pointerout', function (pointer) {
                nextButton.setScale(buttonNormalScale)
            })

        nextButton.on('pointerdown', function (pointer) {
            if (context.dialogLineNumber <= (context.dialog[`dialog${context.npcID}`].length - 2)) {
                if (context.printTimer.getRemaining() == 0) {
                    ++context.dialogLineNumber
                    context.dialog_add_text.setText('');

                    console.log(context.dialog[`dialog${context.npcID}`][context.dialogLineNumber].dialogLines)
                    console.log(context.dialogLineNumber)

                    typewriteText(context.dialog[`dialog${context.npcID}`][context.dialogLineNumber].dialogLines);
                    console.log(context.printTimer.getRemaining())
                }
            }
            else {
                console.log('out of range!')
                context.scene.stop();
                context.scene.run('itemNotificationHUD', {
                    itemData: [
                        { item: 'Mission', count: 1 }
                    ]
                })
            }
        })


        this.userNameTag = this.add.text(18, 725, 'You', { font: "36px Arial", align: "center", color: '#000000' })

        this.npcNameTag = this.add.text(820, 725, this.npcName, { font: "36px Arial", align: "center", color: '#000000' })

        const skipButton = this.add.sprite(this.cameras.main.width / 2, 100, 'skipButton')
            .setScale(buttonNormalScale)
            .setDepth(9999)
            .setInteractive().on('pointerover', function (pointer) {
                skipButton.setScale(buttonEnlargeScale)
            })
            .on('pointerout', function (pointer) {
                skipButton.setScale(buttonNormalScale)
            })
        const scene = this.scene
        skipButton.on('pointerdown', () => {
            scene.stop("npcOverlay")
            scene.run('itemNotificationHUD', {
                itemData: context.dialog[`dialog${context.npcID}`][context.dialogLineNumber].items,
                mission: context.dialog[`dialog${context.npcID}`][context.dialogLineNumber].missionDescription
            })
        })

        function typewriteText(text) {
            const length = text.length
            let i = 0
            context.printTimer = context.time.addEvent({
                callback: () => {
                    context.dialog_add_text.text += text[i]
                    ++i
                },
                repeat: length - 1,
                delay: 10,
            });
        }
        this.dialog_add_text = this.add.text(64, 790, '', { font: "30px Arial", align: "center", color: '#000000' })
            .setWordWrapWidth(800)


    }

    update() {

        var context = this;

        this.userNameTag.setText('You')

        this.npcNameTag.setText(this.npcName)


        if (this.dialog[`dialog${context.npcID}`][context.dialogLineNumber].speaker == 'npc') {

            this.overlayNpcSpeak.visible = true;
            this.overlayStart.visible = false;
            this.overlayUserSpeak.visible = false;

        } else if (this.dialog[`dialog${context.npcID}`][this.dialogLineNumber].speaker == 'player') {

            this.overlayNpcSpeak.visible = false;
            this.overlayStart.visible = false;
            this.overlayUserSpeak.visible = true;

        } else {
            this.overlayStart.visible = true;
        }

    }
}