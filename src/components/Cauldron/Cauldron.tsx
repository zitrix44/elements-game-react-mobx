import { observer } from "mobx-react-lite";
import { RootStore, StoreContext, useContext } from "../../Contexts";

import "./CopyButton.css";

const Cauldron = observer(() => {
    const rootStore = useContext<RootStore>(StoreContext);
    return <div 
        className="cauldron"
    >
        555
    </div>;
});

export default Cauldron;