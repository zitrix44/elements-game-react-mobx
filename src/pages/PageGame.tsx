import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import ElementsList from "../components/ElementsList";
import GameBG from "../components/GameBG";
import useRootStore from "../Contexts";
import Cauldron from "../components/Cauldron/Cauldron";
import { Card } from "../components/Tabletop";
import { TCardOnClick } from "../components/Tabletop/Card";
import { toastError } from "../utils/toasts";
import { ToastContainer } from "react-toastify";

import './PageGame.css';

const PageGame = observer(() => {
    const [store] = useRootStore();
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
            <div className="d-flex flex-wrap">
                {elements.map(v => <Card key={v.id} element={toJS(v)} onClick={onCardClick} />)}
            </div>
            <ElementsList elements={toJS(elements)} />
            <ToastContainer 
                position="bottom-right"
                theme="colored"
                pauseOnHover
            />
        </div>
    </>
});

export default PageGame;