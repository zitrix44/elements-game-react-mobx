import { makeAutoObservable, reaction } from "mobx";
import ElementsStore from "./ElementsStore";
import CauldronStore from "./CauldronStore";
import Element from "./Element";
import ThemeStore from "./ThemeStore";
import { toastSuccess, toastInfo } from "../utils/toasts";

export default class DiscoverStore {
    // магазин открытий; и не поспоришь
    #elementsStore: ElementsStore;
    #themeStore: ThemeStore;
    #cauldronStore: CauldronStore;
    discovered: Element[] = [];
    discoveredId: string[] = [];
    
    constructor(elementsStore: ElementsStore, themeStore: ThemeStore, cauldronStore: CauldronStore) {
        this.#elementsStore = elementsStore;
        this.#themeStore = themeStore;
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
                this.discoveredId = containsRecipeFor.slice();
                this.discovered.forEach(v => v.discover());
                // если оверлей показывать не нужно, вызовем reset (но закинем обновку в toast)
                const undiscoveredElementsCount = this.#elementsStore.undiscoveredElementsCount;
                if (!undiscoveredElementsCount) {
                    // если мы прошли игру - покажем победный оверлей
                    toastSuccess('You win');
                    return;
                }
                if (this.#themeStore.noDiscoverOverlay) {
                    this.discovered.forEach(v => {
                        toastInfo(`You discover ${v.title}`);
                    });
                    this.reset();
                    return;
                }
            }
        )
    }

    reset() {
        this.discovered = [];
        this.discoveredId = [];
    }
}