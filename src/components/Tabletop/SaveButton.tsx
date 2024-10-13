import { observer } from "mobx-react-lite";
import useRootStore from "../../Contexts";
import { envString } from "../../utils";
import { useState } from "react";
import { toastError } from "../../utils/toasts";

import "./SaveButton.css";

const SaveButton = observer(() => {
    const [regularSaveHover, setRegularSaveHover] = useState<boolean>(false);
    const [store] = useRootStore();
    const makeBlob = (saveDiscovered: boolean) => {
        const content = store.elementsStore.toCSV(saveDiscovered);
        const blob = new Blob([content], {
            type: "text/csv",
        });
        return blob;
    };
    const makeFilename = (saveDiscovered: boolean) => {
        const prefix = envString(saveDiscovered ? 'VITE_SAVEFILE_PREFIX' : 'VITE_RULESETFILE_PREFIX');
        const postfix = envString(saveDiscovered ? 'VITE_SAVEFILE_POSTFIX' : 'VITE_RULESETFILE_POSTFIX');
        const date = (new Date()).toISOString().replace(/:\d+\.\d+Z$/, '').replaceAll(':', '-').replace('T', '.');
        const count = store.elementsStore.array.length;
        const undiscovered = store.elementsStore.undiscoveredElementsCount;
        const discovered = count - undiscovered;
        const progress = saveDiscovered ? `${discovered}-of-${count}` : `${count}-elements`;
        return [prefix, progress, date, postfix].join('.');
    }
    const makeLink = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.className = 'autodownloader';
        a.textContent = 'Link for download (autodownload not allowed?)';
        a.href = url;
        a.download = (filename.replace(/.csv$/, '') + '.csv').replaceAll('..', '.'); // avoid '..csv.csv' 
        document.body.appendChild(a);
        a.click();
        a.parentNode?.removeChild(a);
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            a.parentNode?.removeChild(a);
        }, 60_000);
    };
    const regularSave = () => {
        makeLink(makeBlob(true), makeFilename(true));
    };
    const saveRuleset = () => {
        makeLink(makeBlob(false), makeFilename(false));
    };
    return <>
        <div className="btn-group save-btn-group" role="group" aria-label="Basic example">
            <button 
                className={`btn btn-playstate ${regularSaveHover ? 'btn-info save-hover' : 'btn-info'}`}
                onClick={() => regularSave()}
                onMouseEnter={() => setRegularSaveHover(true)}
                onFocus={() => setRegularSaveHover(true)}
                onMouseLeave={() => setRegularSaveHover(false)}
                onBlur={() => setRegularSaveHover(false)}
            >
                <span className="material-symbols-outlined">save</span>
                Save
            </button>
            <button 
                className={`btn btn-playstate ${regularSaveHover ? 'btn-info save-hover' : 'btn-light btn-outline-info'}`}
                onClick={() => regularSave()}
                onMouseEnter={() => setRegularSaveHover(true)}
                onFocus={() => setRegularSaveHover(true)}
                onMouseLeave={() => setRegularSaveHover(false)}
                onBlur={() => setRegularSaveHover(false)}
            >
                .csv
            </button>
            <button 
                className="btn btn-playstate btn-light btn-outline-info"
                onClick={() => toastError('TODO: save game to local storage')}
            >
                to browser
            </button>
            <button 
                className="btn btn-playstate btn-light btn-outline-info"
                onClick={() => {
                    store.utils.copyText(store.elementsStore.toCSV(true), {});
                }}
            >
                to clipboard
            </button>
            <button 
                className="btn btn-playstate btn-light btn-outline-info"
                onClick={() => saveRuleset()}
            >
                ruleset only
            </button>
        </div>
    </>
});

export default SaveButton;