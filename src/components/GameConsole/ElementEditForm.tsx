import { useEffect, useId, useState } from "react";
import { observer } from "mobx-react-lite";
import MobxReactForm from 'mobx-react-form';
import Select from 'react-select';
import { TElement } from "../../model/Element";

import zod from 'mobx-react-form/lib/validators/ZOD';
import z from 'zod';

import './ElementEditForm.css';



const $schema = z.object({
    title: z.string().min(1).max(30),
    mdIcon: z.string().min(1),
})

const plugins = {
    zod: zod({
        package: z,
        schema: $schema,
    }),
    // dvr: dvr({ package: validatorjs }),
};

// const fields = {
//     title: {
//         placeholder: 'asd'
//     }
// }
// const fields = [
//     {
//         name: 'title',
//         label: 'Email',
//         placeholder: 'Insert Email',
//         // rules: 'required|string|between:1,30',
//     },
// ];

const hooks = {
    onSuccess(_form: any) {
        alert('Form is valid! Send the request here.');
        // get field values
        // console.log('Form Values!', form.values());
    },
    onError(_form: any) {
        alert('Form has errors!');
        // get all form errors
        // console.log('All form errors', form.errors());
    }
};

// type TOption = string; // :(
type TOption = {
    value: string;
    label: string;
};

type TMyElement = Pick<TElement, "id" | "mdIcon" | "title" | "parentIds">;
type TOtherElement = Pick<TElement, "id" | "mdIcon" | "title">;
type TOtherElements = { otherElements: Record<string, TOtherElement> };
type TElementEditFormProps = TMyElement & TOtherElements;

const ElementEditParentOption = observer(({data, otherElements}: {data: TOption } & TOtherElements) => {
    return <div className="parent-element-option">
        <span className="material-symbols-outlined">{otherElements[data.value].mdIcon}</span>
        {data.label}
    </div>;
});

const FormError = observer(({msg, htmlFor}:{ msg?: string | null, htmlFor?: string }) => {
    if (!msg) return null;
    return <label id={`error-${htmlFor}`} htmlFor={htmlFor} className="form-text text-danger">{msg}</label>;
});

// : {id:string, className:string, aria-describedby?: string}

const useInputAttributes = (id: string, er?: string|null, className?: string) => {
    return {
        className: `form-control ${er ? 'is-invalid' : ''} ${className || ''}`,
        "aria-describedby": er ? `error-${id}` : null
    };
}

const ElementEditFormDrawer = observer(({id, mdIcon, title, parentIds, otherElements, form}: TElementEditFormProps & {form: MobxReactForm}) => {
    const htmlIdForId = useId();
    const htmlIdForTitle = useId();
    const htmlIdForMdIcon = useId();
    const htmlIdForMdIconHint = useId();
    const [notMounted, setNotMounted] = useState<boolean>(true);
    useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            setNotMounted(false);
        }, 1);
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    const formatOptionLabel = (data: TOption) => {
        return <ElementEditParentOption data={data} otherElements={otherElements} />
    };
    const options: TOption[] = Object.values(otherElements)
        .filter(v => v.id !== id)
        .map(v => ({ value: v.id, label: v.title }));
    const selectedOptions = parentIds.map(id => ({value: id, label: otherElements[id].title}));
    const errors = form.errors();
    console.log(errors.mdIcon)
    return <>
        <div className={`editing-container ${notMounted ? 'not-mounted' : 'mounted'}`}>
            <div className="mt-4 mb-5">
                <div className="row my-3 mx-1">
                    <div className="col-sm-1 col-form-label pe-0 text-end">
                        <label htmlFor={htmlIdForTitle}>Title</label>
                    </div>
                    <div className="col-sm-7">
                        <input 
                            type="text" 
                            name="title" 
                            {...form.$('title').bind()}
                            {...useInputAttributes(htmlIdForTitle, errors.title)}
                        />
                        <FormError msg={errors.title} htmlFor={htmlIdForTitle} />
                    </div>
                    <div className="col-sm-1 col-form-label pe-0 text-end">
                        <label htmlFor={htmlIdForId} className="">Id</label>
                    </div>
                    <div className="col-sm-3">
                        <input type="text" name="id" className="form-control" id={htmlIdForId} value={id} disabled />
                    </div>
                </div>
                <div className="row my-3 mx-1" style={{flexWrap:"nowrap"}}>
                    <div className="col-sm-1 col-form-label pe-0 text-end">
                        <label htmlFor={htmlIdForMdIcon} className="">Icon</label>
                    </div>
                    <div className="col-sm-7">
                        <input 
                            type="text" 
                            name="mdIcon" 
                            {...form.$('mdIcon').bind()}
                            {...useInputAttributes(htmlIdForMdIcon, errors.mdIcon)}
                            // aria-describedby={htmlIdForMdIconHint} 
                        />
                        <div id={htmlIdForMdIconHint} className="form-text">
                            At <a href={`https://fonts.google.com/icons?selected=Material+Symbols+Outlined:${mdIcon}:FILL@1`} target='_blank'>Google's Icons</a> copy "Icon name" on icon's infopanel
                        </div>
                        <FormError msg={errors.mdIcon} htmlFor={htmlIdForMdIcon} />
                    </div>
                    <div className="col-sm ps-0 col-form-label d-flex align-items-center align-self-start" style={{overflow:"hidden"}}>
                        <span className="pe-2">
                            Preview
                        </span>
                        <span className="material-symbols-outlined">{form.$('mdIcon').value}</span>
                    </div>
                </div>
                {/* 
                <div className="row my-3 mx-1">
                    <div className="col-sm-1 col-form-label pe-0 text-end">
                        <label htmlFor={htmlIdForMdIcon} className="">Parents</label>
                    </div>
                    <div className="col-sm-7">
                        <Select 
                            options={options} 
                            // defaultValue={[{ value: 'grass', label: 'Grass' }]}
                            value={selectedOptions}
                            placeholder={'Select 0-3 parents'}
                            isMulti
                            isSearchable
                            openMenuOnFocus
                            menuPosition="fixed" // боремся с overflow: hidden
                            formatOptionLabel={formatOptionLabel} 
                        />
                    </div>
                </div>
                */}
            </div>
        </div>
    </>
});


const ElementEditForm = observer(({id, mdIcon, title, parentIds, otherElements}: TElementEditFormProps) => {
    const fields = [
        {
            name: 'title',
            placeholder: 'e.g. Air, Fire extinguisher',
            default: title,
            value: title,
        },
        {
            name: 'mdIcon',
            placeholder: 'e.g. air, fire_extinguisher',
            default: mdIcon,
            value: mdIcon,
        },
    ];
    const options = {
        fields,
        validateOnInit: true,
        validateOnChange: true,
        showErrorsOnInit: true,
    }
    const form = new MobxReactForm(options, { plugins, hooks });
    return <ElementEditFormDrawer id={id} mdIcon={mdIcon} title={title} parentIds={parentIds} otherElements={otherElements} form={form} />
});

export default ElementEditForm;