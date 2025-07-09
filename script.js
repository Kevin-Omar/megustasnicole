document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-heart');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 8000;
    let arrows = []; 
    const gravity = 0.1; 

    class Arrow {
        constructor(targetX, targetY) {
            this.radius = 80;
            this.isActive = true;

            const side = Math.floor(Math.random() * 4);
            if (side === 0) { // Top
                this.x = Math.random() * canvas.width;
                this.y = -50;
            } else if (side === 1) { // Right
                this.x = canvas.width + 50;
                this.y = Math.random() * canvas.height;
            } else if (side === 2) { // Bottom
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 50;
            } else { // Left
                this.x = -50;
                this.y = Math.random() * canvas.height;
            }
            
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const angle = Math.atan2(dy, dx);
            const speed = 20 + Math.random() * 5; 

            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.atan2(this.vy, this.vx));
            
            ctx.beginPath();
            ctx.moveTo(0, 0); 
            ctx.lineTo(-30, -7); 
            ctx.moveTo(0, 0);
            ctx.lineTo(-30, 7);
            ctx.moveTo(-25, 0); 
            ctx.lineTo(-60, 0);

            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();
        }

        update() {
            if (!this.isActive) return;
            this.vy += gravity;
            
            this.x += this.vx;
            this.y += this.vy;

            if (this.y > canvas.height + 100) {
                this.isActive = false;
            }
        }
    }

    class Particle {
        constructor(x, y, size, color) {
            this.x = x; this.y = y;
            this.size = size; this.color = color;
            this.baseX = x; this.baseY = y;
            this.vx = 0; this.vy = 0;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            for (const arrow of arrows) {
                if (!arrow.isActive) continue;
                const dx = arrow.x - this.x;
                const dy = arrow.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < arrow.radius) {
                    const force = (arrow.radius - distance) / arrow.radius;
                    this.vx -= dx * force * 0.1 * this.density;
                    this.vy -= dy * force * 0.1 * this.density;
                }
            }

            const dx_base = this.baseX - this.x;
            const dy_base = this.baseY - this.y;
            this.vx += dx_base * 0.01;
            this.vy += dy_base * 0.01;

            this.vx *= 0.95; 
            this.vy *= 0.95;

            this.x += this.vx;
            this.y += this.vy;
        }
    }
    
    canvas.addEventListener('click', (event) => {
        arrows.push(new Arrow(event.clientX, event.clientY));
    });

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < arrows.length; i++) {
            arrows[i].update();
            arrows[i].draw();
        }
        
        arrows = arrows.filter(arrow => arrow.isActive);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }

    function init() {
        particles = [];
        const scale = 18;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2.5;
        const heartPath = new Path2D();
        for (let t = 0; t < Math.PI * 2; t += 0.01) {
            let x = centerX + scale * (16 * Math.pow(Math.sin(t), 3));
            let y = centerY - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            if (t === 0) heartPath.moveTo(x, y);
            else heartPath.lineTo(x, y);
        }
        heartPath.closePath();
        let createdParticles = 0;
        while (createdParticles < particleCount) {
            const boxX = centerX + (Math.random() - 0.5) * (scale * 35);
            const boxY = centerY + (Math.random() - 0.5) * (scale * 35);
            if (ctx.isPointInPath(heartPath, boxX, boxY)) {
                const size = Math.random() * 1.5 + 0.5;
                const hue = Math.random() * 25 - 10 + 350;
                const color = `hsl(${hue}, 100%, 55%)`;
                particles.push(new Particle(boxX, boxY, size, color));
                createdParticles++;
            }
        }
    }

    init();
    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    const message = "Como ves, mi corazón no resiste cuando se trata de ti. ❤️<br>Me Gustas Nicole";
    const messageEl = document.getElementById('love-message');
    
    gsap.to(messageEl, {
        duration: message.length * 0.12,
        text: {
            value: message,
            delimiter: "", // opcional: anima letra por letra
        },
        ease: "none",
        delay: 3
    });
});