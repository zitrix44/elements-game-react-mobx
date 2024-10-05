import { observer } from "mobx-react-lite";
import useRootStore from "../../Contexts";
import Element from "../../model/Element";

import './Card.css';
import './Card.typography.css';

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

const Card = observer(({element}: {element: Element}) => {
    const charsInTitle = element.title.length;
    const charsInLongestWord = Math.max.apply(Math, element.title.split(' ').map(word => word.length));
    const classNameChars = [
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
    ];
    const className = [
        'ecard',
        'ecard-size',
        'ecard-' + element.id, 
        `ecard_${element.i_0_7}_7`,
    ]
        .concat(classNameChars)
        .filter(v => !!v)
        .join(' ');
    return <>
        <div className={className} data-card-id={element.id}>
            <div className="pe-none ecard-size ecard-bg ecard-clip-fill"></div>
            <div className="ecard-size ecard-clip-fill ecard-content-clicpped">
                <CardContent title={element.title} mdIcon={element.mdIcon} />
            </div>
            <div className="pe-none ecard-size ecard-clip-stroke ecard-border"></div>
            <div className="pe-none ecard-size ecard-content-unclicpped">
                <CardContent title={element.title} mdIcon={element.mdIcon} />
            </div>
        </div>
    </>;
});

export default Card;