class Enemy {
	constructor(x, y, w, h, xspeed, yspeed) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.xspeed = xspeed;
		this.yspeed = yspeed;
		this.direction = 1;
		this.sprite = new Image();
		this.sprite.src = 'enemy.png';
	}

	update() {
		this.x += this.direction * this.xspeed;
		this.y += this.yspeed;
		if (this.x > c.width - this.w || this.x < 0) {
			this.direction *= -1;
		}
	}

	draw() {
		drawSprite(this.sprite, this.x, this.y, this.w, this.h);
	}
}

class Projectile {
	constructor(x, y, direction, speed) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.speed = speed;
	}

	update() {
		this.y += this.direction * this.speed;
	}

	draw() {
		ctx.strokeStyle = "red";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x, this.y + (50 * this.direction));
		ctx.stroke();
	}

	checkCollision(e) {
		var x1 = e.x;
		var y1 = e.y;
		var x2 = e.x + e.w;
		var y2 = e.y + e.h;
		if (this.x > x1 && this.x < x2 && this.y > y1 && this.y < y2) {
			return true;
		}
		return false;
	}
}

class Player {
	constructor(x, y, w, h, speed) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.speed = speed;
		this.acceleration = 0.5;
		this.deceleration = 0.5;
		this.velocity = 0;
		this.cooldownTime = 15;
		this.cooldown = 0;
		this.boostTime = 0;
		this.boostDelay = 5;
		this.boostCooldown = 0;
		this.boostStart = 20;
		this.sprite = new Image();
		this.sprite.src = 'ship.png';
	}

	draw() {
		drawSprite(this.sprite, this.x, this.y, this.w, this.h);
	}

	update() {
		if (this.cooldown > 0)
			this.cooldown--;

		if (this.boostCooldown > 0)
			this.boostCooldown--;

		if (this.velocity > 0)
			this.velocity -= this.deceleration;
		if (this.velocity < 0)
			this.velocity += this.deceleration;
		this.x += this.velocity;

		if (this.x >= c.width - this.w)
			this.x = c.width - this.w;
		if (this.x <= 0)
			this.x = 0;
	}

	accelerate(direction) {
		this.velocity += (this.speed * this.acceleration) * direction;
		if (this.velocity > 0 && this.velocity > this.speed) {
			this.velocity = this.speed * direction;
		}
		if (this.velocity < 0 && this.velocity < this.speed * -1) {
			this.velocity = this.speed * direction;
		}
	}

	shoot(boost) {
		if (boost && this.boostTime > 0 && this.boostCooldown == 0) {
			var proj = new Projectile(this.x + (this.w / 2), this.y, -1, 5);
			projectiles.push(proj);
			this.boostTime--;
			this.boostCooldown = this.boostDelay;
			playAudio('gun.mp3', false, false);
		} else if (this.cooldown == 0) {
			var proj = new Projectile(this.x + (this.w / 2), this.y, -1, 5);
			projectiles.push(proj);
			this.cooldown = p.cooldownTime;
			playAudio('gun.mp3', false, false);
		}
	}
}

function cleanup() {
	enemies = [];
	projectiles = [];
	level = -1;
}

function drawSprite(img, x, y, w, h) {
	ctx.drawImage(img, x, y);
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + w, y);
	ctx.lineTo(x + w, y + h);
	ctx.lineTo(x, y + h);
}

function generateEnemies(count) {
	var x = 0;
	var y = 0;
	var w = 96;
	var h = 64;
	var padding = 1.2;
	for (var i = 0; i < count; i++) {
		var e = new Enemy(x, y, w, h, 2, 0.25 * (level + 1));
		x += w * padding;
		if (x + (w * padding) > c.width) {
			y += h + 1.2;
			x = 0;
		}
		enemies.push(e);
	}
}

function  getMousePos(e) {
	var rect = c.getBoundingClientRect(),
		scaleX = c.width / rect.width,
		scaleY = c.height / rect.height;
	  return {
		x: (e.clientX - rect.left) * scaleX,
		y: (e.clientY - rect.top) * scaleY
	}
}

function mouseWithinBounds(e, x1, y1, x2, y2) {
	var m = getMousePos(e);
	return (m.x > x1 && m.y > y1 && m.x < x2 && m.y < y2);
}

function clearScreen() {
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.rect(0, 0, c.width, c.height);
	ctx.fillStyle = "black";
	ctx.fill();
}

function playAudio(str, override, loop) {
	if (override) {
		if (currentAudio != null)
			currentAudio.pause();

		currentAudio = new Audio(str);
		currentAudio.play();
		currentAudio.loop = loop;
	} else {
		var audio = new Audio(str);
		audio.play();
		audio.loop = loop;
	}
}

function writeText(str, x, y) {
	ctx.font = "30px Anonymous Pro";
	ctx.fillStyle = "green";
	ctx.fillText(str, x, y);
}

function splashScreen() {
	var bg = new Image();
	bg.src = 'splash.png';
	drawSprite(bg, 0, 0, c.width, c.height);
	if (gameState == GameState.SplashScreen) {
		requestAnimationFrame(splashScreen);
	} else {
		playAudio('start.mp3', true, true);
		startScreen();
	}
}

