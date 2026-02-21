// ===== CANVAS =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Adjust canvas size on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.height;
  // Reposition players and other elements if needed, or scale them
});

// ===== GAME STATES (Combined & Enhanced) =====
const GAME_STATE = {
  MENU: 'menu',
  LEVEL_SELECT: 'level_select', // For choosing levels with stars
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  SHOP: 'shop'
};

let currentGameState = GAME_STATE.MENU; // Start with a menu state
let selectedLevel = 1; // Track the currently selected level

// NEW: Define star thresholds for levels
// Customize these values as you balance your game!
const LEVEL_STAR_THRESHOLDS = {
    1: { oneStar: 500, twoStars: 1000, threeStars: 1500 },
    2: { oneStar: 700, twoStars: 1400, threeStars: 2100 },
    3: { oneStar: 900, twoStars: 1800, threeStars: 2700 },
    4: { oneStar: 1100, twoStars: 2200, threeStars: 3300 },
    5: { oneStar: 1500, twoStars: 3000, threeStars: 4500 }, // Boss level example
    // Add more levels explicitly, or rely on the generic calculation below.
};

// Function to get thresholds for a given level, with a fallback calculation
function getStarThresholds(level) {
    if (LEVEL_STAR_THRESHOLDS[level]) {
        return LEVEL_STAR_THRESHOLDS[level];
    }
    // Generic calculation for levels not explicitly defined
    const baseScore = 200 * level;
    return {
        oneStar: baseScore,
        twoStars: baseScore * 2.5, // Make 2 and 3 stars harder for generic levels
        threeStars: baseScore * 4
    };
}

// ===== SAVE (Enhanced) =====
let save = JSON.parse(localStorage.getItem("spaceSave")) || {
  coins: 0,
  damage: 1,
  fireRate: 1,
  bulletSpeed: 8, // Player bullet speed
  playerHealth: 3, // Base player health
  achievements: {}, // For tracking game accomplishments
  levelStars: {}, // Store stars earned per level {1: 3, 2: 2}
  maxLevelReached: 1 // Track highest level unlocked for level select
};
const saveGame = () => localStorage.setItem("spaceSave", JSON.stringify(save));

// ===== AUDIO MANAGER (Your Original - Reintegrated) =====
class AudioManager{
  play(name){
    // This is where you would add your actual sound playing logic.
    // Example:
    /*
    const sound = new Audio(`path/to/sounds/${name}.wav`);
    sound.play();
    */
  }
}
const audio = new AudioManager();

// ===== SCREEN SHAKE (Your Original - Reintegrated) =====
let shake = 0;
function applyShake(){
  if(shake>0){
    ctx.translate((Math.random()-0.5)*shake,(Math.random()-0.5)*shake);
    shake*=0.9;
  }
}

// ===== STARFIELD (Your Original - Reintegrated) =====
class Starfield{
  constructor(n=120){
    this.stars=[];
    for(let i=0;i<n;i++){
      this.stars.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        s:Math.random()*2+0.5 // Speed based on size
      });
    }
  }
  update(){
    this.stars.forEach(st=>{
      st.y+=st.s;
      if(st.y>canvas.height){
        st.y=0; st.x=Math.random()*canvas.width; // Reset to top when off-screen
      }
    });
  }
  draw(){
    ctx.fillStyle="white";
    this.stars.forEach(st=>ctx.fillRect(st.x,st.y,2,2));
  }
}
const starfield = new Starfield();

// ===== INPUT (Enhanced for new states and cooldowns) =====
const keys = {};
const KEY_COOLDOWN = {}; // To prevent rapid key spamming for shop/menu actions

