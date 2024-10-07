import { observer } from "mobx-react-lite";
import { ReactNode, useState } from "react";

import './Disclaimer.css';

// TODO: Spoiler

type TDisclaimerProps = {
    children: ReactNode, 
    forceOpened?: boolean,
    allowInnerClick?: boolean
}

const Disclaimer = observer(({children, forceOpened, allowInnerClick}: TDisclaimerProps) => {
    const [opened, setOpened] = useState<boolean>(false);
    const cls = [
        'disclaimer',
        opened ? 'opened' : 'not-opened',
        forceOpened ? 'force-opened' : 'not-force-opened',
        allowInnerClick ? 'allow-inner-click' : 'not-allow-inner-click',
    ].join(' ')
    return <span 
        className={cls}
        onClick={() => !opened && !forceOpened && setOpened(true)}
    >
        {children}
    </span>
});

export default Disclaimer;