import { observer } from "mobx-react-lite";

import './GameConsole.css';
import GameConsoleTable from "./GameConsoleTable";

const GameConsole = observer(() => {
    return <>
        <div className="console">
            asd
            <GameConsoleTable />
        </div>
    </>;
});

export default GameConsole;