import { with3D } from "./rotation.js";

export function draw(ctx, object) {
        with3D(ctx, object, () => {
            const r = object.size * 0.62;

            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(123,105,203,${object.opacity * 0.4})`;
            ctx.fill();

            ctx.strokeStyle = `rgba(192,177,255,${object.opacity})`;
            ctx.lineWidth = 4;
            ctx.setLineDash([5, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.67, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = `rgba(211,200,255,${object.opacity})`;
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("S", 0, 0);
        });
    }
