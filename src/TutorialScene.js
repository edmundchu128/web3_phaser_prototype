import eventsCenter from './EventsCenter.js'

export default class TutorialScene extends Phaser.Scene {
    EVENT_COOLOFF = 500; // 1 second cool of between events
    event_cooloffs = [];

    sprites = {}
    otherSprites = {}
    sprite_add_text = {}
    destinations = {}
    spriteSpeed = 5;
    stepSize = 20;
    cursors


    constructor() {
        super("tutorialScene");
    }

    preload() {
        this.load.image('tiles1', 'tiles/[Base]BaseChip_pipo.png');
        this.load.tilemapTiledJSON('map_tutorial', 'tiles/tutorial32x32.json')
        this.load.image('skin1', 'images/blob/1.png');
        this.load.image('skin2', 'images/blob/2.png');
        this.load.image('skin3', 'images/blob/3.png');
        this.load.image('skin4', 'images/blob/4.png');
        this.load.image('skin5', 'images/blob/5.png');
        this.load.image('prevButton', 'images/prevButton.png');
        this.load.image('nextButton', 'images/nextButton.png');
        this.load.image('interactionIndicator', 'images/icons/kenneyIcons/hand_token_open.png');
        this.load.image('overlay1NpcSpeak', `images/overlay1NpcSpeak.png`)
        this.load.image('overlay1Start', `images/overlay1Start.png`)
        this.load.image('overlay1UserSpeak', `images/overlay1UserSpeak.png`)
        this.load.image('overlay2NpcSpeak', `images/overlay2NpcSpeak.png`)
        this.load.image('overlay2Start', `images/overlay2Start.png`)
        this.load.image('overlay2UserSpeak', `images/overlay2UserSpeak.png`)
    }


