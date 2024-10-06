import { observer } from "mobx-react-lite";
import { RootStore, StoreContext, useContext } from "../../Contexts";
import Delayed from "../Delayed";

import "./Cauldron.css";

const CauldronWave = observer(({left, top}: {left:string,top:string}) => {
    return <>
        <div className="cauldron-waves" style={{left,top}}>
            <div className="cauldron-wave-arc cauldron-wave-a"></div>
            <div className="cauldron-wave-arc cauldron-wave-b"></div>
            <div className="cauldron-wave-arc cauldron-wave-c"></div>
            <div className="cauldron-wave-arc cauldron-wave-d"></div>
            <div className="cauldron-wave-arc cauldron-wave-e"></div>
        </div>
    </>
});

const CauldronIcon = observer(({i, mdIcon}: {i: number, mdIcon: string})=>{
    return <>
        <div className={`cauldron-icon cauldron-icon-${i}`}>
            <div className="cauldron-icon-container">
                <div className="cauldron-icon-under-the-sea">
                    <span className="material-symbols-outlined">{mdIcon}</span>
                </div>
                <div className="cauldron-icon-over-the-sea">
                    <span className="material-symbols-outlined">{mdIcon}</span>
                </div>
            </div>
        </div>
    </>
})

const Cauldron = observer(() => {
    // TODO: https://codepen.io/z-/pen/zYxdRQy
    // TODO: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap + @keyframes 0% { r: 10px } 100% { r: 100px }
    const rootStore = useContext<RootStore>(StoreContext);
    return <div 
        className="cauldron"
    >
        <div className="cauldron-rotate">
            <div className="cauldron-bg"></div>
            <div className="cauldron-border"></div>
        </div>
        <Delayed delay={11} key="wave-1">
            <CauldronWave left="100px" top="100px" />
        </Delayed>
        <Delayed delay={111} key="wave-2">
            <CauldronWave left="300px" top="0px" />
        </Delayed>
        <Delayed delay={202} key="wave-3">
            <CauldronWave left="500px" top="50px" />
        </Delayed>
        <Delayed delay={313} key="wave-4">
            <CauldronWave left="400px" top="120px" />
        </Delayed>
        <CauldronIcon i={0} mdIcon={"Air"} key="i0" />
        <CauldronIcon i={1} mdIcon={"fire_truck"} key="i1" />
        <CauldronIcon i={2} mdIcon={"Microbes"} key="i2" />
        555
    </div>;
});

export default Cauldron;