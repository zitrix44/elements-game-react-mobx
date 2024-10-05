import { makeAutoObservable } from "mobx";
import CONST from '../const';
import { lsGet, lsSet } from "../utils/localStorage";
import { defaultShape, shapesList } from "./ThemeStore.shapes";

export default class ThemeStore {
    shapesList = shapesList;
    defaultShapeId: string = defaultShape;
    selectedShapeId: string = "";
    cardClipId: string = "";
    cardBorderId: string = "";

    constructor() {
        makeAutoObservable(this);
        this.selectedShapeId = lsGet(CONST.LS_THEME_SHAPE_ID) || "";
        if (!(this.defaultShapeId in this.shapesList)) {
            this.defaultShapeId = Object.keys(this.shapesList)[0];
        }
        if (!(this.selectedShapeId in this.shapesList)) {
            this.selectedShapeId = this.defaultShapeId;
        }
    }

    selectShape(id: string) {
        if (!(this.selectedShapeId in this.shapesList)) {
            throw new Error(`Unknown shape id: "${id}"`);
        }
        this.selectedShapeId = id;
        const shape = this.shapesList[id];
        this.cardClipId = shape.clipId;
        lsSet(CONST.LS_THEME_SHAPE_ID, id);
    }
}