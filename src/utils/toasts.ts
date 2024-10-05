import { toast } from 'react-toastify';

export const toastInfo = (msg: string) => {
    // https://fkhadra.github.io/react-toastify/introduction/
    toast.info(msg);
};

export const toastError = (msg: string) => {
    toast.error(msg);
};