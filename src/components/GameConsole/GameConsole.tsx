import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

import ElementsTable, { Tallows } from "./ElementsTable";
import useRootStore from "../../Contexts";
import { makeAutoObservable, toJS } from "mobx";
import { toastError, toastInfo, toastSuccess } from "../../utils/toasts";

import './GameConsole.css';
import { TElement } from "../../model/Element";
import { ElementsTableContext, ElementsTableContextData } from "./ElementsTableContext";
import useElementsTableContext, { useConsole } from "./ElementsTableContext";

let cheatsCount = 0;

type TElementsTableContext = {
    elements: TElement[];
    allows: Tallows;
};

const ConsoleFooter = observer(() => {
    const c = useConsole();
    if (c.deletingMode === "multiple") {
        return <>
            <button className="btn btn-danger me-3" onClick={()=>c.delete()}>Delete all selected elements</button>
            <button className="btn btn-outline-primary" onClick={()=>c.deleteCancel()}>Cancel</button>
        </>;
    }
    return <>
        <a href="#console-top" className="btn btn-primary btn-lg">To top</a>
    </>;
});

const GameConsole = observer(() => {
    const [justMounted, setJustMounted] = useState<boolean>(true);
    const [wide, setWide] = useState<boolean>(true);
    const [atRight, setAtRight] = useState<boolean>(true);
    const [transparent, setTransparent] = useState<boolean>(false);
    const transparentButtonRef = useRef<HTMLButtonElement>(null);
    const [store] = useRootStore();
    const elements = toJS(
        store.consoleStore.deletingMode === "multiple"
            ? Object.keys(store.consoleStore.deleteConfirmations)
                .map(id => store.elementsStore.byId[id])
            : store.elementsStore.array
    );
    useEffect(()=>{
        setJustMounted(false);
    }, []);
    const ctxData = new ElementsTableContextData(elements, {});
    return <>
        <div 
            className={`
                console 
                console-${wide ? "wide" : "compact"} 
                console-${atRight ? "at-right" : "not-at-right"}
                console-${transparent ? "transparent" : "not-transparent" }
                console-${justMounted ? "just-mounted" : "mounted" }
            `}
        >
            <ElementsTableContext.Provider value={ctxData}>
                <div className="row mb-4 pt-4 mx-0" id="console-top">
                    <div className="col">
                        <div className="panel-controls btn-toolbar justify-content-end" role="toolbar" aria-label="Game's console toolbar">
                            <div className="style-controls btn-group mx-3 me-1" role="group" aria-label="Console style">
                                <button 
                                    type="button" 
                                    className={`btn ${transparent ? "btn-secondary" : "btn-outline-secondary"}`}
                                    onClick={()=>{
                                        setTransparent(!transparent);
                                        transparentButtonRef.current?.blur(); // "?." :)
                                    }}
                                    title='Switch transparent'
                                    ref={transparentButtonRef}
                                >
                                    <span 
                                        className="material-symbols-outlined" 
                                    >{transparent ? 'humidity_high' : 'opacity'}</span>
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn ${atRight ? "btn-secondary" : "btn-outline-secondary"}`}
                                    onClick={()=>setAtRight(!atRight)}
                                    title='Switch position (right/center)'
                                >
                                    <span 
                                        className="material-symbols-outlined" 
                                    >align_horizontal_right</span>
                                </button>
                            </div>
                            <div className="size-controls btn-group mx-3 me-1" role="group" aria-label="Console size">
                                <button 
                                    type="button" 
                                    className={`btn ${!wide ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={()=>setWide(!wide)}
                                    title='Compact mode'
                                >
                                    <span 
                                        className="material-symbols-outlined" 
                                        style={{rotate: "90deg"}}
                                    >vertical_align_center</span>
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn ${wide ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={()=>setWide(!wide)}
                                    title='Default size (wider)'
                                >
                                    <span className="material-symbols-outlined">fit_width</span>
                                </button>
                            </div>
                            <button 
                                type="button" 
                                className={`close-console-panel btn`}
                                onClick={()=>{
                                    store.consoleStore.hideConsole();
                                }}
                                title="Close console panel"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>
                </div>
                <ElementsTable />
                <div className="mx-5 my-4">
                    <ConsoleFooter />
                </div>
            </ElementsTableContext.Provider>
        </div>
    </>
});

export default GameConsole;