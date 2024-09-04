import { createPortal } from 'react-dom';
import s from './Modal.module.css';
import { Icon } from 'components';

const modalRoot = document.querySelector('#modal');

const Modal = ({ close, st = {}, children }) => {
    return createPortal(
        <div className={s.overlay}>
            <div className={s.modal} style={st}>
                <Icon icon="close" w={18} click={close} />
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
