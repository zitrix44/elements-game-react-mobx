import { observable, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import ElementsList from "../components/ElementsList";
import GameBG from "../components/GameBG";
import useRootStore, { StoreContext } from "../Contexts";
import Cauldron from "../components/Cauldron/Cauldron";
import { Card } from "../components/Tabletop";

import './PageGame.css';

const PageGame = observer(() => {
    const [store] = useRootStore();
    const elements = store.elementsStore.array;
    return <>
        <div className="page-game">
            <GameBG />
            <h1>PageGame 🎢</h1>
            <Cauldron />
            <div className="d-flex flex-wrap">
                {elements.map(v => <Card key={v.id} element={toJS(v)} />)}
            </div>
            <ElementsList elements={toJS(elements)} />
        </div>
    </>
});

export default PageGame;