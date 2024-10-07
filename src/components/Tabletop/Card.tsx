import { observer } from "mobx-react-lite";
import useRootStore from "../../Contexts";
import Element from "../../model/Element";

import './Card.css';
import './Card.typography.css';
import { useMemo } from "react";

const CardContent = observer(({mdIcon, title}: {mdIcon: string, title: string}) => {
    return <>
        <div className="d-flex flex-column justify-content-center ecard-size ecard-content">
            <div className="ecard-icon">
                <span className="material-symbols-outlined">{mdIcon}</span>  
            </div>
            <div className="ecard-title">{title}</div>
        </div>
    </>;
});

const useTypography = (title:string): [string, number, number] => {
    const charsInTitle = title.length;
    const charsInLongestWord = Math.max.apply(Math, title.split(' ').map(word => word.length));
    const className = [
        charsInTitle < 7 ? 'chars_0_7' : 'not-chars_0_7',
        charsInTitle >= 7 && charsInTitle < 10 ? 'chars_7_10' : '',
        charsInTitle >= 10 && charsInTitle < 15 ? 'chars_10_15' : '',
        charsInTitle >= 15 && charsInTitle < 20 ? 'chars_15_20' : '',
        charsInTitle >= 20 && charsInTitle < 25 ? 'chars_20_25' : '',
        charsInTitle >= 25 ? 'chars_25_30' : '',
        charsInLongestWord < 7 ? 'chars_word_0_7' : 'not-chars_word_0_7',
        charsInLongestWord >= 7 && charsInLongestWord < 10 ? 'chars_word_7_10' : '',
        charsInLongestWord >= 10 && charsInLongestWord < 15 ? 'chars_word_10_15' : '',
        charsInLongestWord >= 15 && charsInLongestWord < 20 ? 'chars_word_15_20' : '',
        charsInLongestWord >= 20 ? 'chars_word_20_30' : '',
    ]
        .filter(v => !!v)
        .join(' ');
    return [className, charsInTitle, charsInLongestWord];
};

export type TCardOnClick = (id: string) => void;

const Card = observer(({element, onClick, drawHelloAnimation}: {element: Element, onClick?: TCardOnClick, drawHelloAnimation?: boolean}) => {
    const [classNameChars] = useMemo(() => useTypography(element.title), [element.title]);
    const className = useMemo(() => {
        return [
            'ecard',
            'ecard-size',
            'ecard-' + element.id, 
            `ecard_${element.i_0_7}_7`,
            drawHelloAnimation && 'ecard_draw-hello-animation',
        ]
            .concat(classNameChars)
            .filter(v => !!v)
            .join(' ');
    }, [element.id, element.i_0_7, classNameChars]);
    return <>
        <div className={className} data-card-id={element.id} onClick={()=>onClick?.(element.id)}>
            <div className="pe-none ecard-rotate">
                <div className="pe-none ecard-move">
                    <div className="pe-none ecard-size ecard-bg ecard-clip-fill"></div>
                    <div className="ecard-size ecard-clip-fill ecard-content-clicpped">
                        <CardContent title={element.title} mdIcon={element.mdIcon} />
                    </div>
                    <div className="pe-none ecard-size ecard-clip-stroke ecard-border"></div>
                    <div className="pe-none ecard-size ecard-content-unclicpped">
                        <CardContent title={element.title} mdIcon={element.mdIcon} />
                    </div>
                </div>
            </div>
        </div>
    </>;
});

export default Card;