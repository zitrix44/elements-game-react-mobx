import { action, makeAutoObservable } from "mobx";
import { formatId, Tcsv, TError } from "./ElementsStore.utils";
import { RootStore } from "./RootStore";

const ER_PREFIX = 'LaunchStore.start: ';

export default class LaunchStore {
    #rootStore: RootStore;

    active = true;

    elementsStartAt: Date | null = null;
    elementsRawCSV: string = "";
    elementsParsed: Tcsv[] = [];
    elementsParsingDurationMS: number = 0;
    elementsParseError: Error | null = null;
    elementsLogicErrors: TError[] = [];
    elementsLogicErrorsFinderMs: number = 0;

    static formatId = formatId;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.#rootStore = rootStore; // toJS(this) skip #private fields
    }

    setElementsCSV(rawCSV: string) {
        this.elementsStartAt = new Date();
        this.elementsRawCSV = rawCSV;
        this.elementsParsed = [];
        this.elementsParsingDurationMS = 0;
        this.elementsParseError = null;
        this.elementsLogicErrors = [];
        this.elementsLogicErrorsFinderMs = 0;
        const startAt = performance.now();
        let parsedAt = startAt;
        let finishAt = startAt;
        try {
            this.elementsParsed = this.#rootStore.elementsStore.parseCSV(this.elementsRawCSV);
            parsedAt = performance.now();
            this.elementsLogicErrors = this.#rootStore.elementsStore.findLogicalErrorsInElements(this.elementsParsed);
            finishAt = performance.now();
        } catch(_er) {
            const er = _er as Error;
            this.elementsParseError = er;
            console.error(er);
            this.#rootStore.utils.toastError(`${er.name}: ${er.message}`);
        } finally {
            this.elementsParsingDurationMS = parsedAt - startAt;
            this.elementsLogicErrorsFinderMs = finishAt - parsedAt;
        }
    }

    toastError(msg: string) {
        this.#rootStore.utils.toastError(msg.replace(ER_PREFIX, ''));
    }

    start() {
        if (!this.active) {
            throw new Error(`${ER_PREFIX}For restart, use .reset(), .start()`);
        }
        if (this.elementsParseError) {
            throw new Error(`${ER_PREFIX}Can't start with .elementsParseError`);
        }
        if (this.elementsLogicErrors.length) {
            throw new Error(`${ER_PREFIX}Can't start with .elementsLogicErrors`);
        }
        this.#rootStore.startWithParsed();
        this.active = false;
    }
}