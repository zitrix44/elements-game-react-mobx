import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoreContext } from "../Contexts";
import ElementsList from "../components/ElementsList";
import GameBG from "../components/GameBG";

import './PageDebug.css';

const PageDebug = observer(() => {
    const store = useContext(StoreContext);
    const elements = store.elementsStore.array;
    return <>
        <div className="page-debug">
            <GameBG />
            <h1>PageDebug 🎢</h1>
            <ElementsList elements={toJS(elements)} />
        </div>
    </>
});

export default PageDebug;