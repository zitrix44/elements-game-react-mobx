import { observer } from "mobx-react-lite";
import { useEffect, useInsertionEffect, useState } from "react";
import useRootStore from "../../Contexts";

let style: HTMLStyleElement | null = null;

const ColorSchemesDefine = observer(()=>{
    const [store] = useRootStore();
    const [cssText, setCssText] = useState<string>(store.themeStore.colorSchemesCssText);
    useInsertionEffect(() => {
        style = document.createElement('style');
        style.textContent = store.themeStore.colorSchemesCssText;
        document.head.appendChild(style);
    }, []);
    useEffect(() => {
        setCssText(store.themeStore.colorSchemesCssText)
    }, [store.themeStore.colorSchemesCssText]);
    useEffect(() => {
        if (!style) return;
        style.textContent = cssText;
    }, [cssText]);
    return null;
});

export default ColorSchemesDefine;