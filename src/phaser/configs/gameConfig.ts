import * as Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

export const getGameConfig = ({
  areaWidth,
  areaHeight,
  parent,
  scene,
  pixelRatio = window.devicePixelRatio
}: {
  areaWidth: number;
  areaHeight: number;
  parent: Phaser.Types.Core.GameConfig["parent"];
  scene: Phaser.Types.Core.GameConfig["scene"];
  pixelRatio?: number;
}): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  width: areaWidth * pixelRatio,
  height: areaHeight * pixelRatio,
  zoom: 1 / pixelRatio,
  // note : resolution doesn't work, see : https://github.com/photonstorm/phaser/issues/4417
  // resolution: pixelRatio
  parent: parent,
  transparent: true,
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0.9 * pixelRatio },
      // TODO: test sleeping
      // enableSleeping: true
      debug:
        process.env.NODE_ENV === "development"
          ? {
              showBody: true,
              showStaticBody: true,
              showInternalEdges: true,
              showVelocity: true,
              showCollisions: true,
              lineThickness: 2,
              showPositions: true,
              positionSize: 6
            }
          : false,
      setBounds: {
        x: -150 * pixelRatio,
        left: false,
        right: false,
        width: (areaWidth + 150) * pixelRatio,
        height: areaHeight * pixelRatio,
        thickness: 30 * pixelRatio
      },
      "plugins.wrap": true
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision",
        mapping: "matterCollision"
      }
    ]
  },
  scene
});