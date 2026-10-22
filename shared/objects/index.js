import * as knight from "./knight.js";
import * as pawn from "./pawn.js";
import * as queen from "./queen.js";
import * as rook from "./rook.js";
import * as board from "./board.js";
import * as chip from "./chip.js";
import * as money from "./money.js";
import * as revolver from "./revolver.js";
import * as bullet from "./bullet.js";

const drawers = { knight, pawn, queen, rook, board, chip, money, revolver, bullet };

export function drawObject(ctx, object) {
    drawers[object.type]?.draw(ctx, object);
}

export function updateObjects(objects, dt, width, height, random, createFloatingObject, updateRotation3D) {
    for (const object of objects) {
        object.x += object.vx * dt;
        object.y += object.vy * dt;
        object.angle += object.spin * dt;
        updateRotation3D(object, dt);
        object.life += dt / object.duration;
        const fadeIn = Math.min(1, object.life * 4);
        const fadeOut = Math.min(1, (1 - object.life) * 4);
        object.opacity = Math.min(fadeIn, fadeOut) * object.baseOpacity;
        const margin = 100;
        const outside = object.x < -margin || object.x > width + margin ||
                        object.y < -margin || object.y > height + margin;
        if (object.life >= 1 || outside) {
            Object.assign(object, createFloatingObject(object.type, false, width, height, random));
        }
    }
}
