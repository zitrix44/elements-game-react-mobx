import { toast } from 'react-toastify';
import { RootStore } from "./RootStore";
import { toastInfo, toastError } from '../utils/toasts';

type TcopyTextOptionsFormat = {
    trim: boolean;
    pre: boolean;
};
type TcopyTextOptionsBehaviour = {
    showOkToast: boolean;
    showErToast: boolean;
    throwEmptyText: boolean;
};
type TcopyTextOptionsContext = {
    node?: HTMLUnknownElement;
    copyParentNodeTextContent?: boolean;
};
type TcopyTextOptions = TcopyTextOptionsFormat & TcopyTextOptionsBehaviour & TcopyTextOptionsContext;

const copyTextOptions: TcopyTextOptions = {
    trim: true,
    pre: false,
    showOkToast: true,
    showErToast: true,
    throwEmptyText: false,
    node: undefined,
    copyParentNodeTextContent: undefined,
}

export default class RootStoreUtils {
    #rootStore: RootStore;

    copyTextOptions = copyTextOptions;
    
    constructor(rootStore: RootStore) {
        this.#rootStore = rootStore;
        this.copyByClick = this.copyByClick.bind(this);
    }

    toastInfo(msg: string) {
        toastInfo(msg);
    }

    toastError(msg: string) {
        toastError(msg);
    }

    copyByClick(e: React.MouseEvent<HTMLUnknownElement, MouseEvent>, options?: Partial<TcopyTextOptions>): true | string {
        const reqOpts = {
            node: e.target, 
            copyParentNodeTextContent: true
        };
        const opt = Object.assign({}, reqOpts, options || {});
        return this.copyText(null, opt);
    }

    copyText(text: string | null, options: Partial<TcopyTextOptions> = {}): true | string {
        let ret: boolean | string = false;
        const opt = Object.assign({}, this.copyTextOptions, options);
        try {
            ret = this.#copyText(text, opt);
        } catch(_er) {
            console.error(_er);
            const er = _er as Error;
            return this.#copyTextThrow(`${er.name}: ${er.message}`, opt);
        }
        return ret;
    }
    #copyText(text: string | null, opt: TcopyTextOptions): true | string {
        let txt = text === 'string' ? text : this.#copyTextExtract(opt);
        txt = this.#copyTextFormat(txt, opt);
        if (!txt.length) {
            throw new Error(`Can't copy empty string`);
        }
        this.#copyTextExecute(txt);
        this.#copyTextSuccess(txt, opt);
        return true;
    }
    #copyTextExtract(options: TcopyTextOptionsContext): string {
        let target = options.node;
        if (!target) {
            throw new Error('#copyTextExtract: no options.node');
        }
        if (options.copyParentNodeTextContent) {
            if (!target.parentElement) {
                throw new Error('#copyTextExtract: no options.node.parentElement (options.copyParentNodeTextContent === true)');
            }
            target = target.parentElement;
        }
        return target?.textContent || '';
    }
    #copyTextFormat(text_: string, options: TcopyTextOptionsFormat): string {
        let text = text_;
        if (!options.pre) text = text.replace(/\s+/, ' ');
        if (options.trim) text = text.trim();
        return text;
    }
    #copyTextThrow(msg: string, options: TcopyTextOptions): string {
        if (options.showErToast) {
            this.toastError(msg);
        }
        if (options.throwEmptyText) {
            throw new Error(msg);
        }
        return msg;
    }
    #copyTextExecute(text: string) {
        navigator.clipboard.writeText(text);
    }
    #copyTextSuccess(text: string, options: TcopyTextOptions) {
        try {
            if (!options.showOkToast) return;
            this.toastInfo(`Text copied`);
        } catch(er) {
            console.warn(`#copyTextSuccess: Can't show toast (snackbar) after text is copied`, { text, options, er });
            console.error(er);
        }
    }
}