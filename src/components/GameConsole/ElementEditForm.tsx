import { useEffect, useId, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import MobxReactForm from 'mobx-react-form';
import Select, { ActionMeta, MultiValue, Options } from 'react-select';
import { concatIds, unconcatIds } from "../../model/ElementsStore.utils";
import { TElement } from "../../model/Element";

import './ElementEditForm.css';

import zod from 'mobx-react-form/lib/validators/ZOD';
import z from 'zod';

const ICON_PREVIEW_SIZE = 24;

const FORM_SCHEME = z.object({
    id: z.string(),
    title: z.string().min(1).max(30),
    mdIcon: z.string().min(1),
    parentIdsJoined: z.string().optional(),
    // NOTE: однобуквенные иконки допускаются, чтобы можно было использовать буквы и эмодзи
});

// type TOption = string; // :(
type TOption = {
    value: string;
    label: string;
};

export type TEditableElement = Pick<TElement, "id" | "mdIcon" | "title" | "parentIds">;
type TOtherElement = Pick<TElement, "id" | "mdIcon" | "title">;
type TOtherElements = { otherElements: Record<string, TOtherElement> };

type TDrawerClb = {
    onSubmit: () => void;
    onCancel: () => void;
}

type TFormClb = {
    onFieldChange: (values: TEditableElement) => void;
    onCancel: (id: string) => void;
    onSave: (id: string, values: TEditableElement) => void;
}

type TElementEditFormDrawerProps = TEditableElement & TOtherElements & {form: MobxReactForm} & TDrawerClb;

type TElementEditFormProps = TEditableElement & TOtherElements & TFormClb;

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

const useInputAttributes = (id: string, er?: string|null, className?: string) => {
    return {
        className: `form-control ${er ? 'is-invalid' : ''} ${className || ''}`,
        "aria-describedby": er ? `error-${id}` : null
    };
}

const ElementEditFormDrawer = observer(({id, mdIcon, title, parentIds, otherElements, form, onSubmit, onCancel}: TElementEditFormDrawerProps) => {
    const htmlIdForId = useId();
    const htmlIdForTitle = useId();
    const htmlIdForMdIcon = useId();
    const htmlIdForMdIconHint = useId();
    const htmlIdForMdIconPreview = useId();
    const iconPreviewRef = useRef<HTMLSpanElement>(null);
    // TODO: заменить "in" на "", "not" на ""
    const [notMounted, setNotMounted] = useState<boolean>(true);
    const [incorrectIcon, setIncorrectIcon] = useState<boolean>(true);
    const isIncorrectIcon = (): boolean => {
        // иконка рендерится квадратной, ICON_PREVIEW_SIZE в стилях присутствует
        // если превьюшка шире ICON_PREVIEW_SIZE - браузер покаызвает текст вместо иконки
        // *1.5 чтобы точно избежать каких-нибудь браузерных игр со сглаживанием (гугловских иконок)
        // *1.5 потому что "Щ" занимает 24.22 пикселя, "🎨" 32.95px, "🩱" 21.17px
        // NOTE: (ачивка) валидируем пользовательский ввод браузерным рендером
        return Number(iconPreviewRef.current?.clientWidth) > ICON_PREVIEW_SIZE * 1.5; 
    }
    useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            setNotMounted(false);
        }, 1);
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    useEffect(()=>{
        setIncorrectIcon(isIncorrectIcon());
    }, [form.$('mdIcon').value]);
    useEffect(()=>{
        const field = form.$('mdIcon');
        if (isIncorrectIcon()) {
            field.invalidate(`No corresponding icon in font`);
        } else {
            field.resetValidation();
        }
    }, [incorrectIcon]);
    const formatOptionLabel = (data: TOption) => {
        return <ElementEditParentOption data={data} otherElements={otherElements} />
    };
    const options: TOption[] = Object.values(otherElements)
        .filter(v => v.id !== id)
        .map(v => ({ value: v.id, label: v.title }));
    const selectedOptions = unconcatIds((form.$('parentIdsJoined').value+''))
        .map(id => ({value: id, label: otherElements[id].title}));
    const toSelect = {};
    if (selectedOptions.length >= 3) {
        // больше трех элементов не выбираем
        //@ts-ignore
        toSelect.menuIsOpen = false;
    }
    const errors = form.errors();
    const onReset = () => {
        form.onReset();
    };
    return <>
        <form className={`element-edit-form editing-container ${notMounted ? 'not-mounted' : 'mounted'}`}>
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
                        <input 
                            type="text" 
                            name="id" 
                            {...form.$('id').bind()}
                            {...useInputAttributes(htmlIdForId, errors.id)}
                            disabled 
                        />
                        <FormError msg={errors.id} htmlFor={htmlIdForId} />
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
                            aria-describedby={errors.mdIcon ? 'error-' + htmlIdForMdIcon : htmlIdForMdIconHint} 
                            onBlur={()=>{
                                const check = async() => {
                                    const field = await form.$('mdIcon').validate();
                                    const er = field.errorSync || field.errorAsync;
                                    if (er) {
                                        field.showErrors();
                                        return;
                                    } else {
                                        if (isIncorrectIcon()) {
                                            field.invalidate(`No corresponding icon in font`);
                                        }
                                    }
                                };
                                check();
                            }}
                        />
                        <div id={htmlIdForMdIconHint} className="form-text">
                            At <a href={`https://fonts.google.com/icons?selected=Material+Symbols+Outlined:${mdIcon}:FILL@1`} target='_blank'>Google's Icons</a> copy "Icon name" on icon's infopanel
                        </div>
                        <FormError msg={errors.mdIcon} htmlFor={htmlIdForMdIcon} />
                    </div>
                    <div className="col-sm ps-0 col-form-label d-flex align-items-center align-self-start" style={{overflow:"hidden"}}>
                        <span className="pe-2">
                            <span 
                                id={htmlIdForMdIconPreview}
                                className={`preview-icon-label ${form.$('mdIcon').value.length ? '' : 'no-icon-name'}`}
                            >
                                Preview
                            </span>
                        </span>
                        <span 
                            className="material-symbols-outlined" 
                            ref={iconPreviewRef}
                            style={{fontSize:ICON_PREVIEW_SIZE+'px', lineHeight:ICON_PREVIEW_SIZE+'px'}}
                            aria-labelledby={htmlIdForMdIconPreview}
                        >{form.$('mdIcon').value}</span>
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
                            value={selectedOptions}
                            placeholder={'Select 0-3 parents'}
                            isMulti
                            isSearchable
                            openMenuOnFocus
                            menuPosition="fixed" // боремся с overflow: hidden
                            formatOptionLabel={formatOptionLabel} 
                            hideSelectedOptions={false}
                            {...toSelect}
                            isOptionSelected={(_option: { value: string; label: string; }, _selectValue: Options<{ value: string; label: string; }>)=>{
                                // поведение по умолчанию:
                                // имеем: ['jump', 'jump'], добавляем третий 'jump', получаем: [] (ожидаем ['jump', 'jump', 'jump'])
                                // имеем: ['air', 'microbes'], добавляем 'air', получаем: ['microbes'] (ожидаем ['air', 'air', 'microbes'])
                                // снятие состояния выделения приводит к ожидаемому поведению при дублировании выбранных option'ов
                                // выбранный option и выделенный option - вещи разные
                                return false;
                            }}
                            onChange={(newValue: MultiValue<TOption>, actionMeta: ActionMeta<TOption>) => {
                                let expectedNewValue = newValue;
                                if (actionMeta.action==="remove-value") {
                                    // поведение по умолчанию:
                                    // имеем: ['jump', 'jump'], удаляем 'jump', получаем [] (ожидаем 'jump')
                                    // будем очищать только один элемент из selectedOptions
                                    const id = actionMeta.removedValue.value;
                                    const _i = selectedOptions.findIndex(v => v.value === id);
                                    // Property 'splice' does not exist on type 'MultiValue<TOption>'
                                    expectedNewValue = selectedOptions.filter((_v,i)=> i !== _i);
                                }
                                // if (actionMeta.action==="select-option") .option
                                form.$('parentIdsJoined').set(concatIds(expectedNewValue.map(v => v.value)));
                            }}
                        />
                        <input {...form.$('parentIdsJoined').bind()} type="hidden" />
                    </div>
                </div>
                <div className="row my-3 mx-1">
                    <div className="col offset-1 hstack gap-3">
                        <button 
                            type="submit" 
                            onClick={onSubmit} 
                            className="btn btn-primary"
                            disabled={form.isDefault || !form.isValid}
                        >Save</button>
                        <button 
                            type="reset" 
                            onClick={onReset} 
                            className="btn btn-outline-primary"
                            disabled={form.isDefault}
                        >Reset</button>
                        <button 
                            className="btn btn-outline-primary" 
                            onClick={(e)=>{
                                e.preventDefault();
                                onCancel();
                            }}
                        >Cancel</button>
                    </div>
                </div>
            </div>
        </form>
    </>
});

