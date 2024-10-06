import { makeAutoObservable } from "mobx";
import { concatIds } from "./ElementsStore.utils";

export type TElementBase = {
    id: string;
    i?: number;
    title: string;
    parentIds: string[];
};

export type TElementVisual = {
    mdIcon: string; // https://fonts.google.com/icons
    customDrawerType?: string;
};

export type TElementRuntime = {
    i?: number;
    discovered: number; // когда был элемент? (0 === еще не открыт)
    level: number;
};

export type TElement = TElementBase & TElementVisual & TElementRuntime;

export default class Element implements TElement {
    id: string;
    i: number;
    i_0_7: number;
    title: string;
    parentIds: string[];
    mdIcon: string = "";
    customDrawerType: string = "";
    discovered: number = 0;
    level: number = -1;

    static isVisual(data: Partial<TElement>): data is TElementVisual {
        // NOTE: mdIcon может отсутствовать, если мы хотим задать только customDrawerType (допускается многократный вызов setVisual)
        if ('mdIcon' in data) return true;
        if ('customDrawerType' in data) return true;
        return false;
    }

    static isRuntime(data: Partial<TElement>): data is TElementRuntime {
        if (data.discovered) return true;
        if (data.level !== -1) return true;
        if (data.i) return true;
        return false;
    }

    constructor(data: Partial<TElement> & TElementBase) {
        makeAutoObservable(this); 
        this.id = data.id;
        this.setI(0);
        this.i = 0;
        this.i_0_7 = 0;
        this.title = data.title;
        this.parentIds = data.parentIds.slice().sort();
        if (this.isRoot) {
            this.discovered = Date.now();
            this.level = 0;
        } else {
            this.discovered = 0;
        }
        if (Element.isVisual(data)) this.setVisual(data); 
        // TODO: точно ли нельзя перенести if внутрь метода? (без setVisual + _setVisual)
        if (Element.isRuntime(data)) this.setRuntime(data);
    }

    get isRoot(): boolean {
        return this.parentIds.length === 0;
    }

    get parents(): string {
        return concatIds(this.parentIds);
    }

    setVisual(data: Partial<TElementVisual>) {
        // TODO: Element.isVisual(data)!;
        if ('mdIcon' in data) this.mdIcon = data.mdIcon || "";
        if ('customDrawerType' in data) this.customDrawerType = data.customDrawerType || "";
    }

    setLevel(v: number) {
        this.level = v;
    }

    setI(i: number) {
        this.i = Math.floor(i);
        this.i_0_7 = Math.floor(i % 7);
    }

    setRuntime(data: TElementRuntime) {
        if (data.discovered) this.discovered = data.discovered;
        if (data.level !== -1) this.setLevel(data.level);
        if (typeof data.i == 'number') this.setI(data.i);
    }

    init(data: TElementRuntime & Partial<TElementVisual>) {
        if (Element.isVisual(data)) this.setVisual(data);
        this.setRuntime(data);
        if (this.isRoot) {
            this.discover();
        }
    }

    discover() {
        this.discovered = Date.now();
    }
}