import { makeAutoObservable } from "mobx";
import { formatId, parseCSV, findLogicalErrorsInElements, TError, type Tadd, type Tcsv, concatIds, sortIds } from "./ElementsStore.utils";
import Element, { TElement } from "./Element";
import { envNumber } from "../utils";

type TaddOptions = {
    skipInit?: boolean;
    skipLevel?: boolean;
    skipReorder?: boolean;
};

export default class ElementsStore {
    array: Element[] = [];
    byId: Record<string, Element> = {};
    mdIconById: Record<string, string> = {};

    static formatId = formatId;
    static sortIds = sortIds;
    static concatIds = concatIds;

    constructor() {
        makeAutoObservable(this);
    }

    get undiscoveredElementsCount(): number {
        return this.array.filter(v => !v.discovered).length;
    }

    hasId(id: string) {
       return id in this.byId; 
    }

    addMany(data: Tadd[], options: TaddOptions = {}): Element[] {
        const options_ = { ...options, skipLevel: true, skipReorder: true };
        const elements = data.map(v => this.addOne(v, options_));
        // @TODO: tail.length === tail.filter(...).length
        const iterMax = Math.max(elements.length+1, envNumber('FIND_ELEMENTS_LEVEL_MAX_ITERATION') || 1000);
        let iterCur = -1;
        const iter = (tail: Element[]) => {
            if (!tail.length) return;
            iterCur++;
            if (iterCur > iterMax) {
                const er = `ElementsStore.addMany: found level max iterations reached`;
                console.info({er, tail, elements});
                throw new Error(er); 
            }
            tail.forEach(el => {
                const parentLevels = el.parentIds.map(v => this.byId[v].level);
                if (parentLevels.includes(-1)) return;
                el.setLevel(this.calcLevel(el.id));
            });
            iter(tail.filter(v => v.level === -1));
        }
        iter(elements.slice());
        if (!options.skipReorder) {
            this.#reorder();
        }
        return elements;
    }

    addOne(data: Tadd, options: TaddOptions = {}): Element {
        const id = data.id;
        if (this.hasId(id)) {
            const er = `ElementsStore.add: element with id "${id}" is already exists`;
            console.info({er, exist: this.byId[id], arrived: data});
            throw new Error(er);
        }
        const v = new Element({i: this.array.length, ...data});
        if (!options.skipInit) {
            if (Element.isRuntime(data)) v.init(data);
            if (!options.skipLevel) {
                v.setLevel(this.calcLevelByParentIds(v.parentIds));
            }
        }
        this.array.push(v);
        this.byId[v.id] = v;
        this.mdIconById[v.id] = v.mdIcon;
        if (!options.skipReorder) {
            this.#reorder();
        }
        return v;
    }

    calcLevel(id: string): number {
        return this.calcLevelByParentIds(this.byId[id].parentIds);
    }
    calcLevelByParentIds(parentIds: string[]): number {
        if (!parentIds.length) return 0;
        const parentLevels = parentIds.map(v => this.byId[v].level);
        const distantLevel = Math.max.apply(Math, parentLevels);
        return distantLevel + 1;
    }

    #reorder() {
        this.array.sort((a:Element, b:Element) => {
            if (a.level === b.level) return a.title > b.title ? 1 : -1;
            return a.level > b.level ? 1 : -1;
        })
    }

    startWithParsed(elements: Tcsv[]) {
        this.addMany(elements);
    }

    parseCSV(csvRaw: string): Tcsv[] {
        return parseCSV(csvRaw);
    }
    
    findLogicalErrorsInElements(elements: Tcsv[]): TError[] {
        return findLogicalErrorsInElements(elements);
    }

    throwLogicalErrorsInElements(errors: TError[], elements?: Tadd[]) {
        if (!errors.length) return;
        const er = `ElementsStore.parseCSV: logical errors in CSV's content (see console for details)`;
        console.info({er, errors, elements});
        throw new Error(er); 
    }

    update(id: string, data: Partial<TElement>) {
        if (!(id in this.byId)) {
            throw new Error(`Unknown id "${id}"`);
        }
        data.parentIds?.forEach(v => {
            if (!(v in this.byId)) throw new Error(`Unknown parent id "${v}" (updating ${id})`);
        });
        const element = this.byId[id];
        element.title = data.title || element.title;
        element.mdIcon = data.mdIcon || element.mdIcon;
    }
}