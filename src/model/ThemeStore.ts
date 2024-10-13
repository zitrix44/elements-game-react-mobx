import { makeAutoObservable } from "mobx";
import CONST from '../const';
import { lsGet, lsHas, lsNumber, lsSet } from "../utils/localStorage";

import { defaultShape, shapesList } from "./ThemeStore.shapes";
import { colorSchemes, defaultColorScheme, makeColorSchemes } from "./ThemeStore.colors";
import { toastInfo } from "../utils/toasts";

export default class ThemeStore {
    shapesList = shapesList;
    defaultShapeId = defaultShape;
    selectedShapeId = "";
    cardClipId = ""; // TODO: если не используется - выкосить
    cardBorderId = "";

    themeSettingsVisible = false;

    noDiscoverOverlay = false;

    colorSchemes = colorSchemes;
    colorSchemesCssText = "";
    defaultColorSchemeId = defaultColorScheme;
    selectedColorSchemeId = "";

    gameBgRandomSeed = 0;
    gameBgOpacity = 1;
    gameBgBrightness = 1;
    gameBgContrast = 1;

    constructor() {
        makeAutoObservable(this);

        this.selectedShapeId = lsGet(CONST.LS_THEME_SHAPE_ID) || "";
        if (!(this.defaultShapeId in this.shapesList)) {
            this.defaultShapeId = Object.keys(this.shapesList)[0];
        }
        if (!(this.selectedShapeId in this.shapesList)) {
            this.selectedShapeId = this.defaultShapeId;
        }

        this.selectedColorSchemeId = lsGet(CONST.LS_THEME_COLOR_SCHEME_ID) || this.defaultColorSchemeId;
        if (!this.colorSchemes.find(v => v.id === this.defaultShapeId)) {
            this.defaultColorSchemeId = "Default";
        }
        if (!this.colorSchemes.find(v => v.id === this.selectedColorSchemeId)) {
            this.selectedColorSchemeId = this.defaultColorSchemeId;
        }
        if (this.selectedColorSchemeId === "Unicorn") {
            toastInfo("Color scheme switch to default for prevent performance drop");
            this.selectColorScheme(this.defaultColorSchemeId);
        }

        this.colorSchemesCssText = makeColorSchemes(this.colorSchemes);

        if (lsHas(CONST.LS_THEME_BG_SEED)) {
            this.gameBgRandomSeed = lsNumber(CONST.LS_THEME_BG_SEED);
        }
        if (lsHas(CONST.LS_THEME_BG_OPACITY)) {
            this.gameBgOpacity = lsNumber(CONST.LS_THEME_BG_OPACITY);
        }
        if (lsHas(CONST.LS_THEME_BG_CONTRAST)) {
            this.gameBgContrast = lsNumber(CONST.LS_THEME_BG_CONTRAST);
        }
        if (lsHas(CONST.LS_THEME_BG_BRIGHTNESS)) {
            this.gameBgBrightness = lsNumber(CONST.LS_THEME_BG_BRIGHTNESS);
        }

        this.checkIsUnicorn();
    }

    selectShape(id: string) {
        if (!(id in this.shapesList)) {
            throw new Error(`Unknown shape id: "${id}"`);
        }
        this.selectedShapeId = id;
        const shape = this.shapesList[id];
        this.cardClipId = shape.clipId;
        lsSet(CONST.LS_THEME_SHAPE_ID, id);
    }

    selectColorScheme(id: string) {
        if (this.selectedColorSchemeId === id) return;
        if (!this.colorSchemes.find(v => v.id === id)) {
            throw new Error(`Unknown color scheme id: "${id}"`);
        }
        this.selectedColorSchemeId = id;
        lsSet(CONST.LS_THEME_COLOR_SCHEME_ID, id);
        this.checkIsUnicorn();
    }

    setBgRandomSeed(i:number) {
        this.gameBgRandomSeed = i;
        lsSet(CONST.LS_THEME_BG_SEED, this.gameBgRandomSeed);
    }

    setBgOpacity(v:number) {
        this.gameBgOpacity = v;
        lsSet(CONST.LS_THEME_BG_OPACITY, this.gameBgOpacity);
    }
    setBgBrightness(v:number) {
        this.gameBgBrightness = v;
        lsSet(CONST.LS_THEME_BG_BRIGHTNESS, this.gameBgBrightness);
    }
    setBgContrast(v:number) {
        this.gameBgContrast = v;
        lsSet(CONST.LS_THEME_BG_CONTRAST, this.gameBgContrast);
    }

    showThemeSettings() {
        this.themeSettingsVisible = true;
    }
    hideThemeSettings() {
        this.themeSettingsVisible = false;
    }

    checkIsUnicorn() {
        console.log('checkIsUnicorn', this.selectedColorSchemeId)
        if (this.selectedColorSchemeId !== "Unicorn") return;
        this.randomizeUnicornColor();
        setTimeout(() => {
            this.checkIsUnicorn();
        }, 0.5 * 1000);
    }

    randomizeUnicornColor() {
        console.log('randomizeUnicornColor');
        const scheme = this.colorSchemes.find(v => v.id === "Unicorn")!;
        const randomChannel = () => Math.floor(Math.random()*255);
        const randomColor = `rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()})`;
        const r = Math.random();
        if (r < 0.25) {
            console.log('cardTextColor');
            scheme.cardTextColor = randomColor;
        } else if (r < 0.5) {
            console.log('cardBgColor');
            scheme.cardBgColor = randomColor;
        } else if (r < 0.75) {
            console.log('cardIconColor');
            scheme.cardIconColor = randomColor;
        } else {
            console.log('cardStrokeColor');
            scheme.cardStrokeColor = randomColor;
        }
        this.colorSchemesCssText = makeColorSchemes(this.colorSchemes);
    }
}