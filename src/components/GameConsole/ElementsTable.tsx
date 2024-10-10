import { observer } from "mobx-react-lite";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    RowData,
    CellContext,
} from '@tanstack/react-table';
import Element, { TElementBase, type TElement } from '../../model/Element';

import './ElementsTable.css';
import React, { useRef, useState } from "react";
import ElementEditForm, { TEditableElement } from "./ElementEditForm";
import { toastError } from "../../utils/toasts";

export const groupById = (elements: TElement[]): Record<string, TElement> => {
    const ret: Record<string, TElement> = {};
    elements.forEach(v => ret[v.id] = v);
    return ret;
}

export type TonElementDiscover = (id: string) => void;
export type TonElementUpdate = (id: string, data: Partial<TElement>) => boolean;
export type TonElementDelete = (id: string) => void;
export type TonElementEdit = {
    onElementDiscover?: TonElementDiscover;
    onElementUpdate?: TonElementUpdate;
    onElementDelete?: TonElementDelete,
};

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        // TODO: объединить onElementUpdate и onElementEditingSave
        onElementDiscover?: TonElementDiscover,
        onElementUpdate?: TonElementUpdate,
        onElementDelete?: TonElementDelete,
        toggleElementEditing?: (show: boolean, id: string) => void,
        toggleElementDeleting?: (show: boolean, id: string) => void,
        onElementEditingSave?: (id: string, values?: TEditableElement) => void,
        elementsEditingIds?: string[],
        elementsDeletingIds?: string[],
        elementById?: ReturnType<typeof groupById>,
    }
}

const columnHelper = createColumnHelper<TElement>();

const DiscoveredCell = observer(({at, id, onElementDiscover}: {at:number, id:string, onElementDiscover?: TonElementDiscover})=>{
    return at ? <DiscoveredYes at={at} /> : <DiscoveredNo id={id} onElementDiscover={onElementDiscover} />;
});
const DiscoveredYes = observer(({at}: {at:number})=>{
    return <>
        <span key="yes" title={at+''} className="is-discovered">
            <span className="material-symbols-outlined">check</span>
            <i>Yes</i>
        </span>
    </>;
});
const DiscoveredNo = observer(({id, onElementDiscover}: {id:string, onElementDiscover?: TonElementDiscover})=>{
    return <>
        <span key="no" className={`isnt-discovered ${onElementDiscover ? 'discoverable' : ''}`} onClick={()=>onElementDiscover?.(id)}>
            <span className="material-symbols-outlined">cancel</span>
            <i>No</i>
        </span>
    </>;
});

const ParentItemOnlyId = observer(({id}: Pick<TElement, "id">) => {
    return <div className="parent parent-only-id" title={id}>#{id}</div>;
});
const ParentItemRegular = observer(({id, mdIcon, title, discovered}: Pick<TElement, "id" | "mdIcon" | "title" | "discovered">) => {
    return <>
        <div className="parent parent-regular">
            {
                discovered 
                    ? <span className="parent-is-discovered material-symbols-outlined" title="Discovered">check</span>
                    : <span className="parent-isnt-discovered material-symbols-outlined" title="Not discovered">cancel</span>
            }
            <span className="parent-icon material-symbols-outlined">{mdIcon}</span>
            <span className="parent-title" title={title}>{title}</span>
        </div>
    </>
});
const ParentsEmpty = observer(() => {
    return <div className="parent parent-empty"><i>Is root element</i></div>;
});

const ParentsCell = observer(({parentIds, elementById}: {parentIds: string[], elementById?: ReturnType<typeof groupById>})=>{
    if (!parentIds.length) return <ParentsEmpty />;
    if (!elementById) {
        return <>{parentIds.map((v,i) => <ParentItemOnlyId key={i+','+v} id={v} />)}</>
    }
    return <>
        {parentIds.map((v,i) => <ParentItemRegular key={i+','+v} {...elementById[v]} />)}
    </>
});

