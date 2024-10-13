import { useId, useTransition } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

import { Card } from "../Tabletop";
import Element from "../../model/Element";
import { TColorScheme } from "../../model/ThemeStore.colors";

import useRootStore from "../../Contexts";

import "./ThemeSettings.css";
import { number } from "zod";

const SelectedShapeMark = observer(() => {
    return <>
        <div className="selected-shape-mark">
            Selected
        </div>
    </>
});

const ColorSchemeRadio = observer(({id, curId, onChange}: TColorScheme & {curId:string, onChange:(id:string)=>void}) => {
    const inputId = useId();
    return <>
        <div className="form-check">
            <input 
                className="form-check-input" 
                type="radio" 
                name="color-scheme" 
                checked={id===curId}
                id={inputId} 
                onChange={() => onChange(id)}
            />
            <label className="form-check-label" htmlFor={inputId}>
                {id}
                {id === "Unicorn" && <span className="badge text-bg-warning ms-2" style={{visibility: id === curId ? "visible" : "hidden"}}>High CPU usage</span>}
            </label>
        </div>
    </>;
});

const RangeValue = observer(({v, def, unit=''}: {v:number, def:number, unit?:string}) => {
    return ` (${v}${unit}${ v==def ? ', default value' : ''})`
});

const BackgroundBlock = observer(()=>{
    const [store] = useRootStore();
    const [bgTransition, startBgTransition] = useTransition();
    const randomSeedId = useId();
    const opacityId = useId();
    const constrastId = useId();
    const brightnessId = useId();
    return <>
        <label htmlFor={randomSeedId} className="form-label">
            Random seed 
            <RangeValue v={store.themeStore.gameBgRandomSeed} def={0} />
        </label>
        <input 
            type="range" className="form-range" 
            min="0" max="222" step="1"
            id={randomSeedId}
            value={store.themeStore.gameBgRandomSeed}
            onChange={(e) => {
                startBgTransition(()=>{
                    store.themeStore.setBgRandomSeed(e.target.valueAsNumber);
                });
            }}
        ></input>
        <label htmlFor={opacityId} className="form-label">
            Opacity
            <RangeValue v={Math.round(100 * store.themeStore.gameBgOpacity)} def={100} unit="%" />
        </label>
        <input 
            type="range" className="form-range" 
            min="0" max="1" step="0.05"
            id={opacityId}
            value={store.themeStore.gameBgOpacity}
            onChange={(e) => {
                startBgTransition(()=>{
                    store.themeStore.setBgOpacity(e.target.valueAsNumber);
                });
            }}
        ></input>
        <label htmlFor={constrastId} className="form-label">
            Contrast 
            <RangeValue v={Math.round(100 * store.themeStore.gameBgContrast)} def={100} unit="%" />
        </label>
        <input 
            type="range" className="form-range" 
            min="0.5" max="1.5" step="0.05"
            id={constrastId}
            value={store.themeStore.gameBgContrast}
            onChange={(e) => {
                startBgTransition(()=>{
                    store.themeStore.setBgContrast(e.target.valueAsNumber);
                });
            }}
        ></input>
        <label htmlFor={brightnessId} className="form-label">
            Brightness 
            <RangeValue v={Math.round(100 * store.themeStore.gameBgBrightness)} def={100} unit="%" />
        </label>
        <input 
            type="range" className="form-range" 
            min="0.5" max="1.5" step="0.05"
            id={brightnessId}
            value={store.themeStore.gameBgBrightness}
            onChange={(e) => {
                startBgTransition(()=>{
                    store.themeStore.setBgBrightness(e.target.valueAsNumber);
                });
            }}
        ></input>
    </>;
});

const ThemeSettings = observer(()=>{
    const [store] = useRootStore();
    const shape = store.themeStore.selectedShapeId;
    const isBasic = shape === "basic";
    const isComix = shape === "comix";
    const isPentagon = shape === "pentagon";
    const basicElement = toJS( new Element({id: "basic", i: 0, title: "Basic", mdIcon: "military_tech", parentIds: []}) );
    const comixElement = toJS( new Element({id: "comics", i: 0, title: "Comics", mdIcon: "ar_stickers", parentIds: []}) );
    const pentagonElement = toJS( new Element({id: "pentagon", i: 0, title: "Pentagon", mdIcon: "pentagon", parentIds: []}) );
    const chooseScheme = (id: string) => {
        store.themeStore.selectColorScheme(id);
    };
    return <>
        <div className="theme-settings">
            <div className="px-5 py-5">
                <div className="theme-settings-close">
                    <span 
                        className="material-symbols-outlined"
                        onClick={() => store.themeStore.hideThemeSettings()}
                    >close</span>
                </div>
                <div className="d-flex justify-content-start gap-5">
                    <div>
                        <h3>Card shape</h3>
                        <div className="hstack gap-4">
                            <div className={`ecard-shape-preview ecard-shape-basic ${isBasic ? "pe-none" : ""}`}>
                                <Card 
                                    element={basicElement} 
                                    onClick={()=>{
                                        store.themeStore.selectShape("basic");
                                    }} 
                                    drawHelloAnimation={false} 
                                />
                                { isBasic && <SelectedShapeMark /> }
                            </div>
                            <div className={`ecard-shape-preview ecard-shape-comix ${isComix ? "pe-none" : ""}`}>
                                <Card 
                                    element={comixElement} 
                                    onClick={()=>{
                                        store.themeStore.selectShape("comix");
                                    }} 
                                    drawHelloAnimation={false} 
                                />
                                { isComix && <SelectedShapeMark /> }
                            </div>
                            <div className={`ecard-shape-preview ecard-shape-pentagon ${isPentagon ? "pe-none" : ""}`}>
                                <Card 
                                    element={pentagonElement} 
                                    onClick={()=>{
                                        store.themeStore.selectShape("pentagon");
                                    }} 
                                    drawHelloAnimation={false} 
                                />
                                { isPentagon && <SelectedShapeMark /> }
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-3">Card color</h3>
                        {store.themeStore.colorSchemes.map(v => {
                            return <ColorSchemeRadio 
                                key={v.id} 
                                curId={store.themeStore.selectedColorSchemeId} 
                                onChange={(id)=>chooseScheme(id)}
                                {...toJS(v)} 
                            />
                        })}
                    </div>
                    <div style={{maxWidth: "300px"}}>
                        <h3 className="mb-3">Background</h3>
                        <BackgroundBlock />
                    </div>
                </div>
            </div>
        </div>
    </>
});

export default ThemeSettings;