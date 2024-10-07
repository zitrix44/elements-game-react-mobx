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

const PageGame = observer(() => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [store] = useRootStore();
    useEffect(()=>{
        setIsMounted(true);
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
            <Cauldron />
            <div className={`ecards ${isMounted ? 'ecards-mounted': 'not-ecards-mounted'}`}>
                <div className="d-flex flex-wrap">
                    {elements.map(v => {
                        if (!v.discovered) return null;
                        if (store.discoverStore.discoveredId.includes(v.id)) return null;
                        return <Card 
                            key={v.id} 
                            element={toJS(v)} 
                            onClick={onCardClick} 
                            drawHelloAnimation={isMounted} 
                        />;
                    })}
                </div>
            </div>
            <ElementsList elements={toJS(elements)} />
            {
                store.discoverStore.discovered.length &&
                <DiscoveredOverlay 
                    elements={toJS(store.discoverStore.discovered)} 
                    countOfUndiscoveredElement={store.elementsStore.undiscoveredElementsCount} 
                    onClose={()=>store.discoverStore.reset()}
                />
            }
            <ToastContainer 
                position="bottom-right"
                theme="colored"
                pauseOnHover
            />
        </div>
    </>
});

export default PageGame;