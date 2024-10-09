import { useId } from "react";
import { observer } from "mobx-react-lite";
import { TElement } from "../../model/Element";

const ElementEditForm = observer(({id, mdIcon, title, parentIds}: Pick<TElement, "id" | "mdIcon" | "title" | "parentIds">) => {
    const htmlIdForId = useId();
    const htmlIdForTitle = useId();
    return <>
        <div className="row my-3 me-1">
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
    </>
});

export default ElementEditForm;