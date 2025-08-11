// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrickBreaker_instances, _BrickBreaker_canvas, _BrickBreaker_ctx, _BrickBreaker_helperCanvas, _BrickBreaker_helperCanvasCtx, _BrickBreaker_scorePanel, _BrickBreaker_trackTimelineOffset, _BrickBreaker_visibleEntries, _BrickBreaker_brokenBricks, _BrickBreaker_keyDownHandlerBound, _BrickBreaker_keyUpHandlerBound, _BrickBreaker_keyPressHandlerBound, _BrickBreaker_closeGameBound, _BrickBreaker_mouseMoveHandlerBound, _BrickBreaker_boundingElement, _BrickBreaker_gameViewportOffset, _BrickBreaker_running, _BrickBreaker_initialDPR, _BrickBreaker_ballX, _BrickBreaker_ballY, _BrickBreaker_ballDx, _BrickBreaker_ballDy, _BrickBreaker_paddleX, _BrickBreaker_rightPressed, _BrickBreaker_leftPressed, _BrickBreaker_brickHeight, _BrickBreaker_lives, _BrickBreaker_blockCount, _BrickBreaker_paddleLength, _BrickBreaker_minScreenHeight, _BrickBreaker_maxScreenHeight, _BrickBreaker_screenHeightDiff, _BrickBreaker_deltaMultiplier, _BrickBreaker_deltaVectorLength, _BrickBreaker_currentPalette, _BrickBreaker_resetCanvas, _BrickBreaker_closeGame, _BrickBreaker_setUpNewGame, _BrickBreaker_animateFlameChartTopPositioning, _BrickBreaker_keyUpHandler, _BrickBreaker_keyPressHandler, _BrickBreaker_keyDownHandler, _BrickBreaker_mouseMoveHandler, _BrickBreaker_createGame, _BrickBreaker_restartBall, _BrickBreaker_drawBall, _BrickBreaker_drawPaddle, _BrickBreaker_patchBrokenBricks, _BrickBreaker_draw, _BrickBreaker_brickCollisionDetection, _BrickBreaker_random, _BrickBreaker_party, _BrickBreaker_createConfettiElement;
import * as i18n from '../../../../core/i18n/i18n.js';
import * as WindowBounds from '../../../../services/window_bounds/window_bounds.js';
import * as ThemeSupport from '../../theme_support/theme_support.js';
const UIStrings = {
    /**
     *@description Message congratulating the user for having won a game.
     */
    congrats: 'Congrats, you win!',
    /**
     *@description A Postscript hinting the user the possibility to open the game using a keycombo.
     */
    ps: 'PS: You can also open the game by typing `fixme`',
};
const str_ = i18n.i18n.registerUIStrings('ui/legacy/components/perf_ui/BrickBreaker.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const MAX_DELTA = 16;
const MIN_DELTA = 10;
const MAX_PADDLE_LENGTH = 150;
const MIN_PADDLE_LENGTH = 85;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 10;
const colorPallettes = [
    // blues
    {
        light: 'rgb(224,240,255)',
        mediumLighter: 'rgb(176,208,255)',
        mediumDarker: 'rgb(112,160,221)',
        dark: 'rgb(0,92,153)',
    },
    // pinks
    {
        light: 'rgb(253, 216, 229)',
        mediumLighter: 'rgb(250, 157, 188)',
        mediumDarker: 'rgb(249, 98, 154)',
        dark: 'rgb(254, 5, 105)',
    },
    // pastel pinks
    {
        light: 'rgb(254, 234, 234)',
        mediumLighter: 'rgb(255, 216, 216)',
        mediumDarker: 'rgb(255, 195, 195)',
        dark: 'rgb(235, 125, 138)',
    },
    // purples
    {
        light: 'rgb(226,183,206)',
        mediumLighter: 'rgb(219,124,165)',
        mediumDarker: 'rgb(146,60,129)',
        dark: 'rgb(186, 85, 255)',
    },
    // greens
    {
        light: 'rgb(206,255,206)',
        mediumLighter: 'rgb(128,255,128)',
        mediumDarker: 'rgb(0,246,0)',
        dark: 'rgb(0,187,0)',
    },
    // reds
    {
        light: 'rgb(255, 188, 181)',
        mediumLighter: 'rgb(254, 170, 170)',
        mediumDarker: 'rgb(215, 59, 43)',
        dark: 'rgb(187, 37, 23)',
    },
    // aqua
    {
        light: 'rgb(236, 254, 250)',
        mediumLighter: 'rgb(204, 255, 245)',
        mediumDarker: 'rgb(164, 240, 233)',
        dark: 'rgb(72,189,144)',
    },
    // yellow/pink
    {
        light: 'rgb(255, 225, 185)',
        mediumLighter: 'rgb(255, 204, 141)',
        mediumDarker: 'rgb(240, 140, 115)',
        dark: 'rgb(211, 96, 117)',
    },
    // ocean breeze
    {
        light: 'rgb(218, 255, 248)',
        mediumLighter: 'rgb(177, 235, 236)',
        mediumDarker: 'rgb(112, 214, 214)',
        dark: 'rgb(34, 205, 181)',
    },
];
export class BrickBreaker extends HTMLElement {
    constructor(timelineFlameChart) {
        super();
        _BrickBreaker_instances.add(this);
        this.timelineFlameChart = timelineFlameChart;
        _BrickBreaker_canvas.set(this, void 0);
        _BrickBreaker_ctx.set(this, void 0);
        _BrickBreaker_helperCanvas.set(this, void 0);
        _BrickBreaker_helperCanvasCtx.set(this, void 0);
        _BrickBreaker_scorePanel.set(this, void 0);
        _BrickBreaker_trackTimelineOffset.set(this, 0);
        _BrickBreaker_visibleEntries.set(this, new Set());
        _BrickBreaker_brokenBricks.set(this, new Map());
        _BrickBreaker_keyDownHandlerBound.set(this, __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_keyDownHandler).bind(this));
        _BrickBreaker_keyUpHandlerBound.set(this, __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_keyUpHandler).bind(this));
        _BrickBreaker_keyPressHandlerBound.set(this, __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_keyPressHandler).bind(this));
        _BrickBreaker_closeGameBound.set(this, __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_closeGame).bind(this));
        _BrickBreaker_mouseMoveHandlerBound.set(this, __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_mouseMoveHandler).bind(this));
        _BrickBreaker_boundingElement.set(this, WindowBounds.WindowBoundsService.WindowBoundsServiceImpl.instance().getDevToolsBoundingElement());
        // Value by which we moved the game up relative to the viewport
        _BrickBreaker_gameViewportOffset.set(this, 0);
        _BrickBreaker_running.set(this, false);
        _BrickBreaker_initialDPR.set(this, devicePixelRatio);
        _BrickBreaker_ballX.set(this, 0);
        _BrickBreaker_ballY.set(this, 0);
        _BrickBreaker_ballDx.set(this, 0);
        _BrickBreaker_ballDy.set(this, 0);
        _BrickBreaker_paddleX.set(this, 0);
        _BrickBreaker_rightPressed.set(this, false);
        _BrickBreaker_leftPressed.set(this, false);
        _BrickBreaker_brickHeight.set(this, 0);
        _BrickBreaker_lives.set(this, 0);
        _BrickBreaker_blockCount.set(this, 0);
        _BrickBreaker_paddleLength.set(this, MAX_PADDLE_LENGTH);
        _BrickBreaker_minScreenHeight.set(this, 150);
        _BrickBreaker_maxScreenHeight.set(this, 1500);
        _BrickBreaker_screenHeightDiff.set(this, __classPrivateFieldGet(this, _BrickBreaker_maxScreenHeight, "f") - __classPrivateFieldGet(this, _BrickBreaker_minScreenHeight, "f"));
        // Value from 0.1 to 1 that multiplies speed depending on the screen height
        _BrickBreaker_deltaMultiplier.set(this, 0);
        _BrickBreaker_deltaVectorLength.set(this, 0);
        _BrickBreaker_currentPalette.set(this, void 0);
        __classPrivateFieldSet(this, _BrickBreaker_canvas, this.createChild('canvas', 'fill'), "f");
        __classPrivateFieldSet(this, _BrickBreaker_ctx, __classPrivateFieldGet(this, _BrickBreaker_canvas, "f").getContext('2d'), "f");
        __classPrivateFieldSet(this, _BrickBreaker_helperCanvas, document.createElement('canvas'), "f");
        __classPrivateFieldSet(this, _BrickBreaker_helperCanvasCtx, __classPrivateFieldGet(this, _BrickBreaker_helperCanvas, "f").getContext('2d'), "f");
        const randomPaletteIndex = Math.floor(Math.random() * colorPallettes.length);
        __classPrivateFieldSet(this, _BrickBreaker_currentPalette, colorPallettes[randomPaletteIndex], "f");
        __classPrivateFieldSet(this, _BrickBreaker_scorePanel, this.createChild('div'), "f");
        __classPrivateFieldGet(this, _BrickBreaker_scorePanel, "f").classList.add('scorePanel');
        __classPrivateFieldGet(this, _BrickBreaker_scorePanel, "f").style.borderImage =
            'linear-gradient(' + __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").mediumDarker + ',' + __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").dark + ') 1';
        this.initButton();
    }
    initButton() {
        const button = this.createChild('div');
        button.classList.add('game-close-button');
        button.innerHTML = '<b><span style=\'font-size: 1.2em; color: white\'>x</span></b>';
        button.style.background = __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").dark;
        button.style.boxShadow = __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").dark + ' 1px 1px, ' + __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").mediumDarker +
            ' 3px 3px, ' + __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").mediumLighter + ' 5px 5px';
        button.addEventListener('click', __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_closeGame).bind(this));
        this.appendChild(button);
    }
    connectedCallback() {
        __classPrivateFieldSet(this, _BrickBreaker_running, true, "f");
        __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_setUpNewGame).call(this);
        __classPrivateFieldGet(this, _BrickBreaker_boundingElement, "f").addEventListener('keydown', __classPrivateFieldGet(this, _BrickBreaker_keyDownHandlerBound, "f"));
        document.addEventListener('keydown', __classPrivateFieldGet(this, _BrickBreaker_keyDownHandlerBound, "f"), false);
        document.addEventListener('keyup', __classPrivateFieldGet(this, _BrickBreaker_keyUpHandlerBound, "f"), false);
        document.addEventListener('keypress', __classPrivateFieldGet(this, _BrickBreaker_keyPressHandlerBound, "f"), false);
        window.addEventListener('resize', __classPrivateFieldGet(this, _BrickBreaker_closeGameBound, "f"));
        document.addEventListener('mousemove', __classPrivateFieldGet(this, _BrickBreaker_mouseMoveHandlerBound, "f"), false);
        this.tabIndex = 1;
        this.focus();
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _BrickBreaker_boundingElement, "f").removeEventListener('keydown', __classPrivateFieldGet(this, _BrickBreaker_keyDownHandlerBound, "f"));
        window.removeEventListener('resize', __classPrivateFieldGet(this, _BrickBreaker_closeGameBound, "f"));
        document.removeEventListener('keydown', __classPrivateFieldGet(this, _BrickBreaker_keyDownHandlerBound, "f"), false);
        document.removeEventListener('keyup', __classPrivateFieldGet(this, _BrickBreaker_keyUpHandlerBound, "f"), false);
        window.removeEventListener('resize', __classPrivateFieldGet(this, _BrickBreaker_closeGameBound, "f"));
        document.removeEventListener('keypress', __classPrivateFieldGet(this, _BrickBreaker_keyPressHandlerBound, "f"), false);
        document.removeEventListener('mousemove', __classPrivateFieldGet(this, _BrickBreaker_mouseMoveHandlerBound, "f"), false);
    }
}
_BrickBreaker_canvas = new WeakMap(), _BrickBreaker_ctx = new WeakMap(), _BrickBreaker_helperCanvas = new WeakMap(), _BrickBreaker_helperCanvasCtx = new WeakMap(), _BrickBreaker_scorePanel = new WeakMap(), _BrickBreaker_trackTimelineOffset = new WeakMap(), _BrickBreaker_visibleEntries = new WeakMap(), _BrickBreaker_brokenBricks = new WeakMap(), _BrickBreaker_keyDownHandlerBound = new WeakMap(), _BrickBreaker_keyUpHandlerBound = new WeakMap(), _BrickBreaker_keyPressHandlerBound = new WeakMap(), _BrickBreaker_closeGameBound = new WeakMap(), _BrickBreaker_mouseMoveHandlerBound = new WeakMap(), _BrickBreaker_boundingElement = new WeakMap(), _BrickBreaker_gameViewportOffset = new WeakMap(), _BrickBreaker_running = new WeakMap(), _BrickBreaker_initialDPR = new WeakMap(), _BrickBreaker_ballX = new WeakMap(), _BrickBreaker_ballY = new WeakMap(), _BrickBreaker_ballDx = new WeakMap(), _BrickBreaker_ballDy = new WeakMap(), _BrickBreaker_paddleX = new WeakMap(), _BrickBreaker_rightPressed = new WeakMap(), _BrickBreaker_leftPressed = new WeakMap(), _BrickBreaker_brickHeight = new WeakMap(), _BrickBreaker_lives = new WeakMap(), _BrickBreaker_blockCount = new WeakMap(), _BrickBreaker_paddleLength = new WeakMap(), _BrickBreaker_minScreenHeight = new WeakMap(), _BrickBreaker_maxScreenHeight = new WeakMap(), _BrickBreaker_screenHeightDiff = new WeakMap(), _BrickBreaker_deltaMultiplier = new WeakMap(), _BrickBreaker_deltaVectorLength = new WeakMap(), _BrickBreaker_currentPalette = new WeakMap(), _BrickBreaker_instances = new WeakSet(), _BrickBreaker_resetCanvas = function _BrickBreaker_resetCanvas() {
    const dPR = window.devicePixelRatio;
    const height = Math.round(this.offsetHeight * dPR);
    const width = Math.round(this.offsetWidth * dPR);
    __classPrivateFieldGet(this, _BrickBreaker_canvas, "f").height = height;
    __classPrivateFieldGet(this, _BrickBreaker_canvas, "f").width = width;
    __classPrivateFieldGet(this, _BrickBreaker_canvas, "f").style.height = (height / dPR) + 'px';
    __classPrivateFieldGet(this, _BrickBreaker_canvas, "f").style.width = (width / dPR) + 'px';
}, _BrickBreaker_closeGame = function _BrickBreaker_closeGame() {
    __classPrivateFieldSet(this, _BrickBreaker_running, false, "f");
    this.remove();
}, _BrickBreaker_setUpNewGame = function _BrickBreaker_setUpNewGame() {
    __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_resetCanvas).call(this);
    __classPrivateFieldSet(this, _BrickBreaker_deltaMultiplier, Math.max(0.1, (this.offsetHeight - __classPrivateFieldGet(this, _BrickBreaker_minScreenHeight, "f")) / __classPrivateFieldGet(this, _BrickBreaker_screenHeightDiff, "f")), "f");
    __classPrivateFieldSet(this, _BrickBreaker_deltaVectorLength, MIN_DELTA * __classPrivateFieldGet(this, _BrickBreaker_deltaMultiplier, "f"), "f");
    const trackData = this.timelineFlameChart.drawTrackOnCanvas('Main', __classPrivateFieldGet(this, _BrickBreaker_ctx, "f"), BALL_RADIUS);
    if (trackData === null || trackData.visibleEntries.size === 0) {
        console.error('Could not draw game');
        __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_closeGame).call(this);
        return;
    }
    __classPrivateFieldSet(this, _BrickBreaker_trackTimelineOffset, trackData.top, "f");
    __classPrivateFieldSet(this, _BrickBreaker_visibleEntries, trackData.visibleEntries, "f");
    __classPrivateFieldSet(this, _BrickBreaker_gameViewportOffset, __classPrivateFieldGet(this, _BrickBreaker_trackTimelineOffset, "f") +
        this.timelineFlameChart.getCanvas().getBoundingClientRect().top - this.timelineFlameChart.getScrollOffset(), "f");
    requestAnimationFrame(() => __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_animateFlameChartTopPositioning).call(this, trackData.top, trackData.height));
}, _BrickBreaker_animateFlameChartTopPositioning = function _BrickBreaker_animateFlameChartTopPositioning(currentOffset, flameChartHeight) {
    if (currentOffset === 0) {
        __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_createGame).call(this);
        return;
    }
    const dPR = window.devicePixelRatio;
    const currentOffsetOnDPR = Math.round(currentOffset * dPR);
    const newOffset = Math.max(currentOffset - 4, 0);
    const newOffsetOnDPR = Math.round(newOffset * dPR);
    const baseCanvas = __classPrivateFieldGet(this, _BrickBreaker_canvas, "f");
    __classPrivateFieldGet(this, _BrickBreaker_helperCanvas, "f").height = baseCanvas.height;
    __classPrivateFieldGet(this, _BrickBreaker_helperCanvas, "f").width = baseCanvas.width;
    __classPrivateFieldGet(this, _BrickBreaker_helperCanvas, "f").style.height = baseCanvas.style.height;
    __classPrivateFieldGet(this, _BrickBreaker_helperCanvas, "f").style.width = baseCanvas.style.width;
    __classPrivateFieldGet(this, _BrickBreaker_helperCanvasCtx, "f").drawImage(baseCanvas, 0, currentOffsetOnDPR, baseCanvas.width, flameChartHeight * dPR, 0, newOffsetOnDPR, baseCanvas.width, flameChartHeight * dPR);
    __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_resetCanvas).call(this);
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").drawImage(__classPrivateFieldGet(this, _BrickBreaker_helperCanvas, "f"), 0, 0);
    requestAnimationFrame(() => __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_animateFlameChartTopPositioning).call(this, newOffset, flameChartHeight));
}, _BrickBreaker_keyUpHandler = function _BrickBreaker_keyUpHandler(event) {
    if (event.key === 'Right' || event.key === 'ArrowRight' || event.key === 'd') {
        __classPrivateFieldSet(this, _BrickBreaker_rightPressed, false, "f");
        event.preventDefault();
    }
    else if (event.key === 'Left' || event.key === 'ArrowLeft' || event.key === 'a') {
        __classPrivateFieldSet(this, _BrickBreaker_leftPressed, false, "f");
        event.preventDefault();
    }
    else {
        event.stopImmediatePropagation();
    }
}, _BrickBreaker_keyPressHandler = function _BrickBreaker_keyPressHandler(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
}, _BrickBreaker_keyDownHandler = function _BrickBreaker_keyDownHandler(event) {
    if (event.key === 'Escape') {
        __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_closeGame).call(this);
        event.stopImmediatePropagation();
    }
    else if (event.key === 'Right' || event.key === 'ArrowRight' || event.key === 'd') {
        __classPrivateFieldSet(this, _BrickBreaker_rightPressed, true, "f");
        event.preventDefault();
    }
    else if (event.key === 'Left' || event.key === 'ArrowLeft' || event.key === 'a') {
        __classPrivateFieldSet(this, _BrickBreaker_leftPressed, true, "f");
        event.preventDefault();
    }
    else {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
}, _BrickBreaker_mouseMoveHandler = function _BrickBreaker_mouseMoveHandler(e) {
    __classPrivateFieldSet(this, _BrickBreaker_paddleX, Math.max(e.offsetX - __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f") / 2, 0), "f");
    __classPrivateFieldSet(this, _BrickBreaker_paddleX, Math.min(__classPrivateFieldGet(this, _BrickBreaker_paddleX, "f"), this.offsetWidth - __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f")), "f");
}, _BrickBreaker_createGame = function _BrickBreaker_createGame() {
    __classPrivateFieldSet(this, _BrickBreaker_ballX, this.offsetWidth / 2, "f");
    __classPrivateFieldSet(this, _BrickBreaker_ballY, this.offsetHeight - PADDLE_HEIGHT - BALL_RADIUS, "f");
    __classPrivateFieldSet(this, _BrickBreaker_ballDx, 0, "f");
    __classPrivateFieldSet(this, _BrickBreaker_ballDy, -Math.SQRT2 * __classPrivateFieldGet(this, _BrickBreaker_deltaVectorLength, "f"), "f");
    __classPrivateFieldSet(this, _BrickBreaker_paddleX, (__classPrivateFieldGet(this, _BrickBreaker_canvas, "f").width - __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f")) / 2, "f");
    __classPrivateFieldSet(this, _BrickBreaker_rightPressed, false, "f");
    __classPrivateFieldSet(this, _BrickBreaker_leftPressed, false, "f");
    __classPrivateFieldSet(this, _BrickBreaker_brickHeight, this.timelineFlameChart.getBarHeight(), "f");
    __classPrivateFieldSet(this, _BrickBreaker_blockCount, __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").size, "f");
    __classPrivateFieldSet(this, _BrickBreaker_lives, Math.max(Math.round(__classPrivateFieldGet(this, _BrickBreaker_blockCount, "f") / 17), 2), "f");
    __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_draw).call(this);
}, _BrickBreaker_restartBall = function _BrickBreaker_restartBall() {
    __classPrivateFieldSet(this, _BrickBreaker_ballX, this.offsetWidth / 2, "f");
    __classPrivateFieldSet(this, _BrickBreaker_ballY, this.offsetHeight - PADDLE_HEIGHT - BALL_RADIUS, "f");
    __classPrivateFieldSet(this, _BrickBreaker_ballDx, 0, "f");
    __classPrivateFieldSet(this, _BrickBreaker_ballDy, -Math.SQRT2 * __classPrivateFieldGet(this, _BrickBreaker_deltaVectorLength, "f"), "f");
}, _BrickBreaker_drawBall = function _BrickBreaker_drawBall() {
    if (!__classPrivateFieldGet(this, _BrickBreaker_ctx, "f")) {
        return;
    }
    const gradient = __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").createRadialGradient(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") + BALL_RADIUS / 4, // Offset towards the left
    __classPrivateFieldGet(this, _BrickBreaker_ballY, "f") - BALL_RADIUS / 4, // Offset downwards
    0, __classPrivateFieldGet(this, _BrickBreaker_ballX, "f") + BALL_RADIUS / 4, __classPrivateFieldGet(this, _BrickBreaker_ballY, "f") - BALL_RADIUS / 4, BALL_RADIUS);
    // stops for gradient
    gradient.addColorStop(0.3, __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").mediumLighter);
    gradient.addColorStop(0.6, __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").mediumDarker);
    gradient.addColorStop(1, __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").dark);
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").beginPath();
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").arc(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f"), __classPrivateFieldGet(this, _BrickBreaker_ballY, "f"), BALL_RADIUS, 0, Math.PI * 2);
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").fillStyle = gradient;
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").fill();
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").closePath();
}, _BrickBreaker_drawPaddle = function _BrickBreaker_drawPaddle() {
    if (!__classPrivateFieldGet(this, _BrickBreaker_ctx, "f")) {
        return;
    }
    const gradient = __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").createRadialGradient(__classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") + __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f") / 3, this.offsetHeight - PADDLE_HEIGHT - PADDLE_HEIGHT / 4, 0, __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") + __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f") / 3, this.offsetHeight - PADDLE_HEIGHT - PADDLE_HEIGHT / 4, __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f") / 2);
    gradient.addColorStop(0.3, __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").dark); // Paddle color
    gradient.addColorStop(1, __classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").mediumDarker); // Lighter color
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").beginPath();
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").rect(__classPrivateFieldGet(this, _BrickBreaker_paddleX, "f"), this.offsetHeight - PADDLE_HEIGHT, __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f"), PADDLE_HEIGHT);
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").fillStyle = gradient;
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").fill();
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").closePath();
}, _BrickBreaker_patchBrokenBricks = function _BrickBreaker_patchBrokenBricks() {
    if (!__classPrivateFieldGet(this, _BrickBreaker_ctx, "f")) {
        return;
    }
    for (const brick of __classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").values()) {
        __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").beginPath();
        // Extend the patch width an extra 0.5 px to ensure the
        // entry is completely covered.
        __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").rect(brick.x, brick.y, brick.width + 0.5, __classPrivateFieldGet(this, _BrickBreaker_brickHeight, "f") + 0.5);
        __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").fillStyle =
            ThemeSupport.ThemeSupport.instance().getComputedValue('--sys-color-neutral-container', this);
        __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").fill();
        __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").closePath();
    }
}, _BrickBreaker_draw = function _BrickBreaker_draw() {
    var _a;
    if (__classPrivateFieldGet(this, _BrickBreaker_initialDPR, "f") !== devicePixelRatio) {
        __classPrivateFieldSet(this, _BrickBreaker_running, false, "f");
    }
    if (__classPrivateFieldGet(this, _BrickBreaker_lives, "f") === 0) {
        window.alert('GAME OVER');
        __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_closeGame).call(this);
        return;
    }
    if (__classPrivateFieldGet(this, _BrickBreaker_blockCount, "f") === 0) {
        __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_party).call(this);
        return;
    }
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").clearRect(0, 0, __classPrivateFieldGet(this, _BrickBreaker_canvas, "f").width, __classPrivateFieldGet(this, _BrickBreaker_canvas, "f").height);
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").drawImage(__classPrivateFieldGet(this, _BrickBreaker_helperCanvas, "f"), 0, 0);
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").save();
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").scale(devicePixelRatio, devicePixelRatio);
    __classPrivateFieldGet(this, _BrickBreaker_helperCanvasCtx, "f").save();
    __classPrivateFieldGet(this, _BrickBreaker_helperCanvasCtx, "f").scale(devicePixelRatio, devicePixelRatio);
    __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_patchBrokenBricks).call(this);
    __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_drawBall).call(this);
    __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_drawPaddle).call(this);
    __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_brickCollisionDetection).call(this);
    const lives = `<div><b><span style='font-size: 1.3em; color:  ${__classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").dark}'>&#x2764;&#xfe0f; ${__classPrivateFieldGet(this, _BrickBreaker_lives, "f")}</span></b></div>`;
    const blocks = `<div><b><span style='font-size: 1.3em; color: ${__classPrivateFieldGet(this, _BrickBreaker_currentPalette, "f").dark}'> 🧱 ${__classPrivateFieldGet(this, _BrickBreaker_blockCount, "f")}</span></b></div>`;
    __classPrivateFieldGet(this, _BrickBreaker_scorePanel, "f").innerHTML = lives + blocks;
    __classPrivateFieldSet(this, _BrickBreaker_blockCount, __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").size - __classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").size, "f");
    __classPrivateFieldSet(this, _BrickBreaker_deltaVectorLength, (MIN_DELTA + (MAX_DELTA - MIN_DELTA) * __classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").size / __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").size) *
        __classPrivateFieldGet(this, _BrickBreaker_deltaMultiplier, "f"), "f");
    __classPrivateFieldSet(this, _BrickBreaker_paddleLength, MAX_PADDLE_LENGTH -
        (MAX_PADDLE_LENGTH - MIN_PADDLE_LENGTH) * __classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").size / __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").size, "f");
    if (__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") + __classPrivateFieldGet(this, _BrickBreaker_ballDx, "f") > this.offsetWidth - BALL_RADIUS || __classPrivateFieldGet(this, _BrickBreaker_ballX, "f") + __classPrivateFieldGet(this, _BrickBreaker_ballDx, "f") < BALL_RADIUS) {
        // Ball bounces on a side wall.
        __classPrivateFieldSet(this, _BrickBreaker_ballDx, -__classPrivateFieldGet(this, _BrickBreaker_ballDx, "f"), "f");
    }
    if (__classPrivateFieldGet(this, _BrickBreaker_ballY, "f") + __classPrivateFieldGet(this, _BrickBreaker_ballDy, "f") < BALL_RADIUS) {
        // Ball bounces on the top.
        __classPrivateFieldSet(this, _BrickBreaker_ballDy, -__classPrivateFieldGet(this, _BrickBreaker_ballDy, "f"), "f");
    }
    else if (__classPrivateFieldGet(this, _BrickBreaker_ballY, "f") + __classPrivateFieldGet(this, _BrickBreaker_ballDy, "f") > this.offsetHeight - BALL_RADIUS && __classPrivateFieldGet(this, _BrickBreaker_ballDy, "f") > 0) {
        // Ball is at the bottom, either on the paddle or in the
        // void.
        if (__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") > (__classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") - BALL_RADIUS) &&
            __classPrivateFieldGet(this, _BrickBreaker_ballX, "f") < __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") + __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f") + BALL_RADIUS) {
            // Ball bounces on the paddle, calculate this.ballDx and this.ballDy so that
            // the speed remains constant.
            // speed^2 = dx^2 + dy^2 = MAX_DELTA^2 + MAX_DELTA^2
            // -> speed = MAX_DELTA * sqrt(2)
            // (speed is measured in pixels / frame)
            // The bouncing angle is determined by the portion of the
            // paddle's length on which it falls and by the restriction
            // -MAX_DELTA < this.ballDx < MAX_DELTA
            // Since we allow for some margin of error (BALL_RADIUS), we need to
            // round the ball x to be within the paddle.
            let roundedBallX = Math.min(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f"), __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") + __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f"));
            roundedBallX = Math.max(roundedBallX, __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f"));
            const paddleLenghtPortion = (roundedBallX - __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f")) * __classPrivateFieldGet(this, _BrickBreaker_deltaVectorLength, "f") * 2 / __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f");
            __classPrivateFieldSet(this, _BrickBreaker_ballDx, -__classPrivateFieldGet(this, _BrickBreaker_deltaVectorLength, "f") + paddleLenghtPortion, "f");
            // Solve for this.ballDy given the above equation and bounce up.
            __classPrivateFieldSet(this, _BrickBreaker_ballDy, -Math.sqrt(2 * Math.pow(__classPrivateFieldGet(this, _BrickBreaker_deltaVectorLength, "f"), 2) - Math.pow(__classPrivateFieldGet(this, _BrickBreaker_ballDx, "f"), 2)), "f");
        }
        else {
            // Ball fell into oblivion, restart.
            __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_restartBall).call(this);
            __classPrivateFieldSet(this, _BrickBreaker_paddleX, (this.offsetWidth - __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f")) / 2, "f");
            __classPrivateFieldSet(this, _BrickBreaker_lives, (_a = __classPrivateFieldGet(this, _BrickBreaker_lives, "f"), _a--, _a), "f");
        }
    }
    const keyDelta = Math.round(this.clientWidth / 60);
    if (__classPrivateFieldGet(this, _BrickBreaker_rightPressed, "f") && __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") < this.offsetWidth - __classPrivateFieldGet(this, _BrickBreaker_paddleLength, "f")) {
        __classPrivateFieldSet(this, _BrickBreaker_paddleX, __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") + keyDelta, "f");
    }
    else if (__classPrivateFieldGet(this, _BrickBreaker_leftPressed, "f") && __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") > 0) {
        __classPrivateFieldSet(this, _BrickBreaker_paddleX, __classPrivateFieldGet(this, _BrickBreaker_paddleX, "f") - keyDelta, "f");
    }
    __classPrivateFieldSet(this, _BrickBreaker_ballX, __classPrivateFieldGet(this, _BrickBreaker_ballX, "f") + Math.round(__classPrivateFieldGet(this, _BrickBreaker_ballDx, "f")), "f");
    __classPrivateFieldSet(this, _BrickBreaker_ballY, __classPrivateFieldGet(this, _BrickBreaker_ballY, "f") + Math.round(__classPrivateFieldGet(this, _BrickBreaker_ballDy, "f")), "f");
    __classPrivateFieldGet(this, _BrickBreaker_ctx, "f").restore();
    __classPrivateFieldGet(this, _BrickBreaker_helperCanvasCtx, "f").restore();
    if (__classPrivateFieldGet(this, _BrickBreaker_running, "f")) {
        requestAnimationFrame(__classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_draw).bind(this));
    }
}, _BrickBreaker_brickCollisionDetection = function _BrickBreaker_brickCollisionDetection() {
    // coordinatesToEntryIndex expects coordinates relative to the timeline canvas.
    const timelineCanvasOffset = this.timelineFlameChart.getCanvas().getBoundingClientRect();
    // Check collision if there is an entry on the top, bottom, left and right of the ball
    const ballYRelativeToGame = __classPrivateFieldGet(this, _BrickBreaker_ballY, "f") + __classPrivateFieldGet(this, _BrickBreaker_gameViewportOffset, "f") - timelineCanvasOffset.top;
    const entryIndexTop = this.timelineFlameChart.coordinatesToEntryIndex(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f"), ballYRelativeToGame + BALL_RADIUS);
    const entryIndexBottom = this.timelineFlameChart.coordinatesToEntryIndex(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f"), ballYRelativeToGame - BALL_RADIUS);
    const entryIndexRight = this.timelineFlameChart.coordinatesToEntryIndex(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") + BALL_RADIUS, ballYRelativeToGame);
    const entryIndexLeft = this.timelineFlameChart.coordinatesToEntryIndex(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") - BALL_RADIUS, ballYRelativeToGame);
    // Points on the 45 degree corners
    const diffBetweenCornerandCircle = BALL_RADIUS / Math.SQRT2;
    const entryIndexRightTop = this.timelineFlameChart.coordinatesToEntryIndex(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") + diffBetweenCornerandCircle, ballYRelativeToGame + diffBetweenCornerandCircle);
    const entryIndexLeftTop = this.timelineFlameChart.coordinatesToEntryIndex(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") - diffBetweenCornerandCircle, ballYRelativeToGame + diffBetweenCornerandCircle);
    const entryIndexRightBottom = this.timelineFlameChart.coordinatesToEntryIndex(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") + diffBetweenCornerandCircle, ballYRelativeToGame - diffBetweenCornerandCircle);
    const entryIndexLeftBottom = this.timelineFlameChart.coordinatesToEntryIndex(__classPrivateFieldGet(this, _BrickBreaker_ballX, "f") - diffBetweenCornerandCircle, ballYRelativeToGame - diffBetweenCornerandCircle);
    const breakBrick = (entryIndex) => {
        const entryCoordinates = this.timelineFlameChart.entryIndexToCoordinates(entryIndex);
        if (entryCoordinates) {
            // Cap entries starting before the visible window in the game.
            const entryBegin = Math.max(entryCoordinates.x - timelineCanvasOffset.left, 0);
            // Extend the patch width and height an extra 0.5 px to ensure the
            // entry is completely covered.
            __classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").set(entryIndex, {
                x: entryBegin - 0.5,
                y: entryCoordinates.y - __classPrivateFieldGet(this, _BrickBreaker_gameViewportOffset, "f") - 0.5,
                width: this.timelineFlameChart.entryWidth(entryIndex),
            });
        }
    };
    if (entryIndexTop > -1 && !__classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").has(entryIndexTop) && __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").has(entryIndexTop)) {
        __classPrivateFieldSet(this, _BrickBreaker_ballDy, -__classPrivateFieldGet(this, _BrickBreaker_ballDy, "f"), "f");
        breakBrick(entryIndexTop);
        return;
    }
    if (entryIndexBottom > -1 && !__classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").has(entryIndexBottom) &&
        __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").has(entryIndexBottom)) {
        __classPrivateFieldSet(this, _BrickBreaker_ballDy, -__classPrivateFieldGet(this, _BrickBreaker_ballDy, "f"), "f");
        breakBrick(entryIndexBottom);
        return;
    }
    if (entryIndexRight > -1 && !__classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").has(entryIndexRight) && __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").has(entryIndexRight)) {
        __classPrivateFieldSet(this, _BrickBreaker_ballDx, -__classPrivateFieldGet(this, _BrickBreaker_ballDx, "f"), "f");
        breakBrick(entryIndexRight);
        return;
    }
    if (entryIndexLeft > -1 && !__classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").has(entryIndexLeft) && __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").has(entryIndexLeft)) {
        __classPrivateFieldSet(this, _BrickBreaker_ballDx, -__classPrivateFieldGet(this, _BrickBreaker_ballDx, "f"), "f");
        breakBrick(entryIndexLeft);
        return;
    }
    // if the brick hits on 45 degrees, reverse both directions
    const diagonalIndexes = [entryIndexRightTop, entryIndexLeftTop, entryIndexRightBottom, entryIndexLeftBottom];
    for (const index of diagonalIndexes) {
        if (index > -1 && !__classPrivateFieldGet(this, _BrickBreaker_brokenBricks, "f").has(index) && __classPrivateFieldGet(this, _BrickBreaker_visibleEntries, "f").has(index)) {
            __classPrivateFieldSet(this, _BrickBreaker_ballDx, -__classPrivateFieldGet(this, _BrickBreaker_ballDx, "f"), "f");
            __classPrivateFieldSet(this, _BrickBreaker_ballDy, -__classPrivateFieldGet(this, _BrickBreaker_ballDy, "f"), "f");
            breakBrick(index);
            return;
        }
    }
}, _BrickBreaker_random = function _BrickBreaker_random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}, _BrickBreaker_party = function _BrickBreaker_party() {
    __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_resetCanvas).call(this);
    let count = 0;
    const columnCount = 15;
    const rowCount = 5;
    const xSpacing = this.offsetWidth / columnCount;
    const ySpacing = this.offsetHeight * 0.7 / columnCount;
    const timeoutIDs = [];
    const randomOffset = () => -20 + Math.random() * 40;
    const drawConfetti = () => {
        for (let i = 0; i < columnCount * rowCount; i++) {
            const confettiContainerElement = document.createElement('span');
            confettiContainerElement.className = 'confetti-100';
            confettiContainerElement.append(__classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_createConfettiElement).call(this, (i % columnCount) * xSpacing + randomOffset(), (i % rowCount) * ySpacing + randomOffset()));
            timeoutIDs.push(window.setTimeout(() => this.append(confettiContainerElement), Math.random() * 100));
            timeoutIDs.push(window.setTimeout(() => {
                confettiContainerElement.remove();
            }, 1000));
        }
        if (++count < 6) {
            setTimeout(drawConfetti, Math.random() * 100 + 400);
            return;
        }
        window.alert(`${i18nString(UIStrings.congrats)}\n${i18nString(UIStrings.ps)}`);
        timeoutIDs.forEach(id => clearTimeout(id));
        __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_closeGame).call(this);
    };
    drawConfetti();
}, _BrickBreaker_createConfettiElement = function _BrickBreaker_createConfettiElement(x, y) {
    const maxDistance = 400;
    const maxRotation = 3;
    const emojies = ['💯', '🎉', '🎊'];
    const confettiElement = document.createElement('span');
    confettiElement.textContent = emojies[__classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_random).call(this, 0, emojies.length)];
    confettiElement.className = 'confetti-100-particle';
    confettiElement.style.setProperty('--rotation', __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_random).call(this, -maxRotation * 360, maxRotation * 360) + 'deg');
    confettiElement.style.setProperty('--to-X', __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_random).call(this, -maxDistance, maxDistance) + 'px');
    confettiElement.style.setProperty('--to-Y', __classPrivateFieldGet(this, _BrickBreaker_instances, "m", _BrickBreaker_random).call(this, -maxDistance, maxDistance) + 'px');
    confettiElement.style.left = x + 'px';
    confettiElement.style.top = y + 'px';
    return confettiElement;
};
customElements.define('brick-breaker', BrickBreaker);
//# sourceMappingURL=BrickBreaker.js.map