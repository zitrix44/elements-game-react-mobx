import { ReactNode, useContext, useState } from 'react';
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { ToastContainer } from 'react-toastify';
import { Md5 } from 'ts-md5';
import { RootStore, StoreContext } from '../Contexts';
import LaunchStore from '../model/LaunchStore';
import { TError } from '../model/ElementsStore.utils';
import Disclaimer from './Disclaimer';
import CopyButton from './CopyButton';

import './Launcher.css';
import Delayed, { CLASSNAME_DELAYED_HIDDEN_USE_OPACITY } from './Delayed';
import { envBroken, envNumber } from '../utils';

const LauncherH1 = observer(({onClickStart}: {launchStore: LaunchStore, onClickStart: () => void}) => {
    // NOTE: clickable <a />, #tl-dr-play
    // - <Delayed /> > <a /> must be clickable (while text is invisible)
    // - #tl-dr-play for UserJS (as example)
    return <>
        <div className='horizontal-overflow'>
            <h1 className={CLASSNAME_DELAYED_HIDDEN_USE_OPACITY}>
                Launcher
                <Delayed delay={envNumber('LAUNCHER_TLDR_DELAY') || 10_000} spanWhileDelay> 
                    {/*  */}
                    <small>
                        <a href="#" className='ms-5 tl-dr-play' id='tl-dr-play' onClick={(e)=>{
                            e.preventDefault();
                            onClickStart();
                        }}>
                            <Delayed delay={2000} spanWhileDelay> 
                                <span className='tl-dr-tl-dr'>
                                    <H1WordFadeIn delay={0}>tl;dr</H1WordFadeIn>
                                </span>
                                <span className='play-icon-container'>
                                    <Delayed delay={3000}>
                                        <span className='play-icon play-icon-size'>
                                            <span className='play-icon-size play-icon-move'>
                                                <span className='play-icon-size play-icon-rotate'>
                                                    <span className="material-symbols-outlined">
                                                        play_circle
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                    </Delayed>
                                </span>
                                <span className='tl-dr-description'>
                                    <H1WordFadeIn delay={1000}>play </H1WordFadeIn>
                                    <H1WordFadeIn delay={1200}>default </H1WordFadeIn>
                                    <H1WordFadeIn delay={1400}>game</H1WordFadeIn>
                                </span>
                            </Delayed>
                            <span className='tl-dr-overlap-fade-out'>
                                <span className='play-icon-size tl-dr-overlap'>
                                    <span className='play-icon-size tl-dr-overlap-white'></span>
                                </span>
                            </span>
                        </a>
                    </small>
                </Delayed>
            </h1>
        </div>
    </>;
});
const H1WordFadeIn = observer(({children, delay = 0}: {children: ReactNode, delay?: number}) => {
    // @key for swap nodes
    return <>
        <Delayed
            delay={delay}
            spanWhileDelay
        >
            <span className='tl-dr-word'>
                    <span className='tl-dr-word-move'>
                        <span className='tl-dr-word-move-2'>
                            <span className='tl-dr-word-skew'>
                            {children}
                            </span>
                        </span>
                </span>
            </span>
        </Delayed>
    </>;
});

