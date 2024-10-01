import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { RootStore, StoreContext } from "../Contexts";

import "./CopyButton.css";

const CopyButton = observer(({height}: {height?: number | string}) => {
    const rootStore = useContext<RootStore>(StoreContext);
    const height_ = typeof height === 'string' ? height+'px' : typeof height === 'number' ? height : '24px';
    return <span 
        className="copy-button"
        title="Copy"
        aria-label="Copy"
        onClick={rootStore.utils.copyByClick}
    >        
        <svg className="pe-none" xmlns="http://www.w3.org/2000/svg" height={height_} viewBox="0 -960 960 960" width={height_} fill="currentColor"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
    </span>;
});

export default CopyButton;