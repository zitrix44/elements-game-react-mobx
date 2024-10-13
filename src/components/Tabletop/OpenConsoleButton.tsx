import { observer } from "mobx-react-lite";
import useRootStore from "../../Contexts";

const OpenConsoleButton = observer(() => {
    const [store] = useRootStore();
    return <>
        <button 
            className="btn btn-playstate btn-info btn-mystical"
            onClick={() => store.consoleStore.showConsole()}
            disabled={store.consoleStore.active}
        >
            <span className="material-symbols-outlined">terminal</span>
            Open console
        </button>
    </>
});

export default OpenConsoleButton;