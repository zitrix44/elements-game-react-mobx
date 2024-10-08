import { observer } from "mobx-react-lite";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Element, { type TElement } from '../../model/Element';

import './GameConsoleTable.css';
import useRootStore from "../../Contexts";
import { toJS } from "mobx";

const columnHelper = createColumnHelper<Element>();

const columns = [
    columnHelper.accessor('mdIcon', {
        header: () => <span className="material-symbols-outlined">helicopter</span>,
        cell: info => <span className="material-symbols-outlined">{info.getValue()}</span>
    }),
    columnHelper.accessor('id', {
    }),
    columnHelper.accessor('title', {
        header: "Title",
        cell: info => info.getValue()
    })
]

const GameConsoleTable = observer(() => {
    const [store] = useRootStore();
    const table = useReactTable({
      data: toJS(store.elementsStore.array),
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return <>
        <div className="console-table">
            asd
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
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
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>;
});

export default GameConsoleTable;