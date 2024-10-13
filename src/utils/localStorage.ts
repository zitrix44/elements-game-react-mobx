import { default as CONST } from '../const';
import { toastInfo } from './toasts';

export const lsFake = !('localStorage' in globalThis);

let lsGet = (key: string): string | null => {
    return localStorage.getItem(CONST.LS_PREFIX + key);
}
let lsSet = (key: string, value: string | number): void => {
    localStorage.setItem(CONST.LS_PREFIX + key, '' + value);
}
let lsHas = (key: string): boolean => {
    return (CONST.LS_PREFIX + key) in localStorage;
};

if (lsFake) {
    console.warn('No localStoage found');
    lsGet = (_key: string): string => "";
    let toastUsed = false;
    lsSet = (_key: string, _value: any): void => {
        if (!toastUsed) {
            toastInfo(`Can't store value in localStorage; so, runtime data will be lost after page refresh`);
        }
        toastUsed = true;
    };
    lsHas = (_key: string): boolean => {
        return false;
    };
}

export { lsGet, lsSet, lsHas };

export const lsNumber = (key: string): number => {
    return parseFloat(lsGet(key) || '') || 0;
}
export const lsJSON = (key: string): any => {
    return JSON.parse(lsGet(key) || '');
}
export const lsSetJSON = (key: string, value: any): void => {
    lsSet(key, JSON.stringify(value));
}