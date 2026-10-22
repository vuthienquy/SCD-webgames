import { with3D } from "./rotation.js";

export function draw(ctx, object) {
        with3D(ctx, object, () => {
            const length = object.size * 1.15;
            const r = object.size * 0.17;

            ctx.beginPath();
            ctx.moveTo(-length / 2, -r);
            ctx.lineTo(length * 0.18, -r);
            ctx.lineTo(length / 2, 0);
            ctx.lineTo(length * 0.18, r);
            ctx.lineTo(-length / 2, r);
            ctx.closePath();

            ctx.fillStyle = `rgba(219,196,143,${object.opacity})`;
            ctx.strokeStyle = `rgba(238,220,178,${object.opacity})`;
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
        });
    }
