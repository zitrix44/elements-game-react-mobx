import { makeAutoObservable, reaction, toJS } from "mobx";
import ElementsStore from "./ElementsStore";
import CauldronStore from "./CauldronStore";
import Element from "./Element";

export default class DiscoverStore {
    // магазин открытий; и не поспоришь
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
                // если в котле находится рецепт (набор элементов) для нового элемента - откроем новый элемент (и оповестим пользователя)
                // если рецепт пропал из котла (из-за .discover) - ничего не делаем
                // измениться рецепт не может по правилам игры (может появиться, пропасть, снова появиться, снова пропасть)
                if (!containsRecipeFor.length) {
                    // NOTE: lazy/atom были бы техничнее, но и потребовали бы больше кода
                    return;
                }
                this.discovered = containsRecipeFor.map(id => this.#elementsStore.byId[id]);
                this.discovered.forEach(v => v.discover());
            }
        )
    }

    reset() {
        this.discovered = [];
    }
}