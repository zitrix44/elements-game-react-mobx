import { makeAutoObservable } from "mobx";

export type TElementBase = {
    id: string;
    title: string;
    parentIds: string[];
};

export type TElementVisual = {
    mdIcon: string; // https://fonts.google.com/icons
    customDrawerType?: string;
};

export type TElementRuntime = {
    discovered: number; // когда был элемент? (0 === еще не открыт)
    level: number;
};

export type TElement = TElementBase & TElementVisual & TElementRuntime;

export default class Element implements TElement {
    id: string;
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
        return false;
    }

    constructor(data: Partial<TElement> & TElementBase) {
        makeAutoObservable(this); 
        this.id = data.id;
        this.title = data.title;
        this.parentIds = data.parentIds;
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

    setVisual(data: Partial<TElementVisual>) {
        // TODO: Element.isVisual(data)!;
        if ('mdIcon' in data) this.mdIcon = data.mdIcon || "";
        if ('customDrawerType' in data) this.customDrawerType = data.customDrawerType || "";
    }

    setLevel(v: number) {
        this.level = v;
    }

    setRuntime(data: TElementRuntime) {
        if (data.discovered) this.discovered = data.discovered;
        if (data.level !== -1) this.setLevel(data.level);
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