const ElementEditForm = observer(({id, mdIcon, title, parentIds, otherElements, onFieldChange, onCancel, onSave}: TElementEditFormProps) => {
    const fields = [
        {
            name: 'id',
            default: id,
            value: id,
        },
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
        {
            name: 'parentIdsJoined',
            default: concatIds(parentIds),
            value: concatIds(parentIds),
            // output: (v: string) => unconcatIds(v),
        }
    ];
    const plugins = {
        zod: zod({
            package: z,
            schema: FORM_SCHEME,
        })
    };
    const options = {
        fields,
        validateOnInit: true,
        validateOnChange: true,
        showErrorsOnInit: true,
    }
    const hooks = {
        onSuccess(_form: any) {
            console.error('NOTE: мы сюда не приходим (enter проверял)');
        },
        onError(_form: any) {
            console.error('NOTE: да, сюда тоже не приходим');
        }
    };
    const [form, setForm] = useState<MobxReactForm>();
    useEffect(()=>{
        setForm(new MobxReactForm(options, { plugins, hooks }));
    }, []);
    if (!form) return null;
    const onSubmit = () => {
        const values = form.values();
        values.parentIds = unconcatIds(values.parentIdsJoined);
        onSave(id, values);
    };
    const myFieldChange = async () => {
        const values = form.values();
        values.parentIds = unconcatIds(values.parentIdsJoined);
        onFieldChange(values);
    };
    fields.forEach(({name}: {name: string}) => {
        form.observe({
            path: name,
            key: "value",
            call: myFieldChange
        });
    });
    return <ElementEditFormDrawer 
        id={id} 
        mdIcon={mdIcon} 
        title={title} 
        parentIds={parentIds} 
        otherElements={otherElements} 
        form={form} 
        onSubmit={onSubmit}
        onCancel={()=>onCancel(id)}
    />
});

export default ElementEditForm;