const ActionsEditing = observer(({info, onCancel}: {info: CellContext<TElement, null>, onCancel: ()=>void}) => {
    return <>
        <div className="actions-block actions-editing-confirmation">
            <span className="material-symbols-outlined" title="Cancel" onClick={onCancel}>disabled_by_default</span>
            <span className={`do-save material-symbols-outlined`} title="Save" onClick={()=>{
                info.table.options.meta?.onElementEditingSave?.(info.row.original.id)
            }}>check</span>
        </div>
    </>
});

const ActionsDeleting = observer(({info, onCancel}: {info: CellContext<TElement, null>, onCancel: ()=>void}) => {
    return <>
        <div className="actions-block actions-deleting-confirmation">
            <span className="material-symbols-outlined" title="Cancel" onClick={onCancel}>disabled_by_default</span>
            <span className="do-delete material-symbols-outlined" title="Delete">check</span>
        </div>
    </>
});

const ActionsDefault = observer(({info, startDeleting, startEditing}: {info: CellContext<TElement, null>, startDeleting: ()=>void, startEditing: () => void}) => {
    return <>
        <div className="actions-block actions-default">
            { info.table.options.meta?.onElementUpdate ? <span className="material-symbols-outlined" title="Edit..." onClick={startEditing}>ink_pen</span> : null }
            { info.table.options.meta?.onElementDelete ? <span className="material-symbols-outlined" title="Delete..." onClick={startDeleting}>delete</span> : null }
        </div>
    </>
});

const ActionsCell = observer(({info}: {info: CellContext<TElement, null>}) => {
    const id = info.row.original.id;
    const deleting: boolean = info.table.options.meta?.elementsDeletingIds?.includes(id) || false;
    const editing: boolean = info.table.options.meta?.elementsEditingIds?.includes(id) || false;
    return <>
        <div className={`actions-container ${deleting ? 'deleting' : 'not-deleting'} ${editing ? 'editing' : 'not-editing'}`}>
            <ActionsDefault 
                info={info} 
                // startDeleting={()=>setDeleting(true)} 
                startDeleting={()=>{
                    info.table.options.meta?.toggleElementDeleting?.(true, info.row.original.id)
                }} 
                startEditing={()=>{
                    info.table.options.meta?.toggleElementEditing?.(true, info.row.original.id);
                }} 
            />
            <ActionsDeleting info={info} onCancel={()=>{
                info.table.options.meta?.toggleElementDeleting?.(false, info.row.original.id)
            }} />
            <ActionsEditing info={info} onCancel={()=>{
                info.table.options.meta?.toggleElementEditing?.(false, info.row.original.id)
            }} />
        </div>
    </>;
});

const columns = [
    columnHelper.accessor('discovered', {
        header: "Discovered",
        cell: info => {
            const at = info.getValue();
            const id = info.row.original.id;
            return <DiscoveredCell at={at} id={id} onElementDiscover={info.table.options.meta?.onElementDiscover} />;
            // return at ? <IsDiscovered at={at} /> : <IsntDiscovered />;
        }
    }),
    columnHelper.accessor('mdIcon', {
        header: () => <span className="material-symbols-outlined">helicopter</span>,
        cell: info => {
            return <span className="material-symbols-outlined">{info.getValue()}</span>
        }
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
        // accessorFn: (row) => row.parentIds,
        header: 'Parents',
        cell: info => <ParentsCell parentIds={info.row.original.parentIds} elementById={info.table.options.meta?.elementById} />,
    }),
    columnHelper.accessor(()=>null, {
        header: 'Actions',
        cell: info => <ActionsCell info={info} />
    })
]

