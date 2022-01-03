import { toast } from 'react-toastify';

interface Notifier {
    log(msg: string): any;
    logWarning(msg: string): any;
    logSuccess(msg: string): any;
    logError(msg: string): any;
}

export default {
    log: (msg) => toast.info(msg),
    logWarning: (msg) => toast.warning(msg),
    logSuccess: (msg) => toast.success(msg),
    logError: (msg) => toast.error(msg),
} as Notifier;