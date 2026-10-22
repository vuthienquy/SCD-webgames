import { with3D } from "./rotation.js";

export function draw(ctx, object) {
        with3D(ctx, object, () => {
            const w = object.size * 1.8;
            const h = object.size * 0.92;

            ctx.fillStyle = `rgba(65,137,105,${object.opacity * 0.4})`;
            ctx.fillRect(-w / 2, -h / 2, w, h);

            ctx.strokeStyle = `rgba(138,213,173,${object.opacity})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(-w / 2, -h / 2, w, h);

            ctx.beginPath();
            ctx.ellipse(0, 0, w * 0.19, h * 0.35, 0, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = `rgba(159,226,190,${object.opacity})`;
            ctx.font = `bold ${h * 0.55}px Georgia`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("$", 0, 0);
        });
    }
