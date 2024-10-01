import { observer } from "mobx-react-lite";
import { ReactNode, useEffect, useState } from "react";

import './Delayed.css';

export const CLASSNAME_DELAYED_HIDDEN_USE_OPACITY = 'delayed-hidden-use-opacity';

type TDelayed = {
    children: ReactNode;
    childrenWhileDelay?: ReactNode;
    divWhileDelay?: boolean;
    spanWhileDelay?: boolean;
    // NOTE: please, no tfootWhileDelay
    // NOTE: avoid no tagWhiteDelay: string
    delay?: number;
}

const Delayed = observer((
    {children, childrenWhileDelay, divWhileDelay, spanWhileDelay, delay = 0}: TDelayed
) => {
    const [hidden, setHidden] = useState<boolean>(true); // the delay works as regular timeout works
    useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            if (hidden) setHidden(false);
        }, delay);
        return () => {
            if (hidden) clearInterval(timeoutId);
        }
    }, []);
    if (hidden) {
        if (childrenWhileDelay) {
            return <>{childrenWhileDelay}</>;
        }
        if (divWhileDelay) {
            return <div key="hidden" className="delayed-hidden delayed-hidden-div">{children}</div>;
        }
        if (spanWhileDelay) {
            return <span key="hidden" className="delayed-hidden delayed-hidden-span">{children}</span>;
        }
        return;
    }
    return <>{children}</>;
});

export default Delayed;