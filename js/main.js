// Cuenta regresiva
let countdown = 3;
const countdownElement = document.getElementById('countdown');
const countdownContainer = document.getElementById('countdown-container');
const mainContainer = document.getElementById('container');

const countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;

    if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownContainer.style.display = 'none'; // Oculta el contenedor de la cuenta regresiva
        mainContainer.style.display = 'block'; // Muestra el contenido principal
        startFireworks(); // Inicia los fuegos artificiales
        showCake(); // Muestra la torta
    }
}, 1000);

// Inicia los fuegos artificiales después de la cuenta regresiva
function startFireworks() {
    const PI2 = Math.PI * 2;
    const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
    const timestamp = _ => new Date().getTime();

    class Birthday {
        constructor() {
            this.resize();
            this.fireworks = [];
            this.counter = 0;
        }

        resize() {
            this.width = canvas.width = window.innerWidth;
            this.height = canvas.height = window.innerHeight;
            this.spawnA = this.width / 4;
            this.spawnB = this.width * 3 / 4;
            this.spawnC = this.height * 0.1;
            this.spawnD = this.height * 0.5;
        }

        onClick(evt) {
            let x = evt.clientX || evt.touches && evt.touches[0].pageX;
            let y = evt.clientY || evt.touches && evt.touches[0].pageY;

            let count = random(3, 5);
            for (let i = 0; i < count; i++) this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                x,
                y,
                random(0, 260),
                random(30, 110)
            ));

            this.counter = -1;
        }

        update(delta) {
            if (this.y <= 0) {
                explodeBalloon(); // Llama a la función de explosión
                this.dead = true; // Marca el globo como muerto
                document.querySelector('#balloon span').style.display = 'block'; // Asegura que el número siga visible
            }
            ctx.globalCompositeOperation = 'hard-light';
            ctx.fillStyle = `rgba(0,0,0,${7 * delta})`;
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.globalCompositeOperation = 'lighter';
            for (let firework of this.fireworks) firework.update(delta);

            this.counter += delta * 3;
            if (this.counter >= 1) {
                this.fireworks.push(new Firework(
                    random(this.spawnA, this.spawnB),
                    this.height,
                    random(0, this.width),
                    random(this.spawnC, this.spawnD),
                    random(0, 360),
                    random(30, 110)
                ));
                this.counter = 0;
            }

            if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead);
        }
    }

    class Firework {
        constructor(x, y, targetX, targetY, shade, offsprings) {
            this.dead = false;
            this.offsprings = offsprings;
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.shade = shade;
            this.history = [];
        }

        update(delta) {
            if (this.dead) return;

            let xDiff = this.targetX - this.x;
            let yDiff = this.targetY - this.y;
            if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
                this.x += xDiff * 2 * delta;
                this.y += yDiff * 2 * delta;

                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 20) this.history.shift();
            } else {
                if (this.offsprings && !this.madeChilds) {
                    let babies = this.offsprings / 2;
                    for (let i = 0; i < babies; i++) {
                        let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
                        let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;
                        birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
                    }
                }
                this.madeChilds = true;
                this.history.shift();
            }

            if (this.history.length === 0) this.dead = true;
            else if (this.offsprings) {
                for (let i = 0; this.history.length > i; i++) {
                    let point = this.history[i];
                    ctx.beginPath();
                    ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)';
                    ctx.arc(point.x, point.y, 1, 0, PI2, false);
                    ctx.fill();
                }
            } else {
                ctx.beginPath();
                ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)';
                ctx.arc(this.x, this.y, 1, 0, PI2, false);
                ctx.fill();
            }
            
        }
    }

    let canvas = document.getElementById('birthday');
    let ctx = canvas.getContext('2d');
    let then = timestamp();

    let birthday = new Birthday();
    window.onresize = () => birthday.resize();
    document.onclick = evt => birthday.onClick(evt);
    document.ontouchstart = evt => birthday.onClick(evt);

    (function loop() {
        requestAnimationFrame(loop);
    
        let now = timestamp();
        let delta = (now - then) / 1000;
        then = now;
    
        birthday.update(delta);
    })();
    }
    function showCake() {
        document.getElementById('cake-container').style.display = 'block'; // Asegúrate de que el contenedor de la torta esté oculto por defecto
    }

    function explodeBalloon() {
        const explosionCanvas = document.createElement('canvas');
        explosionCanvas.width = window.innerWidth;
        explosionCanvas.height = window.innerHeight;
        document.body.appendChild(explosionCanvas);
        const exCtx = explosionCanvas.getContext('2d');
    
        const drawExplosion = (x, y) => {
            for (let i = 0; i < 100; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 50;
                const hue = Math.random() * 360;
    
                exCtx.beginPath();
                exCtx.arc(x, y, radius, 0, Math.PI * 2);
                exCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                exCtx.fill();
            }
            setTimeout(() => explosionCanvas.remove(), 500); // Elimina el canvas después de 0.5 segundos
        };
    
        drawExplosion(balloon.x, balloon.y);
    }
    
  