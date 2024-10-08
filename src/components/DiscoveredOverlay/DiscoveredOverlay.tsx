import { observer } from "mobx-react-lite";
import CONST from "../../const";
import Element from "../../model/Element";

import Delayed from "../Delayed";
import { useEffect } from "react";

import './DiscoveredOverlay.css';
import './DiscoveredOverlay.Discovered-overlay-opened.css';

const Inkwell = observer(() => {
    // https://codepen.io/z-/pen/zYxdRQy
    return <>
        <svg width="500" height="200" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="fx-inkwell">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="blob"></feColorMatrix>
                </filter>
            </defs>
        </svg>
        <div className="inkwell pe-none">
            {(Array.from({length:50})).map((_v, i) => {
                return <div key={'b'+i} className={`bubble bubble_${i}_50 bubble_${i%6}_6 bubble_${i%7}_7 bubble_${i%11}_11 bubble_${i%20}_20`}></div>;
            })}
        </div>
    </>
});

const Blot = observer(() => {
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap
    return <>
        <svg
            width="200"
            height="200"
            viewBox="0 0 220 220"
            xmlns="http://www.w3.org/2000/svg"
        >
        <filter id="displacementFilter">
            <feTurbulence
                type="turbulence"
                baseFrequency="0.05"
                numOctaves="2"
                result="turbulence" />
            <feDisplacementMap
                in2="turbulence"
                in="SourceGraphic"
                scale="50"
                xChannelSelector="R"
                yChannelSelector="G" />
        </filter>
            <circle cx="100" cy="100" r="100" className="blot-circle" style={{filter: "url(#displacementFilter)"}} />
        </svg>
    </>;
});

const BlottedCard = observer(({element}: {element:Element}) => {
    return <>
        <div className={`blotted-card blotted-card-${element.id}`}>
            <Delayed delay={2700}><div className="blot-1"><Blot /></div></Delayed>
            <Delayed delay={3500}><div className="blot-1b"><Blot /></div></Delayed>
            <Delayed delay={2500}><div className="blot-1c"><Blot /></div></Delayed>
            <Delayed delay={3200}><div className="blot-1d"><Blot /></div></Delayed>
            <Delayed delay={1700}><div className="blot-2"><Blot /></div></Delayed>
            <Delayed delay={700}><div className="blot-3"><Blot /></div></Delayed>
            <Delayed delay={1200}><div className="blot-4"><Blot /></div></Delayed>
            <Delayed delay={1100}><div className="blot-5"><Blot /></div></Delayed>
            <span className="material-symbols-outlined">{element.mdIcon}</span>  
            <div className="blotted-card-text">
                {element.title}
            </div>
        </div>
    </>
});

const DiscoveredHeader = observer(({discoveredElementsCount, countOfUndiscoveredElement}: {discoveredElementsCount:number, countOfUndiscoveredElement:number}) => {
    if (countOfUndiscoveredElement===0) {
        return <>
            <h1>You have unlocked all elements!</h1>
            <h2><span>Congratulations</span>{' 🏆 '}<span>the game is complete!</span></h2>
        </>
    }
    if (countOfUndiscoveredElement===1) {
        return <>
            <h1>New element{discoveredElementsCount > 1 && "s"} discovered!</h1>
            <h2><span>Only one element remained undiscovered</span></h2>
        </>
    }
    return <>
        <h1>New element{discoveredElementsCount > 1 && "s"} discovered!</h1>
        <h2><span>Another {countOfUndiscoveredElement} element{countOfUndiscoveredElement > 1 && "s"} remain undiscovered</span></h2>
    </>
});

const DiscoveredOverlay = observer(({elements, countOfUndiscoveredElement, onClose}: {elements:Element[], countOfUndiscoveredElement:number, onClose:()=>void}) => {
    useEffect(()=>{
        const onKeyUp = () => onClose(); // props.onClose mutable (possible)
        document.body.classList.add(CONST.BODY_CLASSNAME_DISCOVERED_OVERLAY_OPENED);
        // keypress event ignore esc button
        document.body.addEventListener('keyup', onKeyUp, false);
        return () => {
            document.body.classList.remove(CONST.BODY_CLASSNAME_DISCOVERED_OVERLAY_OPENED);
            document.body.removeEventListener('keyup', onKeyUp, false);
        }
    }, []);
    return <>
        <section className="discovered-overlay" role="dialog">
            <div className="discovered-overlay-bg"></div>
            <Delayed delay={1500}>
                <div className="discovered-line discovered-line-1 pe-none">
                    <Delayed delay={700}>
                        <div className="discovered-line-margin">
                            <DiscoveredHeader discoveredElementsCount={elements.length} countOfUndiscoveredElement={countOfUndiscoveredElement} />
                        </div>
                    </Delayed>
                </div>
            </Delayed>
            <Delayed delay={4000}>
                <Delayed delay={700}>
                    <Inkwell />
                </Delayed>
                <div className="discovered-line discovered-line-2 pe-none">
                    <Delayed delay={1000}>
                            <div className="discovered-line-margin">
                                {
                                    elements.map((v=><BlottedCard key={v.id} element={v} />))
                                }
                            </div>
                    </Delayed>
                </div>
            </Delayed>
            <div className="discovered-overlay-close-always-visible" onClick={()=>onClose()}>
                <Delayed delay={9000}>
                    <span className="material-symbols-outlined discovered-overlay-close pe-none">disabled_by_default</span>  
                </Delayed>
            </div>
        </section>
    </>;
});

export default DiscoveredOverlay;