const ElementsTable = observer(({elements, onEdit, elementById}: {elements: TElement[], elementById: ReturnType<typeof groupById>, onEdit?: TonElementEdit}) => {
    const [editingIds, setEditingIds] = useState<string[]>([]);
    const [editingIdsFadeout, setEditingIdsFadeout] = useState<string[]>([]);
    const editingIdsFadeoutReal = useRef<string[]>([]); // боремся с замыканием
    const editingData = useRef<Record<string, TEditableElement>>({});
    const [deletingIds, setDeletingIds] = useState<string[]>([]);
    const toggleElementEditing = (show: boolean, id: string) => {
        // показыем панельку редактирования элемента (показ/скрытие с анимациями, но если панелька не нужна - не рендерим ElementEditForm)
        if (show) {
            editingIdsFadeoutReal.current = editingIdsFadeoutReal.current.filter(_id => _id !== id);
            setEditingIdsFadeout(editingIdsFadeoutReal.current);
            setEditingIds([...editingIds, id]);
        } else {
            editingIdsFadeoutReal.current.push(id);
            setEditingIdsFadeout(editingIdsFadeoutReal.current);
            setEditingIds(editingIds.filter(_id => _id !== id));
            setTimeout(()=>{
                // через секунду после скрытия забываем о транзишне
                if (!editingIdsFadeoutReal.current.includes(id)) {
                    // в процессе скрытия пользователь передумал, и решил вернуть панельку на место
                    return;
                }
                editingIdsFadeoutReal.current = editingIdsFadeoutReal.current.filter(_id => _id !== id);
                setEditingIdsFadeout(editingIdsFadeoutReal.current); // запускаем перерендер без ElementEditForm
            }, 1_000);
        }
    };
    const onEditingFieldChange = (values: TEditableElement) => {
        editingData.current[values.id] = values;
    }
    const onEditingCancel = (id: string) => {
        toggleElementEditing(false, id);
    };
    const onElementEditingSave = (id: string, values?: TEditableElement) => {
        const values_ = values || editingData.current[id];
        if (!values_) {
            toastError(`No data for save`);
            return;
        }
        const ok = onEdit?.onElementUpdate?.(id, values_);
        if (ok) {
            onEditingCancel(id);
        }
    };
    const table = useReactTable({
      data: elements,
      columns,
      getCoreRowModel: getCoreRowModel(),
      initialState: {
        columnVisibility: {
            Actions: !!(onEdit?.onElementUpdate || onEdit?.onElementDelete)
        }
      },
      meta: {
        ...onEdit,
        toggleElementDeleting: (show: boolean, id: string) => {
            setDeletingIds( show ? [...deletingIds, id] : deletingIds.filter(_id => _id !== id) );
        },
        toggleElementEditing,
        onElementEditingSave,
        elementsEditingIds: editingIds,
        elementsDeletingIds: deletingIds,
        elementById,
      }
    });
    return <>
        <div className="table-with-elements">
            {/* <textarea value={JSON.stringify(editingData.current, null, 4)} readOnly></textarea> */}
            <table className="table">
                <thead>
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
                <tbody>
                    {table.getRowModel().rows.map((row, i) => (
                        <React.Fragment key={row.id}>
                            <tr 
                                key={row.id} 
                                className={`
                                    ${editingIds.includes(row.original.id) ? "tr-in-editing" : ""}
                                    ${deletingIds.includes(row.original.id) ? "tr-in-deleting table-danger" : ""}
                                    ${i%2 ? "tr-even" : ""}
                                `}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className={`column-${cell.column.id}`}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                            {
                                editingIds.includes(row.original.id) || editingIdsFadeout.includes(row.original.id)
                                    ? 
                                        <tr 
                                            className={`
                                                editing-tr 
                                                ${i%2 ? "tr-even" : ""}
                                                ${editingIdsFadeout.includes(row.original.id) ? 'editing-tr-fadeout' : ''}
                                            `}
                                        >
                                            <td colSpan={6} className="editing-td">
                                                <ElementEditForm
                                                    id={row.original.id}
                                                    mdIcon={row.original.mdIcon}
                                                    title={row.original.title}
                                                    parentIds={row.original.parentIds}
                                                    otherElements={elementById}
                                                    onFieldChange={onEditingFieldChange}
                                                    onCancel={onEditingCancel}
                                                    onSave={onElementEditingSave}
                                                />
                                            </td>
                                        </tr>
                                    : null
                            }
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </>;
});

export default ElementsTable;