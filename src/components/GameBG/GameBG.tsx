import { observer } from "mobx-react-lite"
import { BgIconed } from "../BgIconed/BgIconed";

import './GameBG.css';

const GameBG = observer(({randomSeed=0, opacity=1, brightness=1, contrast=1}: {randomSeed:number, opacity:number, brightness:number, contrast:number}) => {
    let filter = '';
    if (contrast!=1) {
        filter += `contrast(${contrast}) `
    }
    if (brightness!=1) {
        filter += `brightness(${brightness}) `
    }
    const style = filter ? {style:{filter}} : {};
    return <div className="page-bg game-bg" {...style}>
        <BgIconed randomSeed={randomSeed+17} className="bg1" opacity={opacity} />
        <BgIconed randomSeed={randomSeed+27} className="bg2" iStepMultipty={1.3} opacity={opacity} />
        <BgIconed randomSeed={randomSeed+30} className="bg3" iStepMultipty={2.7} opacity={opacity} />
        {/* <BgIconed randomSeed={10} className="bg4" iStepMultipty={11.7} /> */}
    </div>
});

export default GameBG;