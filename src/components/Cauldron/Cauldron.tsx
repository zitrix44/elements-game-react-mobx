import { observer } from "mobx-react-lite";
import useRootStore from "../../Contexts";

import "./Cauldron.css";

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
});

type TcauldronProps = {
    slotAmdIcon?: string;
    slotBmdIcon?: string;
    slotCmdIcon?: string;
    onClick?: (slot: "a" | "b" | "c", mdIcon?: string) => void;
};

export const CauldronDrawer = observer(({slotAmdIcon, slotBmdIcon, slotCmdIcon, onClick}: TcauldronProps) => {
    return <div 
        className="cauldron"
    >
        <div key="bg" className="cauldron-bg"></div>
        <div key="wave0" className="cauldron-wave cauldron-wave-0"></div>
        {slotAmdIcon && <span key="i0" onClick={()=>onClick?.("a", slotAmdIcon)}><CauldronIcon i={0} mdIcon={slotAmdIcon} /></span> }
        {slotBmdIcon && <span key="i1" onClick={()=>onClick?.("b", slotBmdIcon)}><CauldronIcon i={1} mdIcon={slotBmdIcon} /></span> }
        <div key="wave1" className="cauldron-wave cauldron-wave-1"></div>
        {slotCmdIcon && <span key="i2" onClick={()=>onClick?.("c", slotCmdIcon)}><CauldronIcon i={2} mdIcon={slotCmdIcon} /></span> }
        <div key="wave4" className="cauldron-wave cauldron-wave-4"></div>
        <div key="wave2" className="cauldron-wave cauldron-wave-2"></div>
        <div key="wave3" className="cauldron-wave cauldron-wave-3"></div>
    </div>;
});

const Cauldron = observer(() => {
    // TODO: https://codepen.io/z-/pen/zYxdRQy
    // TODO: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap + @keyframes 0% { r: 10px } 100% { r: 100px }
    const [rootStore] = useRootStore();
    const onClick: TcauldronProps["onClick"] = (slot, mdIcon) => {
        if (!mdIcon) return;
        switch(slot) {
            case "a":
                rootStore.cauldronStore.withdrawA();
            break;
            case "b":
                rootStore.cauldronStore.withdrawB();
            break;
            case "c":
                rootStore.cauldronStore.withdrawC();
            break;
        }
    };
    return <CauldronDrawer 
        slotAmdIcon={rootStore.elementsStore.mdIconById[rootStore.cauldronStore.slotA||'']} 
        slotBmdIcon={rootStore.elementsStore.mdIconById[rootStore.cauldronStore.slotB||'']} 
        slotCmdIcon={rootStore.elementsStore.mdIconById[rootStore.cauldronStore.slotC||'']} 
        onClick={onClick}
    />
});

export default Cauldron;