window.addEventListener("keydown", e => {
  keys[e.key] = true;

  // Handle key cooldown for menu/shop actions
  if (KEY_COOLDOWN[e.key]) return; // If key is on cooldown, ignore

  let handled = false; // Flag to indicate if a key press has been handled for cooldown

  switch (currentGameState) {
    case GAME_STATE.MENU:
      if (e.key === 'Enter') {
        currentGameState = GAME_STATE.LEVEL_SELECT; // Go to level select from menu
        handled = true;
      }
      break;
    case GAME_STATE.LEVEL_SELECT:
      if (e.key === 'ArrowUp') {
        selectedLevel = Math.max(1, selectedLevel - 1);
        handled = true;
      } else if (e.key === 'ArrowDown') {
        selectedLevel = Math.min(save.maxLevelReached, selectedLevel + 1);
        handled = true;
      } else if (e.key === 'Enter') {
        game.level = selectedLevel; // Set game's internal level to selected
        currentGameState = GAME_STATE.PLAYING;
        game.resetGame(); // Start the game on the selected level
        handled = true;
      } else if (e.key === 'Escape') {
        currentGameState = GAME_STATE.MENU;
        handled = true;
      }
      break;
    case GAME_STATE.GAME_OVER:
      if (e.key === 'Enter') {
        currentGameState = GAME_STATE.LEVEL_SELECT; // Back to level select from game over
        handled = true;
      }
      break;
    case GAME_STATE.PLAYING:
      if (e.key === 'p') { // Pause with 'P'
        currentGameState = GAME_STATE.PAUSED;
        handled = true;
      } else if (e.key === 'b') { // Go to shop with 'B'
        currentGameState = GAME_STATE.SHOP;
        handled = true;
      }
      // Player shoot keys also need a cooldown to avoid firing too fast before actual cooldown kicks in
      if (e.key === game.p1.shootKey) {
          game.shoot(game.p1);
          handled = true; // Still handle for a slight input debounce
      }
      if (e.key === game.p2.shootKey) {
          game.shoot(game.p2);
          handled = true; // Still handle for a slight input debounce
      }
      break;
    case GAME_STATE.PAUSED:
      if (e.key === 'p') { // Unpause with 'P'
        currentGameState = GAME_STATE.PLAYING;
        handled = true;
      }
      break;
    case GAME_STATE.SHOP:
      if (e.key === 'Escape') { // Exit shop with 'Escape'
        currentGameState = GAME_STATE.PLAYING;
        handled = true;
      }
      // Handle shop purchases with numerical keys
      if (e.key >= '1' && e.key <= '4') { // Assuming 4 shop items for now
          const itemIndex = parseInt(e.key) - 1;
          if (itemIndex < game.shopItems.length) {
              game.buyShopItem(game.shopItems[itemIndex]);
              handled = true;
          }
      }
      break;
  }

  // Apply cooldown for handled actions (mainly for menu/shop interaction)
  if (handled && e.key!== game.p1.shootKey && e.key!== game.p2.shootKey) {
      KEY_COOLDOWN[e.key] = true;
      setTimeout(() => { KEY_COOLDOWN[e.key] = false; }, 200); // 200ms debounce
  }
});
window.addEventListener("keyup", e => keys[e.key] = false);

// ===== MOBILE (Enhanced for new states) =====
let touchX = null;
let touchY = null;
canvas.addEventListener("touchstart", e => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;

  switch(currentGameState) {
    case GAME_STATE.PLAYING:
      if (e.touches[0].clientX < canvas.width / 2) {
        game.shoot(game.p1);
      } else {
        game.shoot(game.p2);
      }
      break;
    case GAME_STATE.MENU:
    case GAME_STATE.GAME_OVER:
      currentGameState = GAME_STATE.LEVEL_SELECT; // Go to level select
      break;
    case GAME_STATE.LEVEL_SELECT:
      game.level = selectedLevel;
      currentGameState = GAME_STATE.PLAYING;
      game.resetGame();
      break;
    case GAME_STATE.PAUSED: // Tapping while paused resumes
        currentGameState = GAME_STATE.PLAYING;
        break;
    case GAME_STATE.SHOP: // Tapping while in shop exits
        currentGameState = GAME_STATE.PLAYING;
        break;
  }
});
canvas.addEventListener("touchmove", e => {
  e.preventDefault(); // Prevent scrolling
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
});
canvas.addEventListener("touchend", () => {
  touchX = null;
  touchY = null;
});

// ===== PLAYER (Enhanced for power-ups and consolidated controls) =====
class Player{
  constructor(x,color,leftKey,rightKey,shootKey, isMobileControlled = false){ // Renamed params for clarity
    this.x=x;
    this.y=canvas.height-80;
    this.w=40;
    this.h=40;
    this.speed=6;
    this.color=color;
    this.leftKey=leftKey; // Storing key assignments directly
    this.rightKey=rightKey;
    this.shootKey=shootKey;
    this.cool=0; // Original cooldown property
    this.hp=save.playerHealth;
    this.maxHp = save.playerHealth; // For display and healing
    this.weapon="normal"; // Your original weapon type, can be used for spread shot
    this.isInvincible = false;
    this.invincibilityTimer = 0;

    // NEW: Power-up related properties
    this.powerUp = null; // Stores current power-up type
    this.powerUpTimer = 0; // Duration of power-up
    this.bulletDamageMultiplier = 1; // For damage power-up
    this.fireRateMultiplier = 1; // For fire rate power-up
    this.bulletSpeedMultiplier = 1; // For bullet speed power-up (if added)
    this.isMobileControlled = isMobileControlled; // If player responds to touch input
  }

