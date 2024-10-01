import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoreContext } from "../Contexts";
import ElementsList from "../components/ElementsList";

const PageDebug = observer(() => {
    const store = useContext(StoreContext);
    const elements = store.elementsStore.array;
    return <>
        <h1>PageDebug 🎢</h1>
        <ElementsList elements={toJS(elements)} />
    </>
});

export default PageDebug;