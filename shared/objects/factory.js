import { makeRotation3D } from "./rotation.js";

export const OBJECT_TYPES = ["knight", "pawn", "queen", "rook", "board", "chip", "money", "revolver", "bullet"];

export function createFloatingObject(type, initial, width, height, random) {
    let x, y;
    if (initial) { x = random(0, width); y = random(0, height); }
    else {
        const edge = Math.floor(random(0, 4));
        if (edge === 0) { x = random(0, width); y = -80; }
        else if (edge === 1) { x = width + 80; y = random(0, height); }
        else if (edge === 2) { x = random(0, width); y = height + 80; }
        else { x = -80; y = random(0, height); }
    }
    const direction = random(0, Math.PI * 2), speed = random(0.25, 1.0);
    return {
        type, x, y, vx: Math.cos(direction) * speed, vy: Math.sin(direction) * speed,
        angle: random(0, Math.PI * 2), spin: random(-0.01, 0.01),
        rotation3D: makeRotation3D(random), scale: random(0.7, 1.25),
        size: random(23, 43), depth: random(0.7, 1.3),
        life: initial ? random(0.1, 0.8) : 0, duration: random(24000, 42000),
        baseOpacity: random(0.3, 0.7), opacity: initial ? random(0.12, 0.4) : 0
    };
}

export function createObjectSet(width, height, mobile, random) {
    const count = mobile() ? 10 : 18;
    return Array.from({ length: count }, (_, i) =>
        createFloatingObject(OBJECT_TYPES[i % OBJECT_TYPES.length], true, width, height, random)
    );
}