  move(){
    // Mobile controls (only for Player 1 now, or based on isMobileControlled)
    if (touchX!== null && this.isMobileControlled) {
      this.x += (touchX - this.x - (this.w / 2)) * 0.15;
    }

    // Keyboard controls
    if(keys[this.leftKey]) this.x-=this.speed;
    if(keys[this.rightKey]) this.x+=this.speed;
    this.x=Math.max(0,Math.min(canvas.width-this.w,this.x));
  }

  takeDamage() {
    if (!this.isInvincible) {
      this.hp--;
      audio.play("player_hit"); // Example sound
      if (this.hp <= 0) {
        game.gameOver();
      } else {
        this.isInvincible = true;
        this.invincibilityTimer = 120; // 2 seconds at 60 FPS
      }
    }
  }

  applyPowerUp(type) {
    if (type!== 'heal') {
        this.removePowerUp(); // Clear previous power-up effects first
        this.powerUp = type;
        this.powerUpTimer = 300; // 5 seconds duration
    }

    switch (type) {
      case 'damage': this.bulletDamageMultiplier = 2; break;
      case 'firerate': this.fireRateMultiplier = 2; break;
      case 'shield':
        this.isInvincible = true;
        this.invincibilityTimer = 300; // Power-up duration
        break;
      case 'heal': this.hp = Math.min(this.maxHp, this.hp + 1); break;
    }
    audio.play("powerup_pickup"); // Example sound
  }

  removePowerUp() {
    this.powerUp = null;
    this.bulletDamageMultiplier = 1;
    this.fireRateMultiplier = 1;
    this.bulletSpeedMultiplier = 1;
    if (this.isInvincible && this.invincibilityTimer > 0 && this.invincibilityTimer <= 1) {
        this.isInvincible = false;
    }
  }

  update(){
    this.move();
    if(this.cool>0) this.cool--; // Player's bullet cooldown

    if (this.isInvincible) {
      this.invincibilityTimer--;
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
      }
    }

    if (this.powerUp!== null && this.powerUp!== 'heal') {
        this.powerUpTimer--;
        if (this.powerUpTimer <= 0) {
            this.removePowerUp();
        }
    }
  }

  draw(){
    ctx.fillStyle = this.isInvincible && Math.floor(this.invincibilityTimer / 10) % 2 === 0? "lightgray" : this.color;
    ctx.fillRect(this.x,this.y,this.w,this.h);

    // Draw HP bar or text
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`HP: ${this.hp}`, this.x + this.w / 2, this.y + this.h + 15);

    // Draw power-up indicator
    if (this.powerUp && this.powerUp!== 'heal') {
        ctx.fillStyle = "gold";
        ctx.fillText(`${this.powerUp.toUpperCase()} (${Math.ceil(this.powerUpTimer/60)}s)`, this.x + this.w / 2, this.y + this.h + 30);
    }
  }
}

// ===== BULLET (Enhanced for enemy bullets and speed) =====
class Bullet{
  constructor(x,y,power,speed,enemy=false, spreadOffset=0){ // Added spreadOffset
    this.x=x; this.y=y;
    this.size=5;
    this.power=power;
    this.speed=speed;
    this.enemy=enemy;
    this.spreadOffset = spreadOffset; // For spread shot bullet x adjustment
  }
  update(){
    this.y += this.enemy? this.speed : -this.speed;
    // For spread shot, you might want to adjust x based on spreadOffset gradually
    // For now, it's just an initial offset.
    // This.x += this.spreadOffset / 10; // Simple outward movement example
  }
  draw(){
    ctx.fillStyle=this.enemy?"red":"yellow";
    ctx.fillRect(this.x + this.spreadOffset,this.y,this.size,this.size); // Apply spread offset here
  }
  isOffScreen() {
    return this.y + this.size < 0 || this.y > canvas.height;
  }
}

// ===== ENEMY (Enhanced for types and shooting) =====
class Enemy{
  constructor(x,y,type,level){ // Added type for different enemy behaviors
    this.x=x; this.y=y;
    this.type=type;
    this.size=30;
    this.hp=1+level*0.4;
    this.speed=2+level*0.15;
    this.damage = 1; // Damage dealt to player

    // NEW: Enemy shooting properties
    this.canShoot = type === "sniper" || type === "shooter"; // Only certain types shoot
    this.shootCooldown = 0;
    this.fireRate = 60; // 1 shot per second for enemy
  }
  update(player){ // Takes target player for aiming
    // Movement based on type
    if (this.type === "zigzag")
      this.x += Math.sin(this.y * 0.05) * 3;
    else if (this.type === "kamikaze")
      this.y += this.speed * 1.7;
    else if (this.type === "sniper" || this.type === "shooter" || this.type === "normal")
      this.x += (player.x + player.w / 2 - this.x - this.size / 2) * 0.01; // Aim at player center

    this.y+=this.speed;

    // Enemy shooting logic
    if (this.canShoot && this.y > 0 && currentGameState === GAME_STATE.PLAYING) { // Only shoot if on screen and game playing
        this.shootCooldown--;
        if (this.shootCooldown <= 0) {
            game.enemyShoot(this);
            this.shootCooldown = this.fireRate;
        }
    }
  }
  draw(){
    ctx.fillStyle = this.type === "sniper"? "pink" : this.type === "shooter"? "darkred" : "red";
    ctx.fillRect(this.x,this.y,this.size,this.size);
  }
  isOffScreen() {
    return this.y > canvas.height;
  }
}

