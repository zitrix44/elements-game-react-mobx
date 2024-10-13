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

import './PageGame.css';
import { useEffect, useState } from "react";
import GameConsole from "../components/GameConsole/GameConsole";
import OpenConsoleButton from "../components/Tabletop/OpenConsoleButton";


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
        <div className="page-game">
            <GameBG />
            <h1>PageGame 🎢 ({store.cauldronStore.containsRecipeFor.join(', ')})</h1>
            
            <div className="row px-0 w-100">
                <div className="col-12 col-xl-8 col-xxl-7">
                    <Cauldron />
                </div>
                <div className="col-xl-4 col-xxl-5">
                    <OpenConsoleButton />
                </div>
            </div>
            <div className={`ecards`}>
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