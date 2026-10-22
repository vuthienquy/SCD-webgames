// 3D rotation helpers shared by all floating objects.
export function rotateX(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}
export function rotateY(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}
export function rotateZ(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
}
export function project3D(point, rotation) {
    let p = rotateX(point, rotation.x);
    p = rotateY(p, rotation.y);
    p = rotateZ(p, rotation.z);
    const perspective = 420;
    const factor = perspective / (perspective + p.z);
    return { x: p.x * factor, y: p.y * factor, scale: factor };
}
export function makeRotation3D(random) {
    return {
        x: random(0, Math.PI * 2), y: random(0, Math.PI * 2), z: random(0, Math.PI * 2),
        vx: random(-0.004, 0.004), vy: random(-0.004, 0.004), vz: random(-0.009, 0.009)
    };
}
export function updateRotation3D(object, dt) {
    const r = object.rotation3D;
    r.x = (r.x + r.vx * dt) % (Math.PI * 2);
    r.y = (r.y + r.vy * dt) % (Math.PI * 2);
    r.z = (r.z + r.vz * dt) % (Math.PI * 2);
}
export function with3D(ctx, object, draw) {
    ctx.save();
    ctx.translate(object.x, object.y);
    const projected = project3D({ x: 0, y: 0, z: 0 }, object.rotation3D);
    ctx.rotate(object.rotation3D.z);
    ctx.scale(
        object.scale * object.depth * Math.max(0.12, Math.abs(Math.cos(object.rotation3D.y))),
        object.scale * object.depth * Math.max(0.12, Math.abs(Math.cos(object.rotation3D.x)))
    );
    ctx.globalAlpha *= Math.max(0.65, Math.min(1.25, projected.scale));
    draw();
    ctx.restore();
}