    async create() {
        this.scene.run('HUDOverlay')
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBounds(0, 0, 960, 960);
        this.EVENT_COOLOFF = 500; // 1 second cool of between events
        this.event_cooloffs = [];
        this.interactionHitbox;
        this.sprites = {}
        this.npcSprites = {};
        this.npcSprites_add_text = {};
        this.otherSprites = {}
        this.sprite_add_text = {}
        this.destinations = {}
        this.spriteSpeed = 5;
        this.stepSize = 20;
        this.interactionIndicator;
        this.userId;
        this.TalkToAsira = true;

        var context = this;
        function findDataForUser(user) {
            var data = Moralis.Object.extend("playerData");
            const query = new Moralis.Query(data);
            query.equalTo("user", user);
            return query.find();
        }
        function saveState() {

            var stateToSave = {};
            stateToSave.playerData = [];

            var data = Moralis.Object.extend("playerData");
            const query = new Moralis.Query(data);
            query.find()
                .then(async (response) => {
                    response.forEach(function (r) {
                        // console.log(r.get("user").id)
                        // console.log(r.get("locX"))
                        // console.log(r.get("locY"))
                        // console.log(r.get("skin"))

                        stateToSave.playerData.push({
                            user_id: r.get("user").id,
                            locX: r.get("locX"),
                            locY: r.get("locY"),
                            skin: r.get("skin")
                        })
                    });


                    const file = new Moralis.File("state.json", { base64: btoa(JSON.stringify(stateToSave)) });
                    await file.saveIPFS()
                    // console.log("STATE SAVED")
                    // console.log(file.ipfs())
                })

            setTimeout(saveState, 10000)
        }

        function ping() {
            findDataForUser(Moralis.User.current())
                .then((result) => {
                    if (result.length == 0) {
                        console.log("ping No user data object found...")
                    }
                    else {
                        var playerData = result[0];
                        playerData.set("latestPing", new Date().getTime());
                        playerData.save();
                    }
                }, (error) => {
                    console.log(error);
                })

            setTimeout(ping, 2000);
        }

        function spawnUser(user, layer) {
            findDataForUser(user)
                .then((result) => {
                    if (result.length == 0) {
                        console.log("spawn No user data object found...")
                    }
                    else {
                        var playerData = result[0];
                        const skinName = "skin" + playerData.get("skin");

                        const x = playerData.get("locX");
                        const y = playerData.get("locY");

                        const ethAddress = user.attributes.ethAddress

                        // uncomment if wants to track player position: 
                        // context.sprites[user.id] = context.physics.add.sprite(x, y, skinName).setScale(1, 1)

                        context.sprites[user.id] = context.physics.add.sprite(450, 900, skinName).setScale(1, 1)


                        context.sprites[user.id].body.setSize(context.sprites[user.id].width * 0.5, context.sprites[user.id].height * 0.5, true);
                        context.sprite_add_text[user.id] = context.add.text(context.sprites[user.id].x - context.sprites[user.id].width * 3, context.sprites[user.id].y - context.sprites[user.id].height * 0.5, ethAddress, { font: "10px Arial", align: "center" })
                        layer.forEach(eachlayer => context.physics.add.collider(context.sprites[user.id], eachlayer))

                        context.interactionHitbox = context.add.rectangle(context.sprites[user.id].x + 10, context.sprites[user.id].y, context.sprites[user.id].height / 5, context.sprites[user.id].width / 5, 0xffffff, 0)
                        context.interactionIndicator = context.add.image(context.sprites[user.id].x,
                            context.sprites[user.id].y,
                            "interactionIndicator")
                            .setScale(0.25)
                            .setPosition(context.sprites[user.id].x, context.sprites[user.id].y)
                        context.interactionIndicator.visible = false;
                        context.physics.add.existing(context.interactionHitbox)
                        context.cameras.main.startFollow(context.sprites[user.id])
                        context.cameras.main.setZoom(2);

                        spawnNPC(1, user.Id);

                        if (user.id == Moralis.User.current().id) {
                            playerData.set("latestSpawn", new Date().getTime());
                            playerData.save();
                        }

                    }
                }, (error) => {
                    console.log(error);
                })

            // start recurring events
            ping()

            saveState()
        }

        function spawnNPC(mapID, userId) {
            function findNPCInMap(mapID) {
                var data = Moralis.Object.extend("mapNPCDetails");
                const query = new Moralis.Query(data);
                query.equalTo("mapID", mapID);
                return query.find();
            }

            findNPCInMap(mapID, userId)
                .then((mapresults) => {
                    mapresults.forEach(npcData => {
                        var skinName = "skin" + npcData.attributes.npcSkinID;
                        var x = npcData.attributes.locX;
                        var y = npcData.attributes.locY;
                        var npcID = npcData.attributes.npcID;

                        var npcName = npcData.attributes.npcName;

                        context.npcSprites[npcID] = context.physics.add.sprite(x, y, skinName).setScale(1, 1)
                        context.npcSprites[npcID].body.setSize(context.npcSprites[npcID].width * 0.5, context.npcSprites[npcID].height * 0.5, true);
                        context.npcSprites_add_text[npcID] = context.add.text(context.npcSprites[npcID].x - 4,
                            context.npcSprites[npcID].y - context.npcSprites[npcID].height * 0.5,
                            npcName,
                            { font: "10px Arial", align: "center" })

                        context.physics.add.collider(context.sprites[context.userId], context.npcSprites[npcID])
                        context.npcSprites[npcID].body.immovable = true;
                        context.npcSprites[npcID].body.moves = false;
                    })


                })

        }

        context = this;

        const user = Moralis.User.current()
        this.userId = user.id;
        // place background
        const map = this.make.tilemap({ key: 'map_tutorial' })
        const tilesetBaseChip = map.addTilesetImage('[Base]BaseChip_pipo', 'tiles1')
        const basemapLayer = map.createLayer('base', tilesetBaseChip, 0, 0).setCollisionByProperty({ collides: true })
        const boundariesLayer = map.createLayer('boundaries', tilesetBaseChip, 0, 0).setCollisionByProperty({ collides: true })
        const decorLayer = map.createLayer('decor', tilesetBaseChip, 0, 0).setCollisionByProperty({ collides: true })
        const decor2Layer = map.createLayer('decor2', tilesetBaseChip, 0, 0).setCollisionByProperty({ collides: true })

        this.interactHayGroup = this.physics.add.staticGroup({
            key: 'hay',
            frameQuantity: 5
        });


        const interactHay = map.getObjectLayer('objfarming')
        interactHay.objects.forEach
        var layer = [boundariesLayer, basemapLayer, decorLayer, decor2Layer]

        // for testing checking collision box
        // const debugGraphics = this.add.graphics().setAlpha(0.5)
        // boundariesLayer.renderDebug(debugGraphics);

        //place player
        if (Moralis.User.current()) {
            spawnUser(Moralis.User.current(), layer, this.sprites, this);
        }


        let query = new Moralis.Query("playerData");
        query.exists("locX");
        query.exists("locY");
        let subscription = await query.subscribe();


        subscription.on('update', (object) => {

            if (object.get("user").id == Moralis.User.current().id)
                return;
            if (!this.sprites[object.get("user").id]) {
                //spawn 
                findDataForUser(object.get("user"))
                    .then((result) => {
                        if (result.length == 0) {
                            // console.log("spawn No user data object found...")
                        }
                        else {

                            var playerData = result[0];
                            const skinName = "skin" + playerData.get("skin");

                            const x = playerData.get("locX");
                            const y = playerData.get("locY");

                            const ethAddress = user.attributes.ethAddress

                            this.sprites[object.get("user").id] = context.physics.add.sprite(x, y, skinName).setScale(1, 1)
                            this.sprites[object.get("user").id].body.setSize(this.sprites[object.get("user").id].width * 0.5, this.sprites[object.get("user").id].height * 0.5, true);

                            sprite_add_text[object.get("user").id] = context.add.text(this.sprites[object.get("user").id].x - this.sprites[object.get("user").id].width * 3, this.sprites[object.get("user").id].y - this.sprites[object.get("user").id].height * 0.5, ethAddress, { font: "10px Arial", align: "center" })

                            if (object.get("user").id == Moralis.User.current().id) {
                                playerData.set("latestSpawn", new Date().getTime());
                                playerData.save();
                            }

                        }
                    }, (error) => {
                        console.log(error);
                    })
            }

            destinations[object.get("user").id] = { x: object.get("locX"), y: object.get("locY") }
            // console.log(destinations[object.get("user").id])

        });


    }

