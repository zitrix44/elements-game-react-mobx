import { makeAutoObservable, reaction, toJS } from "mobx";
import ElementsStore from "./ElementsStore";
import CauldronStore from "./CauldronStore";
import Element from "./Element";

export default class DiscoverStore {
    // магазин открытий; что-то в этом есть
    #elementsStore: ElementsStore;
    #cauldronStore: CauldronStore;
    discovered: Element[] = [];
    
    constructor(elementsStore: ElementsStore, cauldronStore: CauldronStore) {
        this.#elementsStore = elementsStore;
        this.#cauldronStore = cauldronStore;
        makeAutoObservable(this);
        // setTimeout(()=>{
        //     this.discovered = [
        //         this.#elementsStore.byId["air"],
        //         this.#elementsStore.byId["water"],
        //         this.#elementsStore.byId["miscommunication"],
        //     ]
        // }, 1);
        reaction(
            () => this.#cauldronStore.containsRecipeFor,
            containsRecipeFor => {
                if (!containsRecipeFor.length) return;
                this.discovered = containsRecipeFor.map(id => this.#elementsStore.byId[id]);
                this.discovered.forEach(v => v.discover());
            }
        )
    }

    reset() {
        this.discovered = [];
    }
}