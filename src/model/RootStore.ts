import { makeAutoObservable } from "mobx";
import ElementsStore from "./ElementsStore";
import LaunchStore from "./LaunchStore";
import ThemeStore from "./ThemeStore";
import RootStoreUtils from "./RootStoreUtils";
import CauldronStore from "./CauldronStore";

export class RootStore {
    utils: RootStoreUtils;
    elementsStore: ElementsStore;
    launchStore: LaunchStore;
    themeStore: ThemeStore;
    cauldronStore: CauldronStore;

    constructor() {
        makeAutoObservable(this);
        this.utils = new RootStoreUtils(this);
        this.elementsStore = new ElementsStore();
        this.launchStore = new LaunchStore(this);
        this.themeStore = new ThemeStore();
        this.cauldronStore = new CauldronStore(this.elementsStore);
    }

    startWithParsed() {
        this.elementsStore.startWithParsed(this.launchStore.elementsParsed);
    }
}

export default new RootStore();