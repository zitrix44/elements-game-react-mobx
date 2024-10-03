import { observable, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import ElementsList from "../components/ElementsList";
import GameBG from "../components/GameBG";
import { StoreContext } from "../Contexts";
import { Card } from "../components/Tabletop";

import './PageGame.css';

const MyFigure = observer(({width, borderWidth=0, fill="currentColor", stroke="transparent"}: {width: string, borderWidth?: number, fill?:string, stroke?:string}) => {
    return <>
        <div style={{width:width,height:width}}>
            <svg 
                className="pe-none" 
                xmlns="http://www.w3.org/2000/svg" 
                height={width} 
                width={width} 
                viewBox={`${borderWidth/-2} ${borderWidth/-2} ${100+borderWidth} ${100+borderWidth}`}
                fill={fill}
                stroke={stroke}
                strokeWidth={borderWidth+'px'}
            >
                <path d="M10,0 L90,0 L100,10 L100,90 L90,100 L10,100 L0,90 L0,10 Z" />
            </svg>
        </div>
    </>;
})

const PageGame = observer(() => {
    const store = useContext(StoreContext);
    const elements = store.elementsStore.array;
    return <>
        <div className="page-game">
            <GameBG />
            <h1>PageGame 🎢</h1>
            <div style={{background:"white",position:"relative",height:"300px"}}>
                <div style={{position:"absolute"}}><MyFigure width="300px" fill="#33993366" borderWidth={5}/></div>
                <div style={{position:"absolute"}}><MyFigure width="300px" fill="none" borderWidth={5} stroke="#ff000033"/></div>
            </div>
            <div className="d-flex flex-wrap">
                {elements.map(v => <Card key={v.id} element={v} />)}
            </div>
            <ElementsList elements={toJS(elements)} />
        </div>
    </>
});

export default PageGame;