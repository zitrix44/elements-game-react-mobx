import { useId } from "react";
import { observer } from "mobx-react-lite";
import { TElement } from "../../model/Element";
import Select from 'react-select';

import './ElementEditForm.css';

// type TOption = string; // :(
type TOption = {
    value: string;
    label: string;
};

type TMyElement = Pick<TElement, "id" | "mdIcon" | "title" | "parentIds">;
type TOtherElement = Pick<TElement, "id" | "mdIcon" | "title">;
type TElementEditFormProps = TMyElement & { otherElements: Record<string, TOtherElement> };

const options_: TOption[] = [
    { value: 'gravity', label: 'Gravity' },
    { value: 'fire_extinguisher', label: 'Fire extinguisher' },
    { value: 'grass', label: 'Grass' }
];

const ElementEditForm = observer(({id, mdIcon, title, parentIds, otherElements}: TElementEditFormProps) => {
    const htmlIdForId = useId();
    const htmlIdForTitle = useId();
    const htmlIdForMdIcon = useId();
    const htmlIdForMdIconHint = useId();
    const formatOptionLabel = (data: TOption) => {
        return <div className="parent-element-option">
            <span className="material-symbols-outlined">{otherElements[data.value].mdIcon}</span>
            {data.label}
        </div>;
    };
    const options: TOption[] = Object.values(otherElements)
        .filter(v => v.id !== id)
        .map(v => ({ value: v.id, label: v.title }));
    const selectedOptions = parentIds.map(id => ({value: id, label: otherElements[id].title}));
    return <>
        <div className="mb-5">
            <div className="row my-3 mx-1">
                <div className="col-sm-1 col-form-label pe-0 text-end">
                    <label htmlFor={htmlIdForTitle} className="">Title</label>
                </div>
                <div className="col-sm-7">
                    <input type="text" name="title" className="form-control" id={htmlIdForTitle} value={title} />
                </div>
                <div className="col-sm-1 col-form-label pe-0 text-end">
                    <label htmlFor={htmlIdForId} className="">Id</label>
                </div>
                <div className="col-sm-3">
                    <input type="text" name="title" className="form-control" id={htmlIdForId} value={id} disabled />
                </div>
            </div>
            <div className="row my-3 mx-1">
                <div className="col-sm-1 col-form-label pe-0 text-end">
                    <label htmlFor={htmlIdForMdIcon} className="">Icon</label>
                </div>
                <div className="col-sm-7">
                    <input type="text" name="title" className="form-control" id={htmlIdForMdIcon} value={mdIcon} aria-describedby={htmlIdForMdIconHint} />
                    <div id={htmlIdForMdIconHint} className="form-text">
                        At <a href={`https://fonts.google.com/icons?selected=Material+Symbols+Outlined:${mdIcon}:FILL@1`} target='_blank'>Google's Icons</a> copy "Icon name" on icon's infopanel
                    </div>
                </div>
                <div className="col-sm ps-0 col-form-label d-flex align-items-center align-self-start">
                    <span className="pe-2">
                        Preview
                    </span>
                    <span className="material-symbols-outlined">{mdIcon}</span>
                </div>
            </div>
            <div className="row my-3 mx-1">
                <div className="col-sm-1 col-form-label pe-0 text-end">
                    <label htmlFor={htmlIdForMdIcon} className="">Parents</label>
                </div>
                <div className="col-sm-7">
                    <Select 
                        options={options} 
                        // defaultValue={[{ value: 'grass', label: 'Grass' }]}
                        filterOption={(data: TOption) => {
                            return true;
                        }}
                        value={selectedOptions}
                        placeholder={'Select 0-3 parents'}
                        isMulti
                        isSearchable
                        openMenuOnFocus
                        formatOptionLabel={formatOptionLabel} 
                    />
                </div>
            </div>
        </div>
    </>
});

export default ElementEditForm;