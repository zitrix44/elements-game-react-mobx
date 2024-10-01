import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import ElementsList from "../components/ElementsList";
import GameBG from "../components/GameBG";
import { StoreContext } from "../Contexts";

const PageGame = observer(() => {
    const store = useContext(StoreContext);
    const elements = store.elementsStore.array;
    return <>
        <div className="page-debug">
            <GameBG />
            <h1>PageGame 🎢</h1>
            <ElementsList elements={toJS(elements)} />
        </div>
    </>
});

export default PageGame;