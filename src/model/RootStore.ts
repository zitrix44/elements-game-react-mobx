import { makeAutoObservable } from "mobx";
import ElementsStore from "./ElementsStore";
import LaunchStore from "./LaunchStore";
import ThemeStore from "./ThemeStore";
import RootStoreUtils from "./RootStoreUtils";

export class RootStore {
    utils: RootStoreUtils;
    elementsStore: ElementsStore;
    launchStore: LaunchStore;
    themeStore: ThemeStore;

    constructor() {
        makeAutoObservable(this);
        this.utils = new RootStoreUtils(this);
        this.elementsStore = new ElementsStore();
        this.launchStore = new LaunchStore(this);
        this.themeStore = new ThemeStore();
    }

    startWithParsed() {
        this.elementsStore.startWithParsed(this.launchStore.elementsParsed);
    }
}

export default new RootStore();