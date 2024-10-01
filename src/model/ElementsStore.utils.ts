import Papa from 'papaparse';
import { TElement, TElementBase, TElementRuntime, TElementVisual } from "./Element";

export const formatId = (id: string): string => (id || "").trim().toLowerCase(); // без ошибки за пустой id в утилях

export type Tadd = Partial<TElement> & TElementBase;
export type Tcsv = TElementBase & TElementVisual & Partial<TElementRuntime>;
export type TError = {
    i: number,
    er: string;
    element: Tcsv;
    id: string;
    ids?: string[]
};

export const parseCSV = (csvRaw: string): Tcsv[] => {
    // https://github.com/mholt/PapaParse/blob/master/papaparse.js#L1345
    const parentIds_config = {
        delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP].concat([' ']),
        transform: (value: string, _field: string): string => {
            return formatId(value);
        }
    }
    const transform = (value: string, field: string) => {
        if (field === 'id') formatId(value);
        if (field === 'comment') return '';
        if (field === 'parentIds') {
            // NOTE: создавая элементы в табличном редакторе, не следует отвлекаться на форматирование массивов
            // `water , air `, `" water, air"`, 
            // `"water	air" (delimeter is tab), 
            // `"water,  air" (delimeter is comma, tab is typo)`
            // `water air` (delimeter is spacebar it's ok), 
            // `water    air`, `water,,air,` (several delimeters, typo) will (ignore empty id's) produce: ["water", "air"], 
            // `"water air"` (delimeter is spacebar), 
            const _value = value.trim().replace(/\s*,\s*/g, ',');
            if (!_value.length) return [];
            const parsedIds = Papa.parse<string[]>(_value, parentIds_config);
            const firstError = parsedIds.errors[0];
            if (firstError) {
                let er = `ElementsStore.parseCSV.transform.parentIds: `;
                const erInfo = {
                    rawIds: value,
                    parsedIds,
                    parentIds_config,
                    csvRaw
                }
                if (firstError.code === "UndetectableDelimiter") {
                    er += `"UndetectableDelimiter" error found; only one parent element found (zero, or at least two is required)`;
                } else {
                    er += `have error isn't "UndetectableDelimiter"`;
                }
                console.warn({ er, ...erInfo });
                throw new Error(er);
            }
            const parsedLines = parsedIds.data;
            const firstLine = parsedLines[0];
            // do not repeat error .length===1 here
            return firstLine.filter(v => v.length);
        }
        return value.trim();
    }
    const parseConfig = {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        comments: '#',
        transform
    };
    const startAt = performance.now();
    const parsed = Papa.parse<Tcsv>(csvRaw, parseConfig);
    const elements = parsed.data.filter((v: Tcsv) => !!v.id).filter((v: Tcsv) => !v.id.startsWith('#'));
    elements.forEach((element) => {
        // NOTE: неправильно, т.к. говорит об ошибках форматирования, но потребуются малополезные переделки текущего кода (не FIXME)
        if (!('parentIds' in element)) {
            // runtime error
            //@ts-ignore
            element.parentIds = [];
        }
    });
    const finishAt = performance.now();
    const withWarnings = parsed.errors.length;
    console.info(
        "%c%sCSV with %d elements (%d rows) parsed by %fms",
        withWarnings ? "background: #dd9; color: #633; padding: 0.25em 1em 0.25em 1em" : "",
        withWarnings ? "⚠ (with warnings) " : "",
        elements.length,
        parsed.data.length,
        (finishAt - startAt).toFixed(2),
    );
    // NOTE: если что-то не так с парсингом: 
    // - отчет обязательно покажем
    // - НЕ факт, что это серьезная ошибка
    // - НЕ факт, что пустой parsed.errors означает корректный парсинг
    // - до логических ошибок МОЖЕМ не доходить
    // - для логических ошибок УЖЕ выводится суммарный отчет; недостачу данных перекинем в логические
    if ('renamedHeaders' in parsed.meta) {
        const renamesCount = Object.keys(parsed.meta.renamedHeaders || {}).length;
        if (renamesCount > 0) {
            const er = `ElementsStore.parseCSV: the result contains .renamedHeaders (don't dublicate columns) https://www.papaparse.com/docs#meta`;
            console.info({ er, renamedHeaders: parsed.meta.renamedHeaders, parseConfig, parsed, csvRaw });
            throw new Error(er);
        }
    }
    if (elements.length === 0) {
        const er = `No elements found (wrong file was used?)`;
        console.info({ er, parseConfig, parsed, csvRaw });
        throw new Error(er);
    }
    if (elements.length === 1) {
        const er = `At least two elements is required (one found)`;
        console.info({ er, parseConfig, parsed, csvRaw });
        throw new Error(er);
    }
    if (parsed.errors.length) {
        console.warn(
            `ElementsStore.parseCSV: parsed with errors; maybe, csvRaw.trim() slice the whole "\\t\\t\\n" (instead of "\\n" only) at end of input`,
            {
                errors: parsed.errors,
                parseConfig, parsed, csvRaw
            }
        );
    }
    return elements;
}

export const findLogicalErrorsInElements = (elements: Tcsv[]): TError[] => {
    const errors: TError[] = [];
    const declaredIds: Record<string, boolean> = {};
    const requiredIds: Record<string, boolean> = {};
    elements.forEach(element => {
        declaredIds[element.id] = true;
        element.parentIds.forEach(id => {
            requiredIds[id] = true;
        });
    });
    const push = (er: string, element: Tcsv, ids?: string[]): TError => {
        const ret = {i: errors.length+1, er, id: element.id, ids, element};
        errors.push(ret);
        return ret;
    };

    const declaredIds2: Record<string, boolean> = {};
    elements.forEach(element => {
        if (declaredIds2[element.id]) {
            push("Dublicate .id", element);
        }
        declaredIds2[element.id] = true;
    });

    elements.forEach(element => {
        if (!('title' in element)) {
            // runtime error
            push("No .title column", element);
        }
    });
    elements.forEach(element => {
        if (!('mdIcon' in element)) {
            // runtime error
            push("No .mdIcon column", element);
        }
    });
    
    elements.forEach(element => {
        if ((element.id || '').includes(' ')) {
            push(".id contains the spacebar", element);
        }
    });
    elements.forEach(element => {
        if ('title' in element && !element.title) {
            push(".title is empty", element);
        }
    });
    elements.forEach(element => {
        if ((element.title || '').length > 30) {
            push("Too long .title (30 chars max)", element);
        }
    });
    elements.forEach(element => {
        if ('mdIcon' in element && !element.mdIcon) {
            push(".mdIcon is empty", element);
        }
    });

    elements.forEach(element => {
        if (element.parentIds.length === 1) {
            push("Only one parent", element, element.parentIds);
        }
    });
    elements.forEach(element => {
        if (element.parentIds.length > 4) {
            push("Too many parents (4 max)", element, element.parentIds);
        }
    });
    elements.forEach(element => {
        const unknownParents = element.parentIds.filter(id => !declaredIds[id]);
        if (unknownParents.length) {
            push("Stanalone element (no parents, no children)", element, unknownParents);
        }
    });

    elements.forEach(element => {
        if (!element.parentIds.length) {
            // no parents
            if (!requiredIds[element.id]) {
                // no children
                push("Stanalone element (no parents, no children)", element);
            }
        }
    });
    elements.forEach(element => {
        const id = element.id;
        if (element.parentIds.includes(id)) {
            push("Self-hosted element (own .id in own .parentIds)", element, element.parentIds);
        }
    });

    return errors;
}