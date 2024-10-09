import { observer } from "mobx-react-lite";

import ElementsTable, { groupById, TonElementEdit } from "./ElementsTable";
import useRootStore from "../../Contexts";
import { toJS } from "mobx";
import { toastError, toastInfo, toastSuccess } from "../../utils/toasts";

import './GameConsole.css';
import { TElement } from "../../model/Element";

let cheatsCount = 0;

const GameConsole = observer(() => {
    const [store] = useRootStore();
    const elements = toJS(store.elementsStore.array);
    const elementById = groupById(elements);
    const onEdit: TonElementEdit = {
        onElementDiscover: (id: string) => {
            const el = store.elementsStore.byId[id];
            if (el.discovered) {
                toastError(`${el.title} is already discovered`);
                return;
            } else {
                cheatsCount++;
                el.discover();
                toastInfo(`Cheater ${cheatsCount > 1 ? `×${cheatsCount}` : ""}`);
                if (store.elementsStore.undiscoveredElementsCount === 0) {
                    toastSuccess(`Console win ;)`);
                }
            }
        },
        onElementDelete: (id: string) => {
            alert(id);
        },
        onElementUpdate: (id: string, data: Partial<TElement>): boolean => {
            alert(id);
            return true;
        },
    };
    return <>
        <div className="console">
            <ElementsTable elements={elements} elementById={elementById} onEdit={onEdit} />
        </div>
    </>;
});

export default GameConsole;