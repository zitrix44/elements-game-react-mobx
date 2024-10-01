import { makeAutoObservable } from "mobx";
import { formatId, parseCSV, findLogicalErrorsInElements, TError, type Tadd, type Tcsv } from "./ElementsStore.utils";
import Element from "./Element";

type TaddOptions = {
    skipInit?: boolean;
};

export default class ElementsStore {
    array: Element[] = [];
    byId: Record<string, Element> = {};

    static formatId = formatId;

    constructor() {
        makeAutoObservable(this);
    }

    hasId(id: string) {
       return id in this.byId; 
    }

    add(data: Tadd | Tadd[], options?: TaddOptions) {
        if (Array.isArray(data)) {
            return this.addMany(data, options);
        } else {
            return this.addOne(data, options);
        }
    }

    addMany(data: Tadd[], options: TaddOptions = {}) {
        return data.map(v => this.addOne(v, options));
    }

    addOne(data: Tadd, options: TaddOptions = {}) {
        const id = data.id;
        if (this.hasId(id)) {
            const er = `ElementsStore.add: element with id "${id}" is already exists`;
            console.info({er, exist: this.byId[id], arrived: data});
            throw new Error(er);
        }
        const v = new Element(data);
        if (!options.skipInit) {
            if (Element.isRuntime(data)) v.init(data);
        }
        this.array.push(v);
        this.byId[v.id] = v;
        return v;
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

    // parseCSV(csvRaw: string): Tadd[] {
    //     // https://github.com/mholt/PapaParse/blob/master/papaparse.js#L1345
    //     const parentIds_config = {
    //         delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP].concat([' ']),
    //         transform: (value: string, _field: string): string => {
    //             return ElementsStore.formatId(value);
    //         }
    //     }
    //     const transform = (value: string, field: string) => {
    //         if (field === 'id') ElementsStore.formatId(value);
    //         if (field === 'comment') return '';
    //         if (field === 'parentIds') {
    //             // NOTE: создавая элементы в табличном редакторе, не следует отвлекаться на форматирование массивов
    //             // `water , air `, `" water, air"`, 
    //             // `"water	air" (delimeter is tab), 
    //             // `"water,  air" (delimeter is comma, tab is typo)`
    //             // `water air` (delimeter is spacebar it's ok), 
    //             // `water    air`, `water,,air,` (several delimeters, typo) will (ignore empty id's) produce: ["water", "air"], 
    //             // `"water air"` (delimeter is spacebar), 
    //             const _value = value.trim().replace(/\s*,\s*/g, ','); 
    //             if (!_value.length) return [];
    //             const parsedIds = Papa.parse<string[]>(_value, parentIds_config);
    //             const firstError = parsedIds.errors[0];
    //             if (firstError) {
    //                 let er = `ElementsStore.parseCSV.transform.parentIds: `;
    //                 const erInfo = {
    //                     rawIds: value,
    //                     parsedIds, 
    //                     parentIds_config,
    //                     csvRaw
    //                 }
    //                 if (firstError.code === "UndetectableDelimiter") {
    //                     er += `"UndetectableDelimiter" error found; only one parent element found (zero, or at least two is required)`;
    //                 } else {
    //                     er += `have error isn't "UndetectableDelimiter"`;
    //                 }
    //                 console.warn({ er, ...erInfo });
    //                 throw new Error(er); 
    //             }
    //             const parsedLines = parsedIds.data;
    //             const firstLine = parsedLines[0];
    //             // do not repeat error .length===1 here
    //             return firstLine.filter(v => v.length);
    //         }
    //         return value.trim();
    //     }
    //     const parseConfig = {
    //         header:true, 
    //         skipEmptyLines: true,
    //         dynamicTyping: true,
    //         comments: '#',
    //         transform
    //     };
    //     const startAt = performance.now();
    //     const parsed = Papa.parse<Tcsv>(csvRaw, parseConfig);
    //     const elements = parsed.data.filter((v:Tcsv) => !!v.id);
    //     const finishAt = performance.now();
    //     const withWarnings = parsed.errors.length;
    //     console.info(
    //         "%c%sCSV with %d elements (%d rows) parsed by %fms", 
    //         withWarnings ? "background: #dd9; color: #633; padding: 0 0.5em" : "",
    //         withWarnings ? "⚠ (with warnings)" : "",
    //         elements.length, 
    //         parsed.data.length, 
    //         (finishAt - startAt).toFixed(2),
    //     );
    //     // NOTE: если что-то не так с парсингом: 
    //     // - отчет обязательно покажем
    //     // - НЕ факт, что это серьезная ошибка
    //     // - НЕ факт, что пустой parsed.errors означает корректный парсинг
    //     // - до логических ошибок МОЖЕМ не доходить
    //     if ('renamedHeaders' in parsed.meta) {
    //         const renamesCount = Object.keys( parsed.meta.renamedHeaders || {}).length;
    //         if (renamesCount > 0) {
    //             const er = `ElementsStore.parseCSV: the result contains .renamedHeaders (don't dublicate columns) https://www.papaparse.com/docs#meta`;
    //             console.info({er, renamedHeaders: parsed.meta.renamedHeaders, parseConfig, parsed, csvRaw});
    //             throw new Error(er); 
    //         }
    //     }
    //     if (parsed.errors.length) {
    //         console.warn(
    //             `ElementsStore.parseCSV: parsed with errors; maybe, csvRaw.trim() slice the whole "\\t\\t\\n" (instead of "\\n" only) at end of input`,
    //             {
    //                 errors: parsed.errors,
    //                 parseConfig, parsed, csvRaw
    //             }
    //         );
    //     }
    //     // NOTE: парсинг дал добро, переходим к логическим ошибкам
    //     // - оформляем отчетом (чтобы пользователь сразу понимал глубину проблемы)
    //     // - их лучше группировать (читать удобнее) (один вид ошибок == один цикл)
    //     const errors: {er:string, element: Tadd, id?:string, ids?:string[]}[] = [];
    //     const declaredIds: Record<string, boolean> = {};
    //     const requiredIds: Record<string, boolean> = {};
    //     elements.forEach(element => {
    //         declaredIds[element.id] = true;
    //         element.parentIds.forEach(id => {
    //             requiredIds[id] = true;
    //         });
    //         if (element.parentIds.length === 1) {
    //             errors.push({
    //                 er: "Only one parent",
    //                 id: element.id,
    //                 ids: element.parentIds,
    //                 element,
    //             });
    //         }
    //     });
    //     elements.forEach(element => {
    //         const unknownParents = element.parentIds.filter(id => !declaredIds[id]);
    //         if (unknownParents.length) {
    //             errors.push({
    //                 er: "Unkown parents",
    //                 id: element.id,
    //                 ids: unknownParents,
    //                 element,
    //             });
    //         }
    //     });
    //     elements.forEach(element => {
    //         const id = element.id;
    //         if (!element.parentIds.length) {
    //             // no parents
    //             if (!requiredIds[id]) {
    //                 // no children
    //                 errors.push({
    //                     er: "Stanalone element (no parents, no children)",
    //                     id: element.id,
    //                     element,
    //                 });
    //             }
    //         }
    //     });
    //     elements.forEach(element => {
    //         const id = element.id;
    //         if (element.parentIds.includes(id)) {
    //             errors.push({
    //                 er: "Self-hosted element (own .id in own .parentIds)",
    //                 id: element.id,
    //                 ids: element.parentIds,
    //                 element,
    //             });
    //         }
    //     });
    //     if (errors.length) {
    //         const er = `ElementsStore.parseCSV: logical errors in CSV's content (see console for details)`;
    //         console.info({er, errors, elements, parseConfig, parsed, csvRaw});
    //         throw new Error(er); 
    //     }
    //     return elements;
    // }
}