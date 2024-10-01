import { makeAutoObservable } from "mobx";
import ElementsStore from "./ElementsStore";
import LaunchStore from "./LaunchStore";
import RootStoreUtils from "./RootStoreUtils";

export class RootStore {
    utils: RootStoreUtils;
    elementsStore: ElementsStore;
    launchStore: LaunchStore;

    constructor() {
        makeAutoObservable(this);
        this.utils = new RootStoreUtils(this);
        this.elementsStore = new ElementsStore();
        this.launchStore = new LaunchStore(this);
    }
}

export default new RootStore();