    updateAsiraState(msg) {
        if (msg == "Get 1x Wood and 5x Hay") {
            console.log(msg)
            this.TalkToAsira = false;
        }
    }


    update(time, delta) {
        var context = this;
        var moveSpeedVel = 200;
        // const EVENT_COOLOFF = 500; // 1 second cool of between events
        // var event_cooloffs = [];

        // var sprites = {}
        // var otherSprites = {}
        // var sprite_add_text = {}
        // var destinations = {}

        function findDataForUser(user) {
            var data = Moralis.Object.extend("playerData");
            const query = new Moralis.Query(data);
            query.equalTo("user", user);
            return query.find();
        }

        function saveEventTimer(id) {

            // if first event - allow it and set cool off
            if (!context.event_cooloffs[id]) {
                context.event_cooloffs[id] = Date.now() + context.EVENT_COOLOFF;
                return true;
            }
            //not enough time passed
            else if (context.event_cooloffs[id] > Date.now()) {
                return false;
            }
            else {
                context.event_cooloffs[id] = Date.now() + context.EVENT_COOLOFF;
                return true;
            }
        }

        function handleInteraction() {
            context.interactionIndicator.visible = true;
        }

        if (!Moralis.User.current()) return;
        const user = Moralis.User.current();
        const ethAddress = user.attributes.ethAddress

        var userId = user.id;


        if (!this.cursors || !this.sprites[userId]) {
            return
        }
        else if (this.cursors.left?.isDown) {
            this.sprites[userId].body.setVelocity(-moveSpeedVel, 0)
            this.interactionHitbox.setPosition(this.sprites[userId].body.x - 5, this.sprites[userId].body.y + 10)
        }
        else if (this.cursors.right?.isDown) {
            this.sprites[userId].body.setVelocity(moveSpeedVel, 0)
            this.interactionHitbox.setPosition(this.sprites[userId].body.x + this.sprites[userId].body.width + 5, this.sprites[userId].body.y + 10)

        }
        else if (this.cursors.up?.isDown) {
            this.sprites[userId].body.setVelocity(0, -moveSpeedVel)
            this.interactionHitbox.setPosition(this.sprites[userId].body.x + 13, this.sprites[userId].body.y - 5)

        }
        else if (this.cursors.down?.isDown) {
            this.sprites[userId].body.setVelocity(0, moveSpeedVel)
            this.interactionHitbox.setPosition(this.sprites[userId].body.x + 13, this.sprites[userId].body.y + this.sprites[userId].body.height + 5)

        }
        else {
            this.sprites[userId].body.setVelocity(0, 0)
        }
        this.sprite_add_text[user.id].setPosition(this.sprites[userId].x - this.sprites[user.id].width * 2.3, this.sprites[userId].y - this.sprites[user.id].height * 0.5, ethAddress, { font: "8px Arial", align: "center" })
        this.interactionIndicator.visible = false;
        this.interactionIndicator.setPosition(context.sprites[user.id].x, context.sprites[user.id].y - 15);

        if (saveEventTimer(Moralis.User.current().id)) {
            findDataForUser(Moralis.User.current())
                .then((result) => {
                    if (result.length == 0) {
                        console.log("No user data object found...")
                    }
                    else {
                        var playerData = result[0];
                        playerData.set("locX", this.sprites[Moralis.User.current().id].body.x);
                        playerData.set("locY", this.sprites[Moralis.User.current().id].body.y);

                        playerData.save();
                        console.log(`save to db ${this.sprites[Moralis.User.current().id].body.y}`)
                    }
                }, (error) => {
                    console.log(error);
                })
        }


        Object.keys(this.sprites).forEach(function (userId) {
            if (context.sprites[userId] && context.destinations[userId]) {

                if (context.sprites[userId].x != context.destinations[userId].x && context.sprites[userId].y != context.destinations[userId].y) {
                    console.log(`desti ${context.destinations[userId].x}, ${context.destinations[userId].y} `)
                    context.sprites[userId].setPosition(context.destinations[userId].x, context.destinations[userId].y)
                    console.log(`sprite ${context.sprites[userId].x}, ${context.sprites[userId].y} `)
                    sprite_add_text[userId].setPosition(context.sprites[userId].x - context.sprites[userId].width * 2.3, context.sprites[userId].y - context.sprites[userId].height * 0.5, ethAddress, { font: "8px Arial", align: "center" })

                }
            };
        }

        )

        eventsCenter.on('update-mission', this.updateAsiraState, this)
        if (this.TalkToAsira != false) {
            this.physics.collide(this.interactionHitbox, this.npcSprites[1], () => {
                handleInteraction();
                this.input.keyboard.once('keydown-E', () => {
                    this.scene.launch('npcOverlay', { npcID: 1, npcName: `Asira` });
                }
                )
                // when scene starts again, this triggers again
            }
            );
        }


        this.physics.collide(this.interactionHitbox, this.npcSprites[2], () => {
            handleInteraction();
            this.input.keyboard.once('keydown-E', () => {
                this.scene.launch('npcOverlay', { npcID: 2, npcName: `Farmer` });
            })
        }
        );
    }
}