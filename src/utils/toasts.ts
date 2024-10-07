import { toast } from 'react-toastify';

// https://fkhadra.github.io/react-toastify/introduction/

export const toastSuccess = (msg: string) => {
    // https://fkhadra.github.io/react-toastify/introduction/
    toast.success(msg);
};

export const toastInfo = (msg: string) => {
    toast.info(msg);
};

export const toastError = (msg: string) => {
    toast.error(msg);
};