import { observer } from "mobx-react-lite";
import useRootStore from "../../Contexts";

const OpenSettingsButton = observer(() => {
    const [store] = useRootStore();
    return <>
        <button 
            className="btn btn-playstate btn-info"
            onClick={() => {
                if (store.themeStore.themeSettingsVisible) {
                    store.themeStore.hideThemeSettings();
                } else {
                    store.themeStore.showThemeSettings();
                }
            }}
            disabled={store.consoleStore.active}
        >
            <span className="material-symbols-outlined">{ store.themeStore.themeSettingsVisible ? "close" : "format_paint" }</span>
            Settings
        </button>
    </>
});

export default OpenSettingsButton;