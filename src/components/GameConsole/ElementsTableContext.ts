import React from "react";
import { makeAutoObservable } from "mobx";
import { TElement } from "../../model/Element";
import { Tallows } from "./ElementsTable";
import useRootStore from "../../Contexts";

type TElementsTableContext = {
    elements: TElement[];
    allows: Tallows;
    editingFadeoutById: Record<string, true>;
};

class ElementsTableContextData implements TElementsTableContext {
    static allowsAll: Tallows = {
        update: true,
        delete: true,
        discover: true,
    }
    elements: TElement[];
    allows: Tallows;
    editingFadeoutById: Record<string, true> = {};

    constructor(elements: TElement[], allows: Partial<Tallows>) {
        makeAutoObservable(this);
        this.elements = elements;
        this.allows = {...ElementsTableContextData.allowsAll, ...allows};
        this.editingFadeoutById = {};
    }

    async fadeout(id: string, activate: boolean): Promise<boolean> {
        if (activate) {
            this.editingFadeoutById[id] = true;
            return new Promise((resolve) => {
                setTimeout(()=>{
                    resolve(this.editingFadeoutById[id]);
                    delete this.editingFadeoutById[id];
                }, 1_000);
            })
        } else {
            delete this.editingFadeoutById[id];
            return true;
        }
    }
}

const useConsole = () => {
    return useRootStore()[0].consoleStore;
}

const ElementsTableContext = React.createContext<ElementsTableContextData>(new ElementsTableContextData([], {}));

export {
    ElementsTableContextData,
    ElementsTableContext,
    useConsole,
};

const useElementsTableContext = () => {
    return React.useContext(ElementsTableContext);
};

export default useElementsTableContext;