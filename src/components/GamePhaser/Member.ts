import * as Phaser from "phaser";
import MainScene from "./MainScene";
import { enums } from "@colobobo/library";

export default class Member extends Phaser.Physics.Matter.Image {
  private readonly _id: string;
  private _status: enums.member.Status = enums.member.Status.waiting;

  constructor({
    scene,
    x = 0,
    y = 0,
    texture,
    options,
    id
  }: {
    scene: MainScene;
    x?: number;
    y?: number;
    texture: string;
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig;
    id: string;
  }) {
    super(scene.matter.world, x, y, texture, undefined, options);

    scene.sys.displayList.add(this);
    // scene.add.existing(this);

    console.log("NEW MEMBER");

    this._id = id;

    // set type on gameObject data
    this.setData("type", "member");
  }

  // GETTERS & SETTERS

  // id

  get id(): string {
    return this._id;
  }

  // status

  get status(): enums.member.Status {
    return this._status;
  }

  set status(value: enums.member.Status) {
    this._status = value;
  }
}
