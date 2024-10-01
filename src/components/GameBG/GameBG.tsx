import { observer } from "mobx-react-lite"
import { BgIconed } from "../BgIconed/BgIconed";

import './GameBG.css';

const GameBG = observer(()=><>
    <div className="page-bg game-bg">
        <BgIconed randomSeed={17} className="bg1" />
        <BgIconed randomSeed={27} className="bg2" iStepMultipty={1.3} />
        <BgIconed randomSeed={30} className="bg3" iStepMultipty={2.7} />
        {/* <BgIconed randomSeed={10} className="bg4" iStepMultipty={11.7} /> */}
    </div>
</>);

export default GameBG;