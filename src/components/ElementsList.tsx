import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import Element from "../model/Element";

const ElementItem = observer(({v}: {v:Element}) => {
    return <>
        <li>#{v.id} «{v.title}»</li>
    </>;
});

const ElementsList = observer(({elements}: {elements:Element[]})=>{
    return <>
        <ul>
            {elements.map(v => <ElementItem v={toJS(v)} key={v.id} />)}
        </ul>
    </>;
});

export default ElementsList;