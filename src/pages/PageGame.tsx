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
});

const MyFigure2 = observer(({width, borderWidth=0, fill="currentColor", stroke="transparent"}: {width: string, borderWidth?: number, fill?:string, stroke?:string}) => {
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
                <path d="M10,0 L10,0 L30,100 L10,100 L0,90 L0,10 Z" />
                <path d="M50,0 L90,0 L100,10 L100,30 L40,20 Z" transform="translate(-4 4) rotate(-5 50 0)" />
                <path d="M100,45 L100,90 L90,100 L70,100 Z" />
                <path d="M95,40 L65,100 L40,100 L20,22 Z" />
            </svg>
        </div>
    </>;
});

const MyFigure3 = observer(({width, borderWidth=0, fill="currentColor", stroke="transparent"}: {width: string, borderWidth?: number, fill?:string, stroke?:string}) => {
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
                {/* <path d="M50,0 L100,45 L80,100 L20,100 L0,45 Z" /> */}
                <path d="
                    M 50 2   
                    C 60 15, 95 45, 100 45    
                    C 95 45, 80 95, 80 100   
                    C 80 95, 25 100, 15 100 
                    C 15 80, 0 45, 1 45 
                    C 5 42, 55 5, 50 2
                    Z
                " />
            </svg>
        </div>
    </>;
});

const MyFigure4Fill = observer(({width, borderWidth=0, fill="currentColor", stroke="transparent"}: {width: string, borderWidth?: number, fill?:string, stroke?:string}) => {
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
                <path d="
                    M 6 26   
                    C 16 20, 78 12, 78 12   
                    C 90 30, 105 60, 91 90
                    C 91 99, 7 93, 7 93
                    C 0 70, 0 50, 6 26
                " />
            </svg>
        </div>
    </>;
});

const MyFigure4Stroke = observer(({width, borderWidth=0, fill="currentColor", stroke="transparent"}: {width: string, borderWidth?: number, fill?:string, stroke?:string}) => {
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
                <path d="
                    M 0 30   
                    C 10 20, 100 0, 100 20   
                " />
                <path d="
                    M 0 90
                    C 5 95, 95 100, 100 85   
                " />
                <path d="
                    M 15 15
                    C 5 10, -10 95, 20 100   
                " />
                <path d="
                    M 60 0
                    C 80 0, 120 70, 80 100   
                " />
            </svg>
        </div>
    </>;
});

const PageGame = observer(() => {
    const store = useContext(StoreContext);
    const elements = store.elementsStore.array;
    return <>
        <div className="page-game">
            <GameBG />
            <h1>PageGame 🎢</h1>
            <div className="hstack gap-3">
                <div style={{background:"white",position:"relative",height:"150px", width:"150px"}}>
                    <div style={{position:"absolute"}}><MyFigure4Fill width="150px" fill="#33993366" borderWidth={5}/></div>
                    <div style={{position:"absolute"}}><MyFigure4Stroke width="150px" fill="none" borderWidth={5} stroke="#ff000033"/></div>
                </div>
                <div style={{background:"white",position:"relative",height:"150px", width:"150px"}}>
                    <div style={{position:"absolute"}}><MyFigure3 width="150px" fill="#33993366" borderWidth={5}/></div>
                    <div style={{position:"absolute"}}><MyFigure3 width="150px" fill="none" borderWidth={5} stroke="#ff000033"/></div>
                </div>
                <div style={{background:"white",position:"relative",height:"150px", width:"150px"}}>
                    <div style={{position:"absolute"}}><MyFigure width="150px" fill="#33993366" borderWidth={5}/></div>
                    <div style={{position:"absolute"}}><MyFigure width="150px" fill="none" borderWidth={5} stroke="#ff000033"/></div>
                </div>
                <div style={{background:"white",position:"relative",height:"150px", width:"150px"}}>
                    <div style={{position:"absolute"}}><MyFigure2 width="150px" fill="#33993366" borderWidth={5}/></div>
                    <div style={{position:"absolute"}}><MyFigure2 width="150px" fill="none" borderWidth={5} stroke="#ff000033"/></div>
                </div>
            </div>
            <div className="d-flex flex-wrap">
                {elements.map(v => <Card key={v.id} element={v} />)}
            </div>
            <ElementsList elements={toJS(elements)} />
        </div>
    </>
});

export default PageGame;