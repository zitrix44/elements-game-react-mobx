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
    discovered: boolean; // был ли элемент открыт?
};

export type TElement = TElementBase & TElementVisual & TElementRuntime;

export default class Element implements TElement {
    id: string;
    title: string;
    parentIds: string[];
    mdIcon: string = "";
    customDrawerType: string = "";
    discovered: boolean = false;

    static isVisual(data: Partial<TElement>): data is TElementVisual {
        // NOTE: mdIcon может отсутствовать, если мы хотим задать только customDrawerType (допускается многократный вызов setVisual)
        if ('mdIcon' in data) return true;
        if ('customDrawerType' in data) return true;
        return false;
    }

    static isRuntime(data: Partial<TElement>): data is TElementRuntime {
        if ('discovered' in data) return true;
        return false;
    }

    static canUndiscover = false;

    // constructor(data: Partial<TElement> & TElementBase) {
    constructor(data: Partial<TElement> & TElementBase) {
        makeAutoObservable(this); 
        this.id = data.id;
        this.title = data.title;
        this.parentIds = data.parentIds;
        if (this.parentIds.length) this.discovered = true;
        if (Element.isVisual(data)) this.setVisual(data); 
        // TODO: точно ли нельзя перенести if внутрь метода? (без setVisual + _setVisual)
        if (Element.isRuntime(data)) this.setRuntime(data);
    }

    setVisual(data: Partial<TElementVisual>) {
        // TODO: Element.isVisual(data)!;
        if ('mdIcon' in data) this.mdIcon = data.mdIcon || "";
        if ('customDrawerType' in data) this.customDrawerType = data.customDrawerType || "";
    }

    setRuntime(data: TElementRuntime) {
        this.discovered = data.discovered;
    }

    init(data: TElementRuntime & Partial<TElementVisual>) {
        if (Element.isVisual(data)) this.setVisual(data);
        this.setRuntime(data);
        if (this.parentIds.length===0) {
            this.discover();
        }
    }

    discover() {
        this.discovered = true;
    }
}