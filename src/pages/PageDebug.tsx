import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoreContext } from "../Contexts";
import ElementsList from "../components/ElementsList";
import BgIconed from "../components/BgIconed";

import './PageDebug.css';

const PageDebug = observer(() => {
    const store = useContext(StoreContext);
    const elements = store.elementsStore.array;
    return <>
        <div className="page-debug">
            <div className="page-bg">
                <BgIconed randomSeed={17} className="bg1" />
                <BgIconed randomSeed={27} className="bg2" iStepMultipty={1.3} />
                <BgIconed randomSeed={30} className="bg3" iStepMultipty={2.7} />
            </div>
            <h1>PageDebug 🎢</h1>
            <ElementsList elements={toJS(elements)} />
        </div>
    </>
});

export default PageDebug;