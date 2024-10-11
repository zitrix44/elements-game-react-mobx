import { observer } from "mobx-react-lite";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    Table,
    Row,
} from '@tanstack/react-table';
import useRootStore from "../../Contexts";
import { TElementUpdate } from "../../model/ElementsStore";
import { TElement } from "../../model/Element";
import useElementsTableContext, { useConsole } from "./ElementsTableContext";
import ElementEditForm from "./ElementEditForm";

import './ElementsTable.css';

export type Tallows = {
    update: boolean;
    delete: boolean;
    discover: boolean;
};

const columnHelper = createColumnHelper<TElement>();

const columns = [
    columnHelper.accessor('discovered', {
        header: "Discovered",
        cell: info => <DiscoveredCell at={info.getValue()} id={info.row.original.id} />
    }),
    columnHelper.accessor('mdIcon', {
        header: () => <span className="material-symbols-outlined">helicopter</span>,
        cell: info => <span className="material-symbols-outlined">{info.getValue()}</span>
    }),
    columnHelper.accessor('id', {
        header: "Id",
        cell: info => <span className="element-id" title={info.getValue()}>{info.getValue()}</span>
    }),
    columnHelper.accessor('title', {
        header: "Title",
        cell: info => info.getValue()
    }),
    columnHelper.accessor('parentIds', {
        header: 'Parents',
        cell: info => <ParentCell parentIds={info.row.original.parentIds} />,
    }),
    columnHelper.accessor(()=>null, {
        header: 'Actions',
        cell: info => <ActionsCell id={info.row.original.id} />
    })
];

const DiscoveredCell = observer(({at, id}: {at:number, id:string})=>{
    return at ? <DiscoveredYes at={at} /> : <DiscoveredNo id={id} />;
});
const DiscoveredYes = observer(({at}: {at:number})=>{
    return <>
        <span key="yes" title={`Element discovered at ${at}`} className="is-discovered">
            <span className="material-symbols-outlined">flag_2</span>
            <i>Yes</i>
        </span>
    </>;
});
const DiscoveredNo = observer(({id}: {id:string})=>{
    const [store] = useRootStore();
    const c = useConsole();
    const t = useElementsTableContext();
    const allowDiscover = t.allows.discover;
    const element = c.byId[id];
    const discoveredParents = element.parentIds.filter(id => store.elementsStore.byId[id].discovered).length;
    const discoverable = discoveredParents === element.parentIds.length;
    const title = allowDiscover && discoverable ? 'Click to discover' : 'Element not discovered yet';
    return <>
        <span 
            key="no" 
            className={`isnt-discovered ${allowDiscover && discoverable ? 'discoverable text-primary' : ''}`} 
            onClick={()=>c.discover(id)}
        >
            { 
                !discoverable && <small 
                    className="text-light-emphasis pe-1"
                    title={`${discoveredParents} of ${element.parentIds.length} parents discovered`}
                >{discoveredParents} / {element.parentIds.length}</small> 
            }
            <span title={title} className="material-symbols-outlined">{ allowDiscover && discoverable ? 'question_exchange' : 'help'}</span>
            <i title={title}>
                No
            </i>
        </span>
    </>;
});

const ParentCell = observer(({parentIds}: Pick<TElement, "parentIds">) => {
    if (!parentIds.length) return <div className="parent parent-empty"><i>Is root element</i></div>;
    return <>
        {parentIds.map((v,i) => <ParentCellItem key={i+','+v} id={v} />)}
    </>
});
const ParentCellItem = observer(({id}: {id:string}) => {
    const [store] = useRootStore();
    const el = store.elementsStore.byId[id];
    const { discovered, mdIcon, title } = el;
    return <>
        <div className="parent parent-regular">
            <a href={`#${id}-in-table`} className="text-body">
                {
                    discovered 
                        ? <span className="parent-is-discovered material-symbols-outlined" title="Discovered">flag_2</span>
                        : <span className="parent-isnt-discovered material-symbols-outlined" title="Not discovered">help</span>
                }
                <span className="parent-icon material-symbols-outlined">{mdIcon}</span>
                <span className="parent-title" title={title}>{title}</span>
            </a>
        </div>
    </>
});

const ElementsThead = observer(({table}:{table:Table<TElement>}) => {
    return <thead>
        {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="table-primary">
            {headerGroup.headers.map(header => (
                <th key={header.id} className={`thead-${header.id}`}>
                {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                </th>
            ))}
            </tr>
        ))}
    </thead>
});

const ActionsDefault = observer(({id}: {id: string}) => {
    const c = useConsole();
    const t = useElementsTableContext();
    return <>
        <div className="actions-block actions-default">
            { t.allows.update ? <span className="material-symbols-outlined" title="Edit..." onClick={()=>c.updateStart(id)}>ink_pen</span> : null }
            { t.allows.delete ? <span className="material-symbols-outlined" title="Delete..." onClick={()=>c.deleteStart(id)}>delete</span> : null }
        </div>
    </>
});

