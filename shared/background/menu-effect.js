(() => {
    const canvas = document.getElementById("space");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const random = (min, max) => Math.random() * (max - min) + min;
    let width = 0, height = 0, dpr = 1, particles = [], lastTime = 0, animationId = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function createParticle(initial = false) {
        return {x:random(0,width),y:initial?random(0,height):height+5,vx:random(-.18,.18),vy:random(-.22,-.05),radius:random(.5,1.5),alpha:random(.15,.6),phase:random(0,Math.PI*2)};
    }
    function resize() {
        const oldWidth=width,oldHeight=height;
        width=window.innerWidth;height=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,1.5);
        canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
        canvas.style.width=width+"px";canvas.style.height=height+"px";ctx.setTransform(dpr,0,0,dpr,0,0);
        if(!oldWidth||!oldHeight) particles=Array.from({length:width<600?32:65},()=>createParticle(true));
        else particles.forEach(p=>{p.x*=width/oldWidth;p.y*=height/oldHeight});
    }
    function render(timestamp) {
        if(document.hidden){animationId=null;return}
        const dt=lastTime?Math.min((timestamp-lastTime)/16.67,2):1;lastTime=timestamp;ctx.clearRect(0,0,width,height);
        for(const p of particles){
            if(!reducedMotion){p.x+=p.vx*dt;p.y+=p.vy*dt;p.phase+=.015*dt}
            if(p.y< -10||p.x< -10||p.x>width+10)Object.assign(p,createParticle());
            const glow=.75+Math.sin(p.phase)*.25;
            ctx.beginPath();ctx.arc(p.x,p.y,p.radius*glow,0,Math.PI*2);ctx.fillStyle=`rgba(187,170,255,${p.alpha})`;ctx.fill();
            ctx.beginPath();ctx.arc(p.x,p.y,p.radius*4,0,Math.PI*2);ctx.fillStyle=`rgba(130,105,255,${p.alpha*.07})`;ctx.fill();
        }
        for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){
            const a=particles[i],b=particles[j],distance=Math.hypot(a.x-b.x,a.y-b.y);if(distance>125)continue;
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(163,147,255,${(1-distance/125)*.10})`;ctx.lineWidth=.6;ctx.stroke();
        }
        if(!reducedMotion)animationId=requestAnimationFrame(render);
    }
    function start(){if(animationId!==null||reducedMotion)return;lastTime=0;animationId=requestAnimationFrame(render)}
    function stop(){if(animationId!==null){cancelAnimationFrame(animationId);animationId=null}}
    window.addEventListener("resize",resize);
    document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();else if(!reducedMotion)start()});
    resize();if(reducedMotion)render(0);else start();
})();