function startScreen() {
	level = -1;
	clearScreen();
	if (gameState == GameState.ControlsMenu) {
		var bg = new Image();
		bg.src = 'controls.png';
		drawSprite(bg, 0, 0, c.width, c.height);
	} else {
		var bg = new Image();
		bg.src = 'spaceshooter.png';
		drawSprite(bg, 0, 0, c.width, c.height);
	}

	if (gameState == GameState.StartMenu || gameState == GameState.ControlsMenu) {
		requestAnimationFrame(startScreen);
	} else {
		updateGame();
	}
}

function lossScreen() {
	clearScreen();
	var bg = new Image();
	bg.src = 'youlost.png';
	drawSprite(bg, 0, 0, c.width, c.height);

	if (gameState == GameState.StartMenu) {
		playAudio('start.mp3', true, true);
		startScreen();
	} else {
		requestAnimationFrame(lossScreen);
	}
}

function winScreen() {
	clearScreen();
	var bg = new Image();
	bg.src = 'youwon.png';
	drawSprite(bg, 0, 0, c.width, c.height);

	if (gameState == GameState.StartMenu) {
		playAudio('start.mp3');
		startScreen();
	} else {
		requestAnimationFrame(winScreen);
	}
}

function updateGame() {
	if (gameState == GameState.Paused) {
		requestAnimationFrame(updateGame);
		return;
	}

	now = Date.now();
	elapsed += now - then;
	if (elapsed > fpsInterval) {
		then = now;
		elapsed = 0;
	} else {
		requestAnimationFrame(updateGame);
		return;
	}

	clearScreen();
	if (keyState.A) {
		p.accelerate(-1);
	}
	if (keyState.D) {
		p.accelerate(1);
	}
	if (keyState.Space) {
		p.shoot(shiftPressed);
	}

	for (var i = 0; i < projectiles.length; i++) {
		projectiles[i].update();
		projectiles[i].draw();
	}

	/* remove old projectiles */
	for (var i = projectiles.length -1; i >= 0; i--) {
		if (projectiles[i].y > c.height + 50 || projectiles[i].y < -50) {
			projectiles.pop();
		} else {
			break;
		}
	}

	/* collision detection */
	for (var i = 0; i < projectiles.length; i++) {
		for (var j = 0; j < enemies.length; j++) {
			if (projectiles[i].checkCollision(enemies[j])) {
				enemies.splice(j, 1);
				projectiles.splice(i, 1);
				break;
			}
		}
	}
	if (enemies.length == 0 || level == -1) {
		level++;
		p.boostTime = p.boostStart;
		projectiles = [];
		if (level >= levels.length) {
			gameState = GameState.WinScreen;
			cleanup();
			playAudio('won.mp3', true, false);
			winScreen();
			return;
		}
		generateEnemies(levels[level]);
	}


	/* update enemies */
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].update();
		enemies[i].draw();
		if (enemies[i].y + enemies[i].h >= c.height) {
			gameState = GameState.LossScreen;
			cleanup();
			playAudio('lost.mp3', true, false);
			lossScreen();
			return;
		}
	}

	
	/* print level text */
	writeText("Level " + (level + 1), c.width - 200, c.height - 100);

	p.update();
	p.draw();
	requestAnimationFrame(updateGame);
}

var keyState = {
	A: false,
	D: false,
	Space: false,
};

const GameState = {
	StartMenu: 'Menu',
	ControlsMenu: 'ControlsMenu',
	SplashScreen: 'SplashScreen',
	Paused: 'Paused',
	LossScreen: 'LossScreen',
	WinScreen: 'WinScreen',
	Running: 'Running',
};

var c = document.getElementById("game");
c.width = 800;
c.height = 800;
var ctx = c.getContext("2d");

const p = new Player(300, c.height - 64, 76, 64, 5);
var enemies = [];
var projectiles = [];
var level = -1;
var levels = [ 6, 12, 18, 20, 20, 24, 30, 36, 40];
var currentAudio = null;

var gameState = GameState.SplashScreen;
var fpsInterval = 1000 / 60;
var then = Date.now();
var startTime = then;
var elapsed = 0;
var shootSound = new Audio('gun.mp3');

window.addEventListener('keydown', function(event) {
	if ((gameState == GameState.LossScreen || gameState == GameState.WinScreen)
			&& !keyState.A && !keyState.D && !keyState.Space) {
		gameState = GameState.StartMenu;
	}

	if (gameState == GameState.SplashScreen) {
		gameState = GameState.StartMenu;
	}

	shiftPressed = event.shiftKey;
	switch (event.code) {
		case "KeyA":
			keyState.A = true;
			break;
		case "KeyD":
			keyState.D = true;
			break;
		case "Space":
			keyState.Space = true;
			break;
		case "KeyP":
			if (gameState == GameState.Paused)
				gameState = GameState.Running;
			else
				gameState = GameState.Paused;
			break;
	}

});
window.addEventListener('keyup', function(event) {
	switch (event.code) {
		case "KeyA":
			keyState.A = false;
			break;
		case "KeyD":
			keyState.D = false;
			break;
		case "Space":
			keyState.Space = false;
			break;
	}
});

window.addEventListener('click', function(event) {
	if (mouseWithinBounds(event, 237, 568, 569, 681) && gameState == GameState.StartMenu) {
		gameState = GameState.Running;
	}

	if (mouseWithinBounds(event, 237, 669, 569, 780) && gameState == GameState.StartMenu) {
		gameState = GameState.ControlsMenu;
		console.log('ran');
	}

	if (mouseWithinBounds(event, 12, 7, 130, 61) && gameState == GameState.ControlsMenu) {
		gameState = GameState.StartMenu;
	}
});

splashScreen();
