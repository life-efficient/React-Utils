/* eslint-disable camelcase */
import { DialogProps } from '@material-ui/core';

interface IModalAction extends Partial<DialogProps> {
    type?: EModalActions;
}

enum EModalActions {
    muiOPEN_MODAL = 'muiOPEN_MODAL',
    muiCLOSE_MODAL = 'muiCLOSE_MODAL',
}

const closedState: DialogProps = {
    open: false,
    children: null,
};

const muiModal = (state: DialogProps = { open: false }, action: IModalAction) => {
    const newState = { ...action };
    switch (action.type) {
        case 'muiOPEN_MODAL':
            delete newState.type;
            return { open: true, ...newState };
        case 'muiCLOSE_MODAL':
            return closedState;
        default:
            return state;
    }
};

export default muiModal;
