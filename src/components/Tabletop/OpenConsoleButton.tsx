import { observer } from "mobx-react-lite";
import useRootStore from "../../Contexts";

import './OpenConsoleButton.css';

const OpenConsoleButton = observer(() => {
    const [store] = useRootStore();
    return <>
        <button 
            className="btn btn-playstate btn-info btn-mystical btn-console"
            onClick={() => store.consoleStore.showConsole()}
            disabled={store.consoleStore.active}
        >
            <span className="material-symbols-outlined">terminal</span>
            Open console
            <div className="btn-console-warning">
                <div className="btn-console-warning-content">
                    <b>Spoilers!</b>
                    <br />
                    Console table contains all elements. 
                    <br />
                    And you will search out all recipes combinations.
                </div>
            </div>
        </button>
    </>
});

export default OpenConsoleButton;