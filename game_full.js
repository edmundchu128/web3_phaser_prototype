var config = {
    type: Phaser.CANVAS,
    width: 500,
    height: 400,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    }
};

const game = new Phaser.Game(config);
const EVENT_COOLOFF = 500; // 1 second cool of between events
var event_cooloffs = [];

var sprites = {}
var otherSprites = {}
var sprite_add_text = {}
var destinations = {}
var spriteSpeed = 5;
var stepSize = 20;

var context;

function preload() {
    this.load.image('tiles1', 'tiles/[Base]BaseChip_pipo.png');
    this.load.tilemapTiledJSON('map_test', 'tiles/map.json')
    this.load.image('skin1', 'images/blob/1.png');
    this.load.image('skin2', 'images/blob/2.png');
    this.load.image('skin3', 'images/blob/3.png');
    this.load.image('skin4', 'images/blob/4.png');
    this.load.image('skin5', 'images/blob/5.png');
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

                sprites[user.id] = context.physics.add.sprite(x, y, skinName).setScale(1, 1)
                sprites[user.id].body.setSize(sprites[user.id].width * 0.5, sprites[user.id].height * 0.5, true);
                sprite_add_text[user.id] = context.add.text(sprites[userId].x - sprites[user.id].width * 3, sprites[userId].y - sprites[user.id].height * 0.5, ethAddress, { font: "10px Arial", align: "center" })

                layer.forEach(eachlayer => context.physics.add.collider(sprites[user.id], eachlayer))
                context.physics.add.collider(sprites[user.id], layer)

                context.cameras.main.startFollow(sprites[user.id])

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

async function create() {
    // console.log("create");
    context = this;
    const user = Moralis.User.current()
    // place background
    const map = this.make.tilemap({ key: 'map_test' })
    const tilesetBaseChip = map.addTilesetImage('[Base]BaseChip_pipo', 'tiles1')
    const basemapLayer = map.createLayer('base', tilesetBaseChip, 0, 0).setCollisionByProperty({ collides: true })
    const boundariesLayer = map.createLayer('boundaries', tilesetBaseChip, 0, 0).setCollisionByProperty({ collides: true })
    const decorLayer = map.createLayer('decor', tilesetBaseChip, 0, 0).setCollisionByProperty({ collides: true })


    //for testing checking collision box
    const debugGraphics = this.add.graphics().setAlpha(0.5)
    boundariesLayer.renderDebug(debugGraphics);
    layer = [boundariesLayer, basemapLayer, decorLayer]

    //place player
    if (Moralis.User.current()) {
        spawnUser(Moralis.User.current(), layer)

    }
    let query = new Moralis.Query("playerData");
    query.exists("locX");
    query.exists("locY");
    // console.log("this is query" + query.exists("locX"));
    let subscription = await query.subscribe();


    subscription.on('update', (object) => {

        if (object.get("user").id == Moralis.User.current().id)
            return;

        //console.log(JSON.stringify(sprites))
        // // console.log('user moved');
        // // console.log(object.get("user").id);
        // // console.log("new location: " + object.get("locX") + " " + object.get("locY"));

        if (!sprites[object.get("user").id]) {
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

                        sprites[object.get("user").id] = context.physics.add.sprite(x, y, skinName).setScale(1, 1)
                        sprites[object.get("user").id].body.setSize(sprites[object.get("user").id].width * 0.5, sprites[object.get("user").id].height * 0.5, true);

                        sprite_add_text[object.get("user").id] = context.add.text(sprites[object.get("user").id].x - sprites[object.get("user").id].width * 3, sprites[object.get("user").id].y - sprites[object.get("user").id].height * 0.5, ethAddress, { font: "10px Arial", align: "center" })

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


function update(time, delta) {

    if (!Moralis.User.current()) return;
    const user = Moralis.User.current();
    const ethAddress = user.attributes.ethAddress

    userId = user.id;
    cursors = this.input.keyboard.createCursorKeys();
    // if (cursors.left.isDown) {
    //     emitMove("left", Moralis.User.current().id)
    // }
    // else if (cursors.right.isDown) {
    //     emitMove("right", Moralis.User.current().id)
    // }
    // else if (cursors.up.isDown) {
    //     emitMove("up", Moralis.User.current().id)
    // }
    // else if (cursors.down.isDown) {
    //     emitMove("down", Moralis.User.current().id)
    // } else
    //     sprites[userId].body.setVelocity(0, 0)


    if (!cursors || !sprites[userId]) {
        return
    }
    else if (cursors.left?.isDown) {
        sprites[userId].body.setVelocity(-350, 0)

    }
    else if (cursors.right?.isDown) {
        sprites[userId].body.setVelocity(350, 0)
    }
    else if (cursors.up?.isDown) {
        sprites[userId].body.setVelocity(0, -350)

    }
    else if (cursors.down?.isDown) {
        sprites[userId].body.setVelocity(0, 350)
    }
    else {
        sprites[userId].body.setVelocity(0, 0)

    }
    sprite_add_text[user.id].setPosition(sprites[userId].x - sprites[user.id].width * 2.3, sprites[userId].y - sprites[user.id].height * 0.5, ethAddress, { font: "8px Arial", align: "center" })



    if (saveEventTimer(Moralis.User.current().id)) {
        findDataForUser(Moralis.User.current())
            .then((result) => {
                if (result.length == 0) {
                    console.log("No user data object found...")
                }
                else {
                    var playerData = result[0];
                    playerData.set("locX", sprites[Moralis.User.current().id].body.x);
                    playerData.set("locY", sprites[Moralis.User.current().id].body.y);

                    playerData.save();
                    console.log(`save to db ${sprites[Moralis.User.current().id].body.y}`)
                }
            }, (error) => {
                console.log(error);
            })
    }


    Object.keys(sprites).forEach(function (userId) {
        if (sprites[userId] && destinations[userId]) {

            if (sprites[userId].x != destinations[userId].x && sprites[userId].y != destinations[userId].y) {
                console.log(`desti ${destinations[userId].x}, ${destinations[userId].y} `)
                sprites[userId].setPosition(destinations[userId].x, destinations[userId].y)
                console.log(`sprite ${sprites[userId].x}, ${sprites[userId].y} `)
                sprite_add_text[userId].setPosition(sprites[userId].x - sprites[userId].width * 2.3, sprites[userId].y - sprites[userId].height * 0.5, ethAddress, { font: "8px Arial", align: "center" })

            }
        };
    })
}


function saveEventTimer(id) {

    // if first event - allow it and set cool off
    if (!event_cooloffs[id]) {
        event_cooloffs[id] = Date.now() + EVENT_COOLOFF;
        return true;
    }
    //not enough time passed
    else if (event_cooloffs[id] > Date.now()) {
        return false;
    }
    else {
        event_cooloffs[id] = Date.now() + EVENT_COOLOFF;
        return true;
    }
}

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
