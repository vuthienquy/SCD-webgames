import { with3D } from "./rotation.js";

export function draw(ctx, object) {
    with3D(ctx, object, () => {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${object.size * 1.45}px Georgia, serif`;
        ctx.fillStyle = `rgba(191,177,255,${object.opacity})`;
        ctx.shadowColor = "rgba(142,118,255,.35)";
        ctx.shadowBlur = 10;
        ctx.fillText("♜", 0, 0);
    });
}