const InHeaderErrorIcon = observer(() => {
    return <>
        <span className='in-header-error-icon'>
            <span className="material-symbols-outlined in-header-error-icon-fill">
                error
            </span>
            <span className="material-symbols-outlined in-header-error-icon-stroke">
                error
            </span>
        </span>
    </>;
});
const LauncherElementsInput = observer(({launchStore}: {launchStore: LaunchStore}) => {
    const nothing = launchStore.elementsStartAt === null;
    const error = !nothing && launchStore.elementsParseError !== null;
    const state = nothing ? "nothing" : "something";
    return <>
        <div className={`card card-state-${state}`} id="data-section">
            <div className="card-header ">
                <h4>
                    { nothing && <InHeaderErrorIcon /> }
                    Data section
                </h4>
            </div>
            <div className="card-body">
                <p>
                    At first, it is possible to <a href="#">just run the game</a> with default elements. 
                    <span className="badge text-bg-info ms-2">Start with me!</span>
                </p>
                <p>
                    Otherwise, use predefined dataset (mockup), or your own CSV file. 
                    Check out <a href="https://fonts.google.com/icons" target='_blank'>Google's Icons</a> for fill <code>mdIcon</code> column (copy the "<code>Icon name</code>" at icon's infopanel).
                </p>
                <p>
                    For play, used dataset should have{' '}
                    { error ? <>no <a href="#parsing" className='text-danger'>parsing errors</a></> : "no parsing errors" }, 
                    and{' '}
                    { launchStore.elementsLogicErrors.length ? <>no <a href="#logical-errors" className='text-danger'>logical errors</a></> : "no logical errors" }, 
                    and (please) 
                    TODO: 
                    no missing icons.
                </p>
                <p className='mb-1'>
                    Input modes:
                </p>
                <p>
                    <b>Runtime TODO:</b> – change the elements tree (dataset) while you play (at "Debug" tab; download provided)
                    <span className="badge text-bg-info ms-2">Visual mode</span>
                    <br />
                    <b>Mockup  TODO:</b> – choose predefined dataset (after: click "Use", click "Play")
                    <br />
                    <b>Upload  TODO:</b> – for upload your own elements tree (see samples below)
                    <br />
                    <b>Edit  TODO:</b> – modify used dataset (or start with blank);
                    <span className="badge badge-spoilers text-bg-warning ms-2">Spoilers possible</span>
                    {/* <b className='ms-2'>Edit raw</b> – <kbd>Ctrl</kbd> + <kbd>V</kbd> lives here */}
                    <b className='ms-2'>Edit raw text</b> – <code>Ctrl + V</code> lives here
                    <span className="badge badge-spoilers text-bg-warning ms-2">Spoilers master</span>
                </p>
                <p id="download-samples">
                    Download samples: (TODO:)
                </p>
            </div>
            <div className="card-body bg-white" style={{borderRadius: "0px 0px var(--bs-card-border-radius) var(--bs-card-border-radius) "}}>
                <div className="hstack gap-3">
                    <div className="btn-group" role="group" aria-label="Input mode">
                        <button type="button" className="btn btn-outline-primary">Mockup</button>
                        <button type="button" className="btn btn-outline-primary">Upload</button>
                        <button type="button" className="btn btn-outline-primary" id="button-edit">Edit</button>
                        <button type="button" className="btn btn-outline-primary" id="button-raw">Raw</button>
                    </div>
                    <div className="vr"></div>
                    <button type="button" className="btn btn-outline-primary" disabled>Download</button>
                    <button type="button" className="btn btn-outline-primary" disabled>Clear</button>
                    <button type="button" className="btn btn-primary" disabled>Use</button>
                    { 
                        nothing
                            ? <>Waiting for dataset</>
                            : "TODO: ??"
                    }
                    <div className="vr"></div>
                    <button type="button" className="btn btn-primary" disabled>Play</button>
                    { 
                        nothing
                            ? <>Use dataset first</>
                            : launchStore.elementsParseError
                                ? <>Parsing error</>
                                : launchStore.elementsLogicErrors.length
                                    ? <>Logical errors</>
                                    : ""
                    }
                </div>
            </div>
        </div>
    </>;
});

