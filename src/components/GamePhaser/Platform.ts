import * as Phaser from "phaser";
import MainScene from "./MainScene";
import Member from "./Member";
import { actions } from "../../redux";

export enum PlatformType {
  start = "start",
  finish = "finish"
}

export default class Platform extends Phaser.Physics.Matter.Image {
  type: PlatformType;
  scene: MainScene;
  readonly initialScale: number;
  sensor?: Phaser.GameObjects.GameObject;

  constructor({
    scene,
    x = 0,
    y = 0,
    texture,
    options,
    type,
    scale = 0.3
  }: {
    scene: MainScene;
    x?: number;
    y?: number;
    texture: string;
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig;
    scale?: number;
    type: PlatformType;
  }) {
    super(scene.matter.world, x, y, texture, undefined, options);

    scene.sys.displayList.add(this);

    this.scene = scene;
    this.type = type;
    this.initialScale = scale;
    this.init();
  }

  // FUNCTIONS

  init() {
    this.setScale(this.initialScale);
    this.setY(this.scene.game.canvas.height - this.displayHeight / 2);
    this.createSensor();
  }

  createSensor() {
    if (this.type === PlatformType.start) {
      this.createStartSensor();
    } else if (this.type === PlatformType.finish) {
      this.createFinishSensor();
    }
  }

  createStartSensor() {
    this.sensor = this.scene.matter.add.gameObject(
      this.scene.add.rectangle(
        this.x,
        this.y - this.displayHeight / 2 - 100,
        this.displayWidth + 50,
        200
      ),
      {
        isSensor: true,
        isStatic: true,
        ignorePointer: true
      }
    );

    // listen collisions active
    this.scene.matterCollision.addOnCollideActive({
      objectA: this.sensor,
      callback: (e: any) => {
        const { gameObjectB } = e;
        // if collide with member
        if (gameObjectB instanceof Member) {
          this.sensor!.setData("isColliding", true);
        }
      }
    });

    // listen collisions end
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.sensor,
      callback: (e: any) => {
        const { gameObjectB } = e;
        // if collide with member
        if (gameObjectB instanceof Member) {
          this.sensor!.setData("isColliding", false);
          // wait 0.5 second
          setTimeout(() => {
            // if sensor not colliding currently : new member spawn
            if (!this.sensor!.getData("isColliding")) {
              this.scene.newMemberSpawn();
            }
          }, 500);
        }
      }
    });
  }

  createFinishSensor() {
    this.sensor = this.scene.matter.add.gameObject(
      this.scene.add.rectangle(
        this.x,
        this.y - this.displayHeight / 2 - 5,
        this.displayWidth / 4,
        10
      ),
      {
        isSensor: true,
        isStatic: true,
        ignorePointer: true
      }
    );

    // listen collision start
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensor,
      callback: (e: any) => {
        const { gameObjectB } = e;

        // if collide with member and my role is plateforms
        if (
          gameObjectB instanceof Member &&
          this.scene.playerId === this.scene.getPlayerWithPlatformRole()
        ) {
          // emit member arrived
          this.scene.dispatch(
            actions.webSocket.emit.round.memberArrived({
              memberId: gameObjectB.id
            })
          );
        }
      }
    });
  }
}
