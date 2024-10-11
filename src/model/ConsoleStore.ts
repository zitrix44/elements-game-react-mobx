import { makeAutoObservable, toJS } from "mobx";
import { RootStore } from "./RootStore";
import { TElementUpdate } from "./ElementsStore";
import { toastError, toastInfo, toastSuccess } from "../utils/toasts";
import { TElement } from "./Element";

export type TupdatesById = Record<string, TElementUpdate>;
export type TdiscoverStrategy = "simple" | "cauldron";

export default class ConsoleStore {
    #rootStore: RootStore;
    updates: TupdatesById = {};
    deleteConfirmations: Record<string, true> = {};

    active = true;
    discoveredByConsole = 0;
    discoverStrategy: TdiscoverStrategy = "simple";

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.#rootStore = rootStore;
    }

    get byId(): TupdatesById {
        return this.#rootStore.elementsStore.array.reduce((ret, v) => {
            ret[v.id] = this.updates[v.id] || toJS(v as TElementUpdate);
            return ret;
        }, {} as TupdatesById);
    }

    showConsole() {
        this.active = true;
    }
    hideConsole() {
        this.active = false;
    }

    deleteStart(id: string) {
        this.deleteConfirmations[id] = true;
    }
    deleteCancel(id: string) {
        delete this.deleteConfirmations[id];
    }
    delete(id: string) {
        // FIXME: доделать
        if (!this.deleteConfirmations[id]) {
            throw new Error(`No deleting confirmation for #${id}`);
        }
    }

    updateStart(id: string) {
        if (id in this.updates) return;
        this.updates[id] = toJS(this.#rootStore.elementsStore.byId[id] as TElementUpdate);
    }
    update(data: TElementUpdate) {
        const id = data.id;
        if (!(id in this.updates)) {
            throw new Error(`Element #${data.id} isn't in editing`);
        }
        this.updates[id] = data;
    }
    updateCancel(id: string) {
        delete this.updates[id];
    }
    updateStop(id: string) {
        this.updateCancel(id);
    }
    updateFinish(id: string, autoStop = true): boolean {
        try {
            this.#rootStore.elementsStore.update(id, this.updates[id]);
            if (autoStop) this.updateStop(id);
            return true;
        } catch(er) {
            toastError((er as Error).message);
            return false;
        }
    }

    async discover(id: string): Promise<boolean> {
        return this.discoverSimple(id);
    }
    discoverSimple(id: string): boolean {
        const el = this.#rootStore.elementsStore.byId[id];
        if (el.discovered) {
            toastError(`${el.title} is already discovered`);
            return false;
        }
        el.discover();
        this.discoveredByConsole++;
        toastInfo(`Cheater ${this.discoveredByConsole > 1 ? `×${this.discoveredByConsole}` : ""}`);
        if (this.#rootStore.elementsStore.undiscoveredElementsCount === 0) {
            toastSuccess(`Console win ;)`);
        }
        return true;
    }
    async discoverCauldron(id: string, delay = 500): Promise<boolean> {
        // FIXME: доделать (возможно, flow)
        const el = this.#rootStore.elementsStore.byId[id];
        if (el.discovered) {
            toastError(`${el.title} is already discovered`);
            return false;
        }
        return new Promise((resolve, reject) => {
            // runInAction
        });
    }
}