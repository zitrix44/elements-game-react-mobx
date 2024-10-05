import { observer } from "mobx-react-lite";
import { RootStore, StoreContext, useContext } from "../../Contexts";

import "./Cauldron.css";

const Cauldron = observer(() => {
    // TODO: https://codepen.io/z-/pen/zYxdRQy
    // TODO: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap + @keyframes 0% { r: 10px } 100% { r: 100px }
    const rootStore = useContext<RootStore>(StoreContext);
    return <div 
        className="cauldron"
    >
        <div className="cauldron-body-top-back">
            <div className="cauldron-body-left-1"></div>
            <div className="cauldron-body-right-1"></div>
            <div className="cauldron-body-center-1"></div>
            <div className="cauldron-body-arc-1">
            </div>
            <div className="cauldron-body-arc-2">
                <div className="cauldron-left-shadow"></div>
            </div>
        </div>
        <div className="cauldron-body-bottom">
            <div className="cauldron-body-left-1"></div>
            <div className="cauldron-body-right-1"></div>
            <div className="cauldron-body-bottom-1"></div>
            <div className="cauldron-body-middle-1"></div>
        </div>
        <div className="cauldron-surface"></div>
        <div className="cauldron-body-top-front">
            <div className="cauldron-body-arc-1"></div>
            <div className="cauldron-body-arc-2"></div>
        </div>
        555
    </div>;
});

export default Cauldron;