// ===== BOSS (Enhanced for shooting) =====
class Boss{
  constructor(level){
    this.x=canvas.width/2-80;
    this.y=-150;
    this.w=160; this.h=160;
    this.hp=60+level*10;
    this.maxHp=this.hp;
    this.cool=0; // Your original cool property
    this.damage = 2; // Damage dealt to player

    // NEW: Boss shooting properties
    this.shootCooldown = 0;
    this.fireRate = 90; // Boss shoots less frequently than regular enemies
  }
  update(){
    // Boss moves down until it reaches targetY
    const targetY = 80; // Combined your original 80 with the targetY concept
    if (this.y < targetY) {
      this.y += 0.5;
    } else {
      this.y = targetY; // Ensure it stays at target Y
      // Boss shooting logic when in position
      this.shootCooldown--;
      if (this.shootCooldown <= 0 && currentGameState === GAME_STATE.PLAYING) {
          game.bossShoot(this);
          this.shootCooldown = this.fireRate;
      }
    }
    this.x+=Math.sin(Date.now()*0.002)*3;
    this.x = Math.max(0, Math.min(canvas.width - this.w, this.x)); // Keep boss in bounds
  }
  draw(){
    ctx.fillStyle="purple";
    ctx.fillRect(this.x,this.y,this.w,this.h);

    ctx.fillStyle="gray"; // Background for HP bar
    ctx.fillRect(canvas.width/2-75,this.y-20,150,10);
    ctx.fillStyle="lime";
    ctx.fillRect(
      canvas.width/2-75,
      this.y-20,
      150*(this.hp/this.maxHp),
      10
    );
    ctx.strokeStyle = "black";
    ctx.strokeRect(canvas.width/2-75,this.y-20,150,10); // Border for HP bar
  }
}

// ===== POWERUP (New Class) =====
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'damage', 'firerate', 'shield', 'heal'
        this.size = 20;
        this.speed = 1;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        let color;
        switch (this.type) {
            case 'damage': color = 'red'; break;
            case 'firerate': color = 'blue'; break;
            case 'shield': color = 'lime'; break;
            case 'heal': color = 'green'; break;
            default: color = 'white'; break;
        }
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type.charAt(0).toUpperCase(), this.x + this.size / 2, this.y + this.size / 2 + 3);
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

// ===== PARTICLE (Your Original) =====
class Particle {
  constructor(x, y, color = "white") {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 6 - 3;
    this.vy = Math.random() * 6 - 3;
    this.life = 25;
    this.color = color;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
  isDead() {
    return this.life <= 0;
  }
}

// ===== GAME (Combined & Enhanced Logic) =====
class Game{
  constructor(){
    // Player setup using consolidated controls and mobile flag
    this.p1=new Player(canvas.width / 2 - 60,"cyan","ArrowLeft","ArrowRight"," ", true);
    this.p2=new Player(canvas.width / 2 + 60,"orange","a","d","Enter", false);
    this.bullets=[]; // Player bullets
    this.enemyBullets=[]; // NEW: Enemy bullets
    this.enemies=[];
    this.particles=[]; // For explosions
    this.powerUps=[]; // NEW: Collectible power-ups
    this.boss=null;
    this.level=selectedLevel; // Initialized with currently selected level
    this.score=0; // Score for current level attempt
    this.coins=save.coins;
    this.isGameOver=false;

    // NEW: Shop items defined here
    this.shopItems = [
        { id: 'damage', name: "Increase Damage", cost: 10, effect: () => { save.damage++; }, current: () => `Current: ${save.damage}` },
        { id: 'firerate', name: "Increase Fire Rate", cost: 15, effect: () => { save.fireRate += 0.5; }, current: () => `Current: ${save.fireRate}` },
        { id: 'maxhp', name: "Increase Max HP", cost: 20, effect: () => { save.playerHealth++; }, current: () => `Current: ${save.playerHealth}` },
        { id: 'bulletspeed', name: "Increase Bullet Speed", cost: 12, effect: () => { save.bulletSpeed += 1; }, current: () => `Current: ${save.bulletSpeed}` }
    ];

    this.resetGame(); // Initialize game state on creation
  }

  resetGame() {
    // Reset players, applying saved stats and max HP
    this.p1=new Player(canvas.width / 2 - 60,"cyan","ArrowLeft","ArrowRight"," ", true);
    this.p2=new Player(canvas.width / 2 + 60,"orange","a","d","Enter", false);
    this.p1.hp = save.playerHealth;
    this.p1.maxHp = save.playerHealth;
    this.p2.hp = save.playerHealth;
    this.p2.maxHp = save.playerHealth;

    // Clear all active game elements
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerUps = [];
    this.boss = null;

    this.level = selectedLevel; // Crucial: Start at the selected level
    this.score = 0;
    this.coins = save.coins; // Ensure coins reflect saved value
    this.isGameOver = false;
    currentGameState = GAME_STATE.PLAYING; // Ensure game starts playing

    this.spawn(); // Spawn initial enemies for the selected level
  }

  spawn(){
    // Enemy types including new 'shooter' and your original 'normal'
    const types = ["normal", "zigzag", "kamikaze", "sniper", "shooter"];
    const enemiesToSpawn = 6 + this.level * 2; // Scaled up enemy count for more action

    for(let i=0;i<enemiesToSpawn;i++){
      this.enemies.push(
        new Enemy(
          Math.random()*(canvas.width - 30), // Ensure enemy spawns within width
          -Math.random()*600 - 50, // Spawn further off screen for smoother entry
          types[Math.floor(Math.random()*types.length)], // Random type selection
          this.level
        )
      );
    }
    if(this.level%5===0) this.boss=new Boss(this.level); // Boss every 5 levels
  }

  // Your original nearest player logic
  nearest(enemy){
    return Math.abs(enemy.x-this.p1.x)<Math.abs(enemy.x-this.p2.x)
     ? this.p1 : this.p2;
  }

  shoot(p){
    // Apply combined player and power-up cooldowns/multipliers
    if(p.cool > 0) return;

    const bulletDamage = save.damage * p.bulletDamageMultiplier;
    const bulletFireRateCooldown = Math.max(1, 20 / (save.fireRate * p.fireRateMultiplier)); // Min cooldown of 1
    const bulletSpeed = save.bulletSpeed * p.bulletSpeedMultiplier;

    if(p.weapon==="spread"){ // Your original spread shot logic
      for(let i=-1;i<=1;i++)
        this.bullets.push(
          new Bullet(p.x+20, p.y, bulletDamage, bulletSpeed, false, i*10) // Pass spreadOffset
        );
    }else{ // Normal shot
      this.bullets.push(
        new Bullet(p.x+20, p.y, bulletDamage, bulletSpeed)
      );
    }
    p.cool = bulletFireRateCooldown;
    audio.play("player_shoot"); // Example sound
  }

  // NEW: Enemy shoots
  enemyShoot(enemy) {
      this.enemyBullets.push(new Bullet(enemy.x + enemy.size / 2 - 2, enemy.y + enemy.size, enemy.damage, 5, true));
      audio.play("enemy_shoot"); // Example sound
  }

  // NEW: Boss shoots
  bossShoot(boss) {
      // Boss could shoot multiple bullets or special patterns
      this.enemyBullets.push(new Bullet(boss.x + boss.w / 2 - 15, boss.y + boss.h, boss.damage, 4, true));
      this.enemyBullets.push(new Bullet(boss.x + boss.w / 2 + 15, boss.y + boss.h, boss.damage, 4, true));
      audio.play("boss_shoot"); // Example sound
  }

  // NEW: Check for star achievement and unlock next level
  checkStars() {
      const thresholds = getStarThresholds(this.level);
      let starsEarned = 0;
      if (this.score >= thresholds.threeStars) {
          starsEarned = 3;
      } else if (this.score >= thresholds.twoStars) {
          starsEarned = 2;
      } else if (this.score >= thresholds.oneStar) {
          starsEarned = 1;
      }

      // Update saved stars only if we earned more than previously
      if (!save.levelStars[this.level] || starsEarned > save.levelStars[this.level]) {
          save.levelStars[this.level] = starsEarned;
          saveGame();
          console.log(`Level ${this.level} - Earned ${starsEarned} stars!`);
          audio.play("stars_earned"); // Example sound
      }

      // Unlock next level if they got at least one star on this level
      if (starsEarned > 0 && this.level >= save.maxLevelReached) {
          save.maxLevelReached = this.level + 1; // Unlock next level
          saveGame();
          console.log(`Level ${this.level + 1} unlocked!`);
          audio.play("level_unlocked"); // Example sound
      }
  }

  gameOver() {
    this.isGameOver = true;
    currentGameState = GAME_STATE.GAME_OVER;
    this.checkStars(); // Check for stars when game over
    audio.play("game_over"); // Example sound
  }

  update(){
    // Only update game elements if game is in PLAYING state
    if (currentGameState!== GAME_STATE.PLAYING) return;

    this.p1.update();
    this.p2.update();

    // Player shooting handled in keydown for better responsiveness, cooldown handles rate

    this.bullets.forEach(b=>b.update());
    this.enemyBullets.forEach(b=>b.update()); // Update enemy bullets

    this.enemies.forEach(e=>{
      const target=this.nearest(e); // Your original nearest player logic
      e.update(target);
    });

    if(this.boss) this.boss.update();

    // Remove off-screen/dead objects
    this.bullets = this.bullets.filter(b =>!b.isOffScreen());
    this.enemyBullets = this.enemyBullets.filter(b =>!b.isOffScreen());
    this.enemies = this.enemies.filter(e =>!e.isOffScreen());
    this.powerUps = this.powerUps.filter(pu =>!pu.isOffScreen());
    this.particles = this.particles.filter(p =>!p.isDead());

    // Collision detection (Player Bullets vs Enemies/Boss)
    for(let i=this.bullets.length-1;i>=0;i--){
      let b=this.bullets[i];

      // Check against enemies
      for(let j=this.enemies.length-1;j>=0;j--){
        let e=this.enemies[j];
        if(b.x + b.spreadOffset < e.x+e.size && b.x + b.spreadOffset + b.size > e.x &&
           b.y < e.y+e.size && b.y+b.size > e.y){
          e.hp-=b.power;
          for (let k = 0; k < 5; k++) this.particles.push(new Particle(b.x, b.y, "orange")); // Hit particles
          this.bullets.splice(i,1); // Remove bullet
          audio.play("enemy_hit"); // Example sound
          if(e.hp<=0){
            this.enemies.splice(j,1);
            this.coins+=2;
            this.score+=10; // Award score for enemy kill
            shake=10; // Screen shake on enemy kill
            for (let k = 0; k < 15; k++) this.particles.push(new Particle(e.x + e.size / 2, e.y + e.size / 2, "red")); // Explosion particles
            audio.play("enemy_explode"); // Example sound

            // Random chance for power-up drop
            if (Math.random() < 0.15) {
                const types = ['damage', 'firerate', 'shield', 'heal'];
                const randomType = types[Math.floor(Math.random() * types.length)];
                this.powerUps.push(new PowerUp(e.x + e.size / 2 - 10, e.y + e.size / 2 - 10, randomType));
            }
          }
          break; // Bullet hit an enemy, stop checking other enemies for this bullet
        }
      }

      // Check against boss
      if (this.boss &&!b.enemy) { // Only player bullets hit boss
        if(b.x + b.spreadOffset < this.boss.x+this.boss.w && b.x + b.spreadOffset + b.size > this.boss.x &&
           b.y < this.boss.y+this.boss.h && b.y+b.size > this.boss.y){
          this.boss.hp-=b.power;
          for (let k = 0; k < 10; k++) this.particles.push(new Particle(b.x, b.y, "purple")); // Hit particles
          this.bullets.splice(i,1); // Remove bullet
          audio.play("boss_hit"); // Example sound
          if(this.boss.hp<=0){
            for (let k = 0; k < 50; k++) this.particles.push(new Particle(this.boss.x + this.boss.w / 2, this.boss.y + this.boss.h / 2, "darkmagenta"));
            this.boss = null;
            this.coins += 20;
            this.score += 100;
            shake=20; // Bigger shake for boss
            audio.play("boss_explode"); // Example sound
          }
          break; // Bullet hit boss, stop checking other enemies for this bullet
        }
      }
    }

    // Collision detection (Enemies/Boss vs Players, Enemy Bullets vs Players, Power-ups vs Players)
    [this.p1, this.p2].forEach(player => {
      // Enemies colliding with player
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        let e = this.enemies[j];
        if (player.x < e.x+e.size && player.x+player.w > e.x &&
            player.y < e.y+e.size && player.y+player.h > e.y) {
          player.takeDamage();
          this.enemies.splice(j,1); // Enemy destroyed on impact
          this.coins += 1; // Small coin reward
          for (let k = 0; k < 15; k++) this.particles.push(new Particle(e.x + e.size / 2, e.y + e.size / 2, "red"));
          shake=10;
        }
      }

      // Boss colliding with player
      if (this.boss) {
        if (player.x < this.boss.x+this.boss.w && player.x+player.w > this.boss.x &&
            player.y < this.boss.y+this.boss.h && player.y+player.h > this.boss.y) {
          player.takeDamage();
          shake=10;
        }
      }

      // Enemy Bullets colliding with player
      for (let j = this.enemyBullets.length - 1; j >= 0; j--) {
        let eb = this.enemyBullets[j];
        if (player.x < eb.x+eb.size && player.x+player.w > eb.x &&
            player.y < eb.y+eb.size && player.y+player.h > eb.y) {
          player.takeDamage();
          this.enemyBullets.splice(j,1); // Remove enemy bullet on hit
          for (let k = 0; k < 5; k++) this.particles.push(new Particle(eb.x, eb.y, "darkred"));
          shake=5;
        }
      }

      // Power-ups colliding with player
      for (let j = this.powerUps.length - 1; j >= 0; j--) {
        let pu = this.powerUps[j];
        if (player.x < pu.x+pu.size && player.x+player.w > pu.x &&
            player.y < pu.y+pu.size && player.y+player.h > pu.y) {
          player.applyPowerUp(pu.type);
          this.powerUps.splice(j,1); // Remove power-up on collection
          for (let k = 0; k < 10; k++) this.particles.push(new Particle(pu.x, pu.y, "gold"));
        }
      }
    });

    // Level progression
    if(this.enemies.length===0 &&!this.boss){
      // Current level completed!
      this.checkStars(); // Check for stars upon successful completion
      audio.play("level_complete"); // Example sound

      // If playing the highest unlocked level, unlock the next one.
      if (this.level >= save.maxLevelReached) {
          save.maxLevelReached = this.level + 1;
          saveGame();
      }

      // Automatically advance to the next level if the current one is cleared
      this.level++;
      selectedLevel = this.level; // Set selectedLevel to the next for continuity
      this.score = 0; // Reset score for the new level
      this.spawn(); // Spawn enemies for the next level
    }

    save.coins = this.coins; // Update coins in save (no need to saveGame every frame)
  }

  draw(){
    // Always clear and draw starfield, even in menus/paused
    ctx.clearRect(0,0,canvas.width,canvas.height);
    starfield.update();
    starfield.draw();

    // Apply screen shake *before* drawing game elements that should shake
    ctx.save(); // Save context state before applying shake
    applyShake();

    if (currentGameState === GAME_STATE.MENU) {
      this.drawMenu();
    } else if (currentGameState === GAME_STATE.LEVEL_SELECT) {
      this.drawLevelSelect();
    } else if (currentGameState === GAME_STATE.GAME_OVER) {
      this.drawGameOver();
    } else if (currentGameState === GAME_STATE.PAUSED) {
      // When paused, draw current game state then overlay paused screen
      this.drawPlayingElements(); // Draw everything that was on screen
      this.drawPaused();
      this.drawHUD(); // Keep HUD visible
    } else if (currentGameState === GAME_STATE.SHOP) {
      // When in shop, draw current game state then overlay shop
      this.drawPlayingElements(); // Draw everything that was on screen
      this.drawShop();
      this.drawHUD(); // Keep HUD visible
    } else if (currentGameState === GAME_STATE.PLAYING) {
      // Draw all active game elements
      this.drawPlayingElements();
      this.drawHUD(); // Draw Heads-Up Display
    }

    ctx.restore(); // Restore context state after shake
  }

  drawPlayingElements() {
    this.p1.draw();
    this.p2.draw();
    this.bullets.forEach(b=>b.draw());
    this.enemyBullets.forEach(b=>b.draw());
    this.enemies.forEach(e=>e.draw());
    this.powerUps.forEach(pu=>pu.draw());
    this.particles.forEach(p=>p.draw());
    if(this.boss) this.boss.draw();
  }

  drawHUD() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Level: ${this.level}`, 10, 30);
    ctx.fillText(`Coins: ${this.coins}`, 10, 60);
    ctx.fillText(`Score: ${this.score}`, 10, 90);
    ctx.font = "16px Arial";
    ctx.fillText(`Press 'P' to Pause`, 10, 120);
    ctx.fillText(`Press 'B' for Shop`, 10, 145);
  }

  drawMenu() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SPACE SHOOTER", canvas.width / 2, canvas.height / 2 - 80);
    ctx.font = "24px Arial";
    ctx.fillText("Press ENTER to Start (Level Select)", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Player 1: Arrow Keys to Move, SPACE to Shoot", canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText("Player 2: A/D to Move, ENTER to Shoot", canvas.width / 2, canvas.height / 2 + 80);
    ctx.fillText("Mobile: Tap left/right to shoot (P1/P2), drag to move (P1)", canvas.width / 2, canvas.height / 2 + 110);
  }

  drawLevelSelect() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Semi-transparent overlay
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SELECT LEVEL", canvas.width / 2, 80);

      ctx.font = "28px Arial";
      let yOffset = 150;
      for (let i = 1; i <= save.maxLevelReached; i++) {
          const stars = save.levelStars[i] || 0;
          let levelText = `Level ${i}`;

          ctx.fillStyle = (i === selectedLevel)? "yellow" : "white"; // Highlight selected level

          // Draw stars
          let starDisplay = "";
          for (let s = 0; s < 3; s++) {
              starDisplay += (s < stars)? "⭐" : "☆"; // Unicode stars
          }
          ctx.fillText(`${levelText} ${starDisplay}`, canvas.width / 2, yOffset + (i - 1) * 40);
      }
      // If there are more levels not yet unlocked
      for (let i = save.maxLevelReached + 1; i <= save.maxLevelReached + 3; i++) { // Show a few locked levels
          ctx.fillStyle = "gray";
          ctx.fillText(`Level ${i} (Locked)`, canvas.width / 2, yOffset + (i - 1) * 40);
      }

      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("Use Arrow Up/Down to select, ENTER to Play", canvas.width / 2, yOffset + (Math.max(save.maxLevelReached, 3) * 40) + 50);
      ctx.fillText("Press ESC to return to Menu", canvas.width / 2, yOffset + (Math.max(save.maxLevelReached, 3) * 40) + 80);
  }

  drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 80);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(`Final Score: ${this.score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Coins Collected: ${this.coins}`, canvas.width / 2, canvas.height / 2 + 40);

    // Display stars achieved on this attempt
    const finalThresholds = getStarThresholds(this.level);
    let finalStars = "";
    if (this.score >= finalThresholds.threeStars) finalStars = "⭐⭐⭐";
    else if (this.score >= finalThresholds.twoStars) finalStars = "⭐⭐";
    else if (this.score >= finalThresholds.oneStar) finalStars = "⭐";
    else finalStars = "☆☆☆";

    ctx.fillText(`Stars Earned: ${finalStars}`, canvas.width / 2, canvas.height / 2 + 80);

    ctx.font = "24px Arial";
    ctx.fillText("Press ENTER to return to Level Select", canvas.width / 2, canvas.height / 2 + 140);
  }

  drawPaused() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
      ctx.font = "24px Arial";
      ctx.fillText("Press 'P' to Resume", canvas.width / 2, canvas.height / 2 + 50);
  }

  drawShop() {
      ctx.fillStyle = "rgba(0, 0, 50, 0.9)"; // Darker blue, semi-transparent
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SHOP", canvas.width / 2, 80);
      ctx.font = "24px Arial";
      ctx.fillText(`Your Coins: ${this.coins}`, canvas.width / 2, 140);

      let yPos = 200;
      this.shopItems.forEach((item, index) => {
          ctx.fillText(`${index + 1}. ${item.name} (Cost: ${item.cost} coins) - ${item.current()}`, canvas.width / 2, yPos);
          yPos += 40;
      });

      ctx.font = "20px Arial";
      ctx.fillText("Press 1, 2, 3, 4 to Buy. Press ESC to Exit Shop.", canvas.width / 2, yPos + 50);
  }

  buyShopItem(item) {
      if (this.coins >= item.cost) {
          this.coins -= item.cost;
          item.effect(); // Apply the upgrade
          saveGame(); // Save after purchase
          console.log(`Purchased ${item.name}!`);
          audio.play("purchase"); // Example sound
          // Refresh player stats if it's a direct player stat upgrade
          this.p1.maxHp = save.playerHealth;
          this.p1.hp = Math.min(this.p1.hp, this.p1.maxHp); // Adjust current HP if maxHp increases
          this.p2.maxHp = save.playerHealth;
          this.p2.hp = Math.min(this.p2.hp, this.p2.maxHp);
      } else {
          console.log("Not enough coins!");
          audio.play("error"); // Example sound
      }
  }
}

// ===== ACHIEVEMENTS =====
function unlock(name) {
  // Using console.log and optional audio for now, could be an on-screen popup
  if (!save.achievements[name]) {
    save.achievements[name] = true;
    saveGame();
    console.log("Achievement Unlocked: " + name);
    audio.play("achievement"); // Example sound
  }
}

// ===== LOOP (Ensuring correct state handling) =====
const game = new Game(); // Instantiate game once
function loop(){
  // Update starfield always (background)
  starfield.update();

  // Only update game logic when PLAYING
  if(currentGameState === GAME_STATE.PLAYING) {
      game.update();
      // Save game data periodically, but not every frame unless necessary for a feature.
      // Or save only on state changes (level complete, game over, shop purchase).
      // saveGame(); // Moved saveGame calls to specific events (shop, level complete, game over)
  }

  game.draw();
  requestAnimationFrame(loop);
}
loop(); // Start the game loop
