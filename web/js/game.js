import {MAPS, MAP_IMAGE} from './maps.js';
import {ENEMY_SIZE, ENEMY_START_HP, ENEMY_HP_COEF, ENEMY_IMAGE} from './enemy.js';
import {drawMap, redraw} from './drawing.js';
import {update} from './updating.js';
import {splitIntoTiles, recordScore} from './game_utils.js';
import {MORTAR_BULLET_IMAGE, MORTAR_SHELL_IMAGE} from './turret.js';

const WAVE_FREQUENCY = 800;
const BASE_TIME_COEF = 1;
const MAX_TIME_COEF = 4;
const TILE_SIZE = 5;
const START_CASH = 35;
const START_LIVES = 10;

const game = {
    kills: 0,
    score: 0,
    spent: 0,
    cash: START_CASH,
    lives: START_LIVES,

    ticks: 0,
    wave: 0,
    lastWave: 0,
    lastTimestamp: Date.now(),
    paused: true,
    fast: false,
    timeCoef: 1,

    map: MAPS.baseMap,
    tiles: {},

    selection: false,

    enemies: {
        id: [],
        hp: ENEMY_START_HP,
        hpMultiplier: ENEMY_HP_COEF[1],
        img: null,
    },

    turrets: [],
    bullets: [],

    initialize: ({context, width, height}) => {
        game.context = context;
        game.widthArea = width;
        game.heightArea = height;

        game.map.img = new Image();
        game.map.img.src = MAP_IMAGE;

        drawMap({
            ctx: game.context,
            boxWidth: game.widthArea,
            boxHeight: game.heightArea,
            map: game.map,
        });

        game.enemies.img = new Image();
        game.enemies.img.src = ENEMY_IMAGE;

        game.bullets.mortarImg = new Image();
        game.bullets.mortarImg.src = MORTAR_BULLET_IMAGE;

        game.bullets.mortarShellImg = new Image();
        game.bullets.mortarShellImg.src = MORTAR_SHELL_IMAGE;

        splitIntoTiles(game.context, game.tiles, TILE_SIZE);

        game.enemyStart = {
            x: game.map[0].x - ENEMY_SIZE,
            y: game.map[0].y,
        };
    },
    tick: () => {
        const currentTimeStamp = Date.now();
        const deltaTime = game.timeCoef * (currentTimeStamp - game.lastTimestamp) * 0.001; //сколько секунд прошло с прошлого кадра
        game.lastTimestamp = currentTimeStamp;

        // processMouseEvents({
        //     dt: deltaTime
        // });
        update({
            map: game.map,
            enemies: game.enemies.id,
            turrets: game.turrets,
            bullets: game.bullets,
            dt: deltaTime,
        });
        redraw({
            ctx: game.context,
            boxWidth: game.widthArea,
            boxHeight: game.heightArea,
            map: game.map,
            enemies: game.enemies.id,
            turrets: game.turrets,
            bullets: game.bullets,
            dt: deltaTime,
        });
        game.ticks++;
        game.scoring();

        if (!game.paused) {
            requestAnimationFrame(game.tick);
        }
    },
    start: () => {
        game.paused = false;
        game.lastTimestamp = Date.now();
        game.tick();
        return 'Pause';
    },
    pause: () => {
        game.paused = true;
        return 'Start';
    },
    end: () => {
        game.pause();
        recordScore(game.score);
        $('#end_game_modal').modal('show');
    },
    scoring: function() {
        this.score = this.kills * this.wave + this.spent;
    },
};

export {
    TILE_SIZE,
    WAVE_FREQUENCY,
    BASE_TIME_COEF,
    MAX_TIME_COEF,
    game,
};