const ActionsDeleting = observer(({id}: {id: string}) => {
    const c = useConsole();
    return <>
        <div className="actions-block actions-deleting-confirmation">
            <span className="material-symbols-outlined" title="Cancel" onClick={()=>c.deleteCancel(id)}>disabled_by_default</span>
            <span className="do-delete material-symbols-outlined" title="Delete" onClick={()=>{c.delete(id)}}>check</span>
        </div>
    </>
});

const ActionsEditing = observer(({id}: {id: string}) => {
    const c = useConsole();
    const t = useElementsTableContext();
    const onCancel = async ()=>{
        if (id in t.editingFadeoutById) {
            // пользователь передумал скрывать форму
            t.fadeout(id, false);
            return;
        }
        const hidden = await t.fadeout(id, true);
        if (!hidden) return;
        c.updateCancel(id);
    };
    return <>
        <div className="actions-block actions-editing-confirmation">
            <span className="material-symbols-outlined" title="Cancel" onClick={onCancel}>disabled_by_default</span>
            {
                id in t.editingFadeoutById &&
                    <span className="back-to-edit material-symbols-outlined" title="Back to edit"  onClick={onCancel}>undo</span>
            }
            <span className={`do-save material-symbols-outlined`} title="Save" onClick={()=>{
                c.updateFinish(id);
            }}>{id in t.editingFadeoutById ? '' : 'check'}</span>
        </div>
    </>
});

const ActionsCell = observer(({id}: {id: string}) => {
    const c = useConsole();
    const t = useElementsTableContext();
    if (!t.allows.delete && !t.allows.update) return null;
    const deleting = id in c.deleteConfirmations;
    const editing = id in c.updates;
    const editingFadeOut = id in t.editingFadeoutById;
    return <>
        <div className={`actions-container ${deleting ? 'deleting' : 'not-deleting'} ${editing ? 'editing' : 'not-editing'} ${editingFadeOut ? 'editing-fadeout' : 'not-editing-fadeout' }`}>
            <ActionsDefault id={id} />
            <ActionsDeleting id={id} />
            <ActionsEditing id={id} />
        </div>
    </>;
});

type TElementTR = {
    row: Row<TElement>, 
    i: number
};
const ElementTR = observer(({row, i}:TElementTR) => {
    const c = useConsole();
    const id = row.original.id;
    return <>
        <tr
            className={`
                ${id in c.updates ? "tr-in-editing" : ""}
                ${id in c.deleteConfirmations ? "tr-in-deleting table-danger" : ""}
                ${i%2 ? "tr-even" : ""}
            `}
            id={`${id}-in-table`}
        >
            {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={`column-${cell.column.id}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    </>;
});
const ElementTREditing = observer(({row, i}:TElementTR) => {
    const c = useConsole();
    const t = useElementsTableContext();
    const id = row.original.id;
    const el = c.updates[id];
    return <>
        <tr 
            className={`
                editing-tr 
                ${i%2 ? "tr-even" : ""}
                ${id in t.editingFadeoutById ? 'editing-tr-fadeout' : ''}
            `}
        >
            <td colSpan={6} className="editing-td">
                <ElementEditForm
                    id={id}
                    mdIcon={el.mdIcon}
                    title={el.title}
                    parentIds={el.parentIds}
                    otherElements={c.byId}
                    onFieldChange={(data: TElementUpdate)=>{
                        c.update(data);
                    }}
                    onCancel={async ()=>{
                        const hidden = await t.fadeout(id, true);
                        if (!hidden) return;
                        c.updateCancel(id);
                    }}
                    onSave={(id: string, data: TElementUpdate) => {
                        c.update(data);
                        c.updateFinish(id);
                    }}
                />
            </td>
        </tr>
    </>
});
const ElementTRGroup = observer(({row, i}:TElementTR) => {
    const c = useConsole();
    const t = useElementsTableContext();
    const id = row.original.id;
    return <>
        <ElementTR key={`tr-${id}`} row={row} i={i} />
        {(id in c.updates || id in t.editingFadeoutById) && <ElementTREditing key={`tr-edit-${id}`} row={row} i={i} />}
    </>
});

const ElementsTable = observer(() => {
    const tableContext = useElementsTableContext();
    const table = useReactTable({
        data: tableContext.elements,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
          columnVisibility: {
              Actions: tableContext.allows.update || tableContext.allows.delete,
          }
        },
    });
    return <>
        <div className="table-with-elements">
            <table className="table">
                <ElementsThead table={table} />
                <tbody>
                    {table.getRowModel().rows.map((row, i) => (
                        <ElementTRGroup key={row.original.id} row={row} i={i} />
                    ))}
                </tbody>
            </table>
        </div>
    </>;
});

export default ElementsTable;