const LauncherElementsParseOk = observer(({launchStore}: {launchStore: LaunchStore}) => {
    const rootElements = launchStore.elementsParsed.filter(v => v.parentIds.length === 0);
    const rootElementsIds = rootElements.map(v => v.id);
    const rootElementsIdsHash = Md5.hashStr(rootElementsIds.join(','));
    return <>
        <p>
            CSV table is parsed correctly. 
        </p>
        <p>
            {
                launchStore.elementsLogicErrors.length
                    ? <>Unfortunately, we found <a href="#logical-errors" className='text-danger'>logical errors</a>. Please, fix them all.</>
                    : <>It's ok to break icons checker and start play. </>
            }
        </p>
        <p className='mb-1'>
            Found <b>{rootElements.length} root elements</b>. Root elements have empty <code>parentIds</code>, so discovered by default. 
        </p>
        <p className='mb-1'>
            Their <code>id</code>s:
            {' '}
            <Disclaimer>
                {rootElementsIds.map((id, i) => <span key={i+','+id}>
                    { i!==0 && <span style={{opacity:"0.5"}}>,</span>}
                    <span style={{opacity:"0.5"}}>{' #'}</span>
                    <span className='copy-able '>
                        <span className='copy-hover'>{id}</span>
                        <CopyButton height={18} />
                    </span>
                </span>)}
            </Disclaimer>
        </p>
        <p>Their hash:{' '}
        <code style={{display: "inline", color: "inherit"}}>
            <b>{rootElementsIdsHash.slice(0,3)}</b>
            <span className='opacity-50'>{rootElementsIdsHash.slice(3, -3)}</span>
            <b>{rootElementsIdsHash.slice(-3)}</b>
        </code>
        {' '}<i className='opacity-50'>(should be stable from version to version; if the data has not changed)</i>
        </p>
    </>
});

const LauncherElementsParseError = observer(({launchStore}: {launchStore: LaunchStore}) => {
    const er = launchStore.elementsParseError;
    if (!er) return null;
    return <>
        <p>
            CSV table is&nbsp;malformed. 
            You&nbsp;may&nbsp;have missed a&nbsp;tab, comma, or&nbsp;quotation&nbsp;mark.
            Or&nbsp;use "MDicon" instead of&nbsp;"mdIcon".
            Or&nbsp;something like&nbsp;that.
        </p>
        <p>
            Try to <a href="#download-samples">download a valid example</a>. For modify the CSV use "LibreOffice Calc", or any online spreadsheet editor.
        </p>
        <p>
            <b className='text-danger'>{er.name}</b>
            { er.message && <><br /><span className='text-danger-emphasis'>{er.message}</span></> }
        </p>
        <p>
            <b className='parse-error-stack-header '>Stack</b><br />
            {/* <span className='parse-error-stack text-info'> */}
            <span className='parse-error-stack'>
                <CopyButton height={40} />
                <pre>{er.stack || `No stack provided`}</pre>
            </span>
        </p>
    </>
});

const LauncherElementsParsingNothingToParse = observer(() => {
    return <>
        <p>Nothing to parse.</p>
        <p>Use predefined dataset (mockup), or put your own CSV file.</p>
        <p>You can find the <a href="#data-section">data section</a> above.</p>
    </>
});

const LauncherElementsParsing = observer(({launchStore}: {launchStore: LaunchStore}) => {
    const nothing = launchStore.elementsStartAt === null;
    const error = !nothing && launchStore.elementsParseError !== null;
    const state = nothing ? "nothing" : error ? "error" : "ok";
    return <>
        <div className={`card card-state-${state}`} id="parsing">
            <div className="card-header ">
                <h4>
                { state === "nothing" && "Parsing" }
                { state === "error" && <>
                    <InHeaderErrorIcon />
                    Parsing error
                </>
                }
                { state === "ok" && <>
                    <div className="hstack gap-3">
                    Parsed
                    <div className="vr"></div>
                    <small className="fw-lighter text-body-secondary mr-3">
                        {launchStore.elementsParsingDurationMS.toFixed(4)}ms
                    </small>
                    <small className="fw-lighter text-body-secondary">
                        {launchStore.elementsParsed.length} elements
                    </small>
                    </div>
                </>
                }
                </h4>
            </div>
            <div className="card-body ">
                { state === "nothing" && <LauncherElementsParsingNothingToParse key="parse-nothing" /> }
                { state === "error" && <LauncherElementsParseError key="parse-er" launchStore={launchStore} /> }
                { state === "ok" && <LauncherElementsParseOk key="parse-ok" launchStore={launchStore} /> }
            </div>
        </div>
    </>;
});

const LauncherElementsLogicError = observer(({er, showElementId, showRelatedIds}: {er: TError, showElementId: boolean, showRelatedIds: boolean}) => {
    return <li className='error'>
        <span className='error-name'>{er.er}</span>
        <span className='error-punctuation'>{': '}</span>
        <span className='error-words'>at</span>
        <span className='error-punctuation'>{' #'}</span>
        <Disclaimer forceOpened={showElementId}>
            <b className='copy-able element-id' tabIndex={1}>
                <span className='copy-hover'>{er.id}</span>
                <CopyButton height={18} />
            </b>
        </Disclaimer>
        {
            er.ids?.length 
                ? 
                    <>
                        <span className='error-punctuation'>{', '}</span>
                        <span className='error-words'>related ids</span>
                        <span className='error-punctuation'>{': '}</span>
                        <Disclaimer forceOpened={showRelatedIds}>
                            {er.ids.map((id, i) => <span key={i+','+id}>
                                { i!==0 && <span className='error-punctuation'>,</span>}
                                <span className='error-punctuation'>{' #'}</span>
                                <b className='copy-able element-id element-id-related'>
                                    <span className='copy-hover'>{id}</span>
                                    <CopyButton height={18} />
                                </b>
                            </span>)}
                        </Disclaimer>
                    </> 
                : null
        }
    </li>;
});

const EnvBroken = observer(()=>{
    return <>
        <p>
            <b>NOTE: </b>
            <code className='text-danger'>Env is broken</code>, so the app use default values.{' '}
            {' '}<a href='https://github.com/oven-sh/bun/issues/9877' target='_blank'>WTF?</a>{' '}
            Doesn't matter because of default values is hardcoded.
        </p>
    </>
})

const LauncherElements = observer(({launchStore}: {launchStore: LaunchStore}) => {
    const [showElementId, setShowElementId] = useState<boolean>(false);
    const [showRelatedIds, setShowRelatedIds] = useState<boolean>(false);
    
    return <>
        <div>
            <LauncherElementsInput launchStore={launchStore} />
            <LauncherElementsParsing launchStore={launchStore} />
            <hr />
            <div className="form-check">
                <label className="form-check-label">
                    <input className='form-check-input' type='checkbox' checked={showElementId} onChange={() => setShowElementId(!showElementId) } />
                    Show element id
                    {' '}
                    <span className='badge text-bg-info'>possible, disclaimer</span>
                </label>
            </div>
            <div className="form-check">
                <label className="form-check-label">
                    <input className='form-check-input' type='checkbox' checked={showRelatedIds} onChange={() => setShowRelatedIds(!showRelatedIds) } />
                    Show related ids 
                    {' '}
                    <span className='badge text-bg-danger'>disclaimer</span>
                </label>
            </div>
            <ul>
                { launchStore.elementsLogicErrors.map(v => <LauncherElementsLogicError key={v.i} er={v} showElementId={showElementId} showRelatedIds={showRelatedIds} />)}
            </ul>
        </div>
        <code><pre>
            {JSON.stringify(launchStore, null, 4)}
        </pre></code>
    </>
});

const Launcher = observer(() => {
    const rootStore = useContext<RootStore>(StoreContext);
    const onStartClick = () => {
        try {
            rootStore.launchStore.start();
            // NOTE: toast здесь только испортит впечатление от начала игры (даже если впечатление нулевое)
        } catch(_er) {
            const er = _er as Error;
            rootStore.launchStore.toastError(er.message || er.name);
        }
    };
    return <>
        <div className='launcher'>
            <div className="container">
                <LauncherH1 launchStore={toJS(rootStore.launchStore)} onClickStart={onStartClick} />
                { envBroken && <EnvBroken /> }
                <LauncherElements launchStore={toJS(rootStore.launchStore)} />
            </div>
            <ToastContainer 
                position="bottom-right"
                theme="colored"
                pauseOnHover
            />
        </div>
    </>
});

export default Launcher;