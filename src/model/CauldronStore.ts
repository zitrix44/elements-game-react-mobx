import { makeAutoObservable } from "mobx";
import ElementsStore from "./ElementsStore";
import { concatIds } from "./ElementsStore.utils";

// NOTE: не котёл-магазин, не горшок-базар, не сковородкин склад, а современная методология разработки

export default class CauldronStore {
    #elementsStore: ElementsStore;
    slotA?: string;
    slotB?: string;
    slotC?: string;

    constructor(elementsStore: ElementsStore) {
        this.#elementsStore = elementsStore;
        makeAutoObservable(this);
    }

    get haveEmptySlot(): boolean {
        return !this.slotA || !this.slotB || !this.slotC;
    }

    get content(): string {
        return concatIds([this.slotA, this.slotB, this.slotC]);
    }

    get containsRecipeFor(): string[] {
        const content = this.content;
        return this.#elementsStore.array
            .filter(v => !v.discovered)
            .filter(v => v.parents === content)
            .map(v => v.id);
    }

    put(id: string) {
        if (!this.#elementsStore.hasId(id)) {
            throw new Error(`CauldronStore.put: Unknown element id: "${id}"`);
        }
        if (!this.slotA) {
            this.slotA = id;
            return;
        }
        if (!this.slotB) {
            this.slotB = id;
            return;
        }
        if (!this.slotC) {
            this.slotC = id;
            return;
        }
        throw new Error(`CauldronStore.put: Have no place for receive an element`);
    }

    withdraw(id: string) {
        if (this.slotA === id) {
            this.withdrawA();
            return;
        }
        if (this.slotA === id) {
            this.withdrawB();
            return;
        }
        if (this.slotA === id) {
            this.withdrawC();
            return;
        }
    }

    withdrawA() {
        if (!this.slotA) {
            throw new Error(`CauldronStore.withdrawA: no element in slot#A`);
        }
        this.slotA = undefined;
    }
    withdrawB() {
        if (!this.slotB) {
            throw new Error(`CauldronStore.withdrawB: no element in slot#B`);
        }
        this.slotB = undefined;
    }
    withdrawC() {
        if (!this.slotC) {
            throw new Error(`CauldronStore.withdrawC: no element in slot#C`);
        }
        this.slotC = undefined;
    }
}