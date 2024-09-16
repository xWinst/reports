import { createPortal } from 'react-dom';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal');

const Modal = ({ close, st = {}, children }) => {
    return createPortal(
        <div className={s.overlay}>
            <div className={s.modal} style={st}>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
