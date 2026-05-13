console.log("movement.js starting init...")

setTimeout(function(){

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// world properties
const worldProperties = {
    gravity: 0.4,
    accel: 0.5,
    airAccel: 0.4,
    friction: 0.87, // 0.0 (100% friction) -- 1.0 (zero friction)
    maxSpeed: 15
}

// creates the player object
const player = {
    x: 100,
    y: 100,
    width: 20,
    height: 40,
    vx: 0,
    vy: 0,
    gravity: 0.4,
    accel: 0.5,
    airAccel: 0.4,
    friction: 0.87, // 0.0 (100% friction) -- 1.0 (zero friction)
    maxSpeed: 15,
    groundMaxSpeed: 6,
    jumpImpulse: 8,
    onGround: false,
    canJump: true,
    crouched: false,
    canDash: true,
    dashing: false,
    health: 100,
    maxHealth: 100,
    armor: 0
}


// player input and key tracking
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    " ": false,
    shift: false
}

const keysPressed = {}

for (var i in keys) {
    keysPressed[i] = false;
}

const mouse = { x: 0, y: 0 };

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

// listens for when a key is DOWN
document.addEventListener("keydown", function(event){
    const key = event.key.toLowerCase();

    if (key in keys) {
        if (!keys[key]) {
            keysPressed[key] = true; // only fires once per press
        }
        keys[key] = true;
    }
});

// listens for when a key is UP
document.addEventListener("keyup", function(event){
    const key = event.key.toLowerCase();

    if (key in keys) {keys[key] = false;}
});

// updating canvas

function update() {
    // set canvas bg color
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // grounded accel (left/right)
    if (player.onGround) {
        if (keys["a"]) {
            player.vx -= player.accel;
        }
        if (keys["d"]) {
            player.vx += player.accel;
        }
    }

    // accel in air (left/right)
    if (!(player.onGround)) {
        if (Math.abs(player.vx) >= player.groundMaxSpeed) {
            
            // if player velocity is negative in the air, allows them to increase velocity
            if (player.vx < 0) {
            if (keys["d"]) {
                player.vx += player.airAccel;
            }
            }

            // if player velocity is positive in the air, allows them to decrease velocity
            if (player.vx > 0) {
            if (keys["a"]) {
                player.vx -= player.airAccel;
            }
            }

        } else if (Math.abs(player.vx) < player.groundMaxSpeed) {
            if (keys["a"]) {
                player.vx -= player.airAccel;
            }
            if (keys["d"]) {
                player.vx += player.airAccel;
            }
        }
    }

    // limit max speed
    if (player.vx > player.maxSpeed) player.vx = player.maxSpeed;
    if (player.vx < -player.maxSpeed) player.vx = -player.maxSpeed;
    if (player.onGround) {
        if (player.vx > player.groundMaxSpeed) player.vx = player.groundMaxSpeed;
        if (player.vx < -player.groundMaxSpeed) player.vx = -player.groundMaxSpeed;
    }

    // FRICTION (deceleration when no input)
    if (!keys["a"] && !keys["d"] && player.onGround) {
        player.vx *= player.friction;

        // stop tiny drifting
        if (Math.abs(player.vx) < 0.05) {
            player.vx = 0;
        }
    }

    // crouching
    if (keys["s"]) {
        if (!player.crouched) {
            player.crouched = true;
            if (player.onGround) player.y += 20;
        }
    } else {
        player.crouched = false;
    }
    
    if (player.crouched) {
        player.groundMaxSpeed = 3;
        player.accel = 0.25;
        player.airAccel = 0.2;
        player.height = 20;
        player.jumpImpulse = 6;
    } else {
        player.groundMaxSpeed = 6;
        player.accel = 0.5;
        player.airAccel = 0.4;
        player.height = 40;
        player.jumpImpulse = 8;
    }
    // jumping

    if (keysPressed[" "] && player.onGround) {
        player.vy = -player.jumpImpulse;
        player.onGround = false;
    }
    
    // gravity
    player.vy += player.gravity;

    // update position
    player.x += player.vx;
    player.y += player.vy;

    // ground collision (floor at y = 350)
    if (player.y + player.height >= 350) {
        player.y = 350 - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // draw ground
    ctx.fillStyle = "green";
    ctx.fillRect(0, 350, canvas.width, 50);

    // draws player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // held item orbit around player
    const angle = Math.atan2(
        mouse.y - (player.y + player.height / 2),
        mouse.x - (player.x + player.width / 2)
    );

    const radius = 30;

    const itemX = player.x + player.width / 2 + Math.cos(angle) * radius;
    const itemY = player.y + player.height / 2 + Math.sin(angle) * radius;

    const item = window.hotbar?.slots?.[window.hotbar.selected];

    if (item && item.img) {
        ctx.save();
        ctx.translate(itemX, itemY);
        ctx.rotate(angle);

        const flip = Math.cos(angle) < 0;

        if (flip) {
            ctx.scale(1, -1); // mirror horizontally
        }

        ctx.drawImage(item.img, -20, -20, 40, 40);

        ctx.restore();
    }

    //
    for (var i in keysPressed) {
        keysPressed[i] = false;
    }

    // draws health bar
    ctx.fillStyle = "green";
    ctx.fillRect(20, 20, player.health * 2, 20);

    ctx.strokeStyle = "black";
    ctx.strokeRect(20, 20, 200, 20);

    drawHotbar();

    requestAnimationFrame(update);
}

update();

// press p for fullscreen
document.addEventListener("keydown", e => {
    if (e.key === "p") {
        canvas.requestFullscreen();
    }
});

ctx.imageSmoothingEnabled = false;

function drawHotbar() {
    if (!window.hotbar) return;

    const size = 50;
    const gap = 5;

    const startX = (canvas.width / 2) - (9 * size + 8 * gap) / 2;
    const y = canvas.height - 70;

    for (let i = 0; i < 9; i++) {

        const x = startX + i * (size + gap);

        // slot background
        ctx.fillStyle = (i === window.hotbar.selected) ? "#f5c542" : "gray";
        ctx.fillRect(x, y, size, size);

        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, size, size);

        // item text
        const item = window.hotbar.slots[i];
        
        if (item) {
            if (item.img) {
                ctx.drawImage(item.img, x + 5, y + 5, 40, 40);
            } else {
                ctx.fillStyle = "black";
                ctx.font = "12px Arial";
                ctx.fillText(item.name || item, x + 5, y + 30);
            }
        }
    }
}

console.log("movement.js initialized!")
}, 1000)