import LoadingScreen from "./src/LoadingScreen.js";
import StartScreen from "./src/StartScreen.js";
import TutorialScene from "./src/tutorialScene.js";
import NpcOverlay from "./src/NPCOverlay.js";
import itemNotificationHUD from "./src/ItemNotificationHUD.js";
import HUDOverlay from "./src/HUDOverlay.js";
import eventsCenter from "./src/EventsCenter.js";

var config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 960,
    backgroundColor: '#FFFFFF',
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [LoadingScreen, StartScreen, TutorialScene, NpcOverlay, itemNotificationHUD, HUDOverlay],
    fps: {
        target: 60,
        forceSetTimeOut: true
    }
};

const game = new Phaser.Game(config);
