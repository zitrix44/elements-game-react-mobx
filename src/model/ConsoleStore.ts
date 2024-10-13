import { makeAutoObservable, toJS } from "mobx";
import { RootStore } from "./RootStore";
import { TElementUpdate } from "./ElementsStore";
import { toastError, toastInfo, toastSuccess } from "../utils/toasts";
import { TElement } from "./Element";

export type TupdatesById = Record<string, TElementUpdate>;
export type TdeletingMode = "single" | "multiple" | false;
export type TdiscoverStrategy = "simple" | "cauldron";

export default class ConsoleStore {
    #rootStore: RootStore;
    updates: TupdatesById = {};
    deletingMode: TdeletingMode = false;
    deleteConfirmations: Record<string, true> = {};
    
    active = false;
    haveUpdates = false;
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
        if (this.deletingMode) {
            throw new Error(`Deleting mode already is in progress`);
        }
        if (Object.keys(this.updates).length) {
            throw new Error(`Can't launch deleting mode while editing mode is in air`);
        }
        const toDelete = this.#rootStore.elementsStore.getDescendantOrSelf(id);
        if (toDelete.length === 1) {
            this.deletingMode = "single";
        } else {
            this.deletingMode = "multiple";
        }
        this.deleteConfirmations = toDelete
            .map(v => v.id)
            .reduce(
                (s,v:string)=>(s[v] = true, s), 
                {} as typeof this.deleteConfirmations
            );
    }
    deleteCancel() {
        this.#deleteStop();
    }
    #deleteStop() {
        this.deletingMode = false;
        this.deleteConfirmations = {};
    }
    delete() {
        // FIXME: доделать
        if (!this.deletingMode) {
            throw new Error(`No elements to delete`);
        }
        toastError(`TODO: elements deletion`);
        this.#deleteStop();
    }

    updateStart(id: string) {
        if (this.deletingMode) {
            throw new Error(`Deleting mode is in progress`);
        }
        if (id in this.updates) return;
        this.updates[id] = toJS(this.#rootStore.elementsStore.byId[id] as TElementUpdate);
        this.haveUpdates = true;
    }
    update(data: TElementUpdate) {
        const id = data.id;
        if (!(id in this.updates)) {
            throw new Error(`Element #${data.id} isn't in editing`);
        }
        this.updates[id] = data;
    }
    updateCancel(id: string) {
        this.#updateStop(id);
        this.haveUpdates = Object.keys(this.updates).length > 0;
    }
    #updateStop(id: string) {
        delete this.updates[id];
    }
    updateFinish(id: string, autoStop = true): boolean {
        try {
            this.#rootStore.elementsStore.update(id, this.updates[id]);
            if (autoStop) this.#updateStop(id);
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