import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import ElementsList from "../components/ElementsList";
import GameBG from "../components/GameBG";
import useRootStore from "../Contexts";
import Cauldron from "../components/Cauldron/Cauldron";
import { Card } from "../components/Tabletop";
import { TCardOnClick } from "../components/Tabletop/Card";
import { toastError } from "../utils/toasts";
import DiscoveredOverlay from "../components/DiscoveredOverlay/DiscoveredOverlay";

import { useEffect, useState } from "react";
import GameConsole from "../components/GameConsole/GameConsole";
import OpenConsoleButton from "../components/Tabletop/OpenConsoleButton";
import SaveButton from "../components/Tabletop/SaveButton";
import OpenSettingsButton from "../components/Tabletop/OpenSettingsButton";
import ThemeSettings from "../components/ThemeSettings/ThemeSettings";

import './PageGame.css';

const PageGame = observer(() => {
    const [justMounted, setJustMounted] = useState<boolean>(true);
    const [store] = useRootStore();
    useEffect(()=>{
        setJustMounted(false);
    },[]);
    const elements = store.elementsStore.array;
    const onCardClick: TCardOnClick = (id) => {
        try {
            store.cauldronStore.put(id);
        } catch(er) {
            toastError((er as Error).message);
        }
    }
    return <>
        {/* <a href="#" className="autodownloader">Link for download (autodownload not allowed)</a> */}
        <div className={`page-game color-scheme-${store.themeStore.selectedColorSchemeId}`}>
            <GameBG 
                randomSeed={store.themeStore.gameBgRandomSeed} 
                opacity={store.themeStore.gameBgOpacity} 
                brightness={store.themeStore.gameBgBrightness}
                contrast={store.themeStore.gameBgContrast}
            />
            <Cauldron />
            <div className="row px-0 w-100" style={{maxWidth:"1880px"}}>
                {/* maxWidth около 1920 чтобы предотвратить скачки кнопок слева-вправо из-за появления скролла (при открытии панели настроек) */}
                <div className="col-12 col-xxl-5 offset-xxl-7 my-5">
                    <div className="d-flex flex-row flex-wrap align-items-start gap-3 mx-4">
                        <SaveButton />
                        <OpenConsoleButton />
                        <OpenSettingsButton />
                    </div>
                </div>
            </div>
            {
                store.themeStore.themeSettingsVisible && <div className="my-5"><ThemeSettings /></div>
            }
            <div className={`ecards ecard-shape-${store.themeStore.selectedShapeId} my-5 mx-4`}>
                <div className="d-flex flex-wrap">
                    {elements.map(v => {
                        if (!v.discovered) return null;
                        if (store.discoverStore.discoveredId.includes(v.id)) return null;
                        return <Card 
                            key={v.id} 
                            element={toJS(v)} 
                            onClick={onCardClick} 
                            drawHelloAnimation={!justMounted} 
                        />;
                    })}
                </div>
            </div>
            {/* <ElementsList elements={toJS(elements)} /> */}
            {
                store.discoverStore.discovered.length 
                    ?
                        <DiscoveredOverlay 
                            elements={toJS(store.discoverStore.discovered)} 
                            countOfUndiscoveredElement={store.elementsStore.undiscoveredElementsCount} 
                            onClose={()=>store.discoverStore.reset()}
                        />
                    : null
            }
            { store.consoleStore.active && <GameConsole />}
            <ToastContainer 
                position="bottom-right"
                theme="colored"
                pauseOnHover
            />
        </div>
    </>
});

export default PageGame;