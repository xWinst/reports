import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon, RecordEditForm } from 'components';
import { deleteRecord, updateRecord } from 'state/database';
import s from './Record.module.css';

const Record = ({ record, isExpand, onCheck, isChecked }) => {
    const [isExpanded, setIsExpanded] = useState(isExpand);
    const [isEdit, setEdit] = useState(isExpand);
    const { id, time, frequency, location, subdivision, action, text } = record;

    const dispatch = useDispatch();

    // const { onCheck, remove } = actions;

    useEffect(() => {
        setIsExpanded(isExpand);
    }, [isExpand]);

    const remove = id => {
        dispatch(deleteRecord(id));
    };

    const edit = data => {
        dispatch(updateRecord({ id, data }));
        setEdit(false);
    };

    return isEdit ? (
        <RecordEditForm
            record={record}
            onSubmit={edit}
            cancel={() => {
                setEdit(false);
            }}
        />
    ) : (
        <li className={s.record}>
            <div className={s.box}>
                <div className={s.dscr}>
                    <p className={s.time}>{time}</p>
                    <p className={s.frequency}>{frequency}</p>
                    <p className={s.location}>{location}</p>
                    <p className={s.subdivision}>{subdivision}</p>
                    <p className={s.action}>{action}</p>
                </div>
                <div className={s.icons}>
                    <Icon icon="edit" w={20} click={() => setEdit(true)} />
                    <Icon icon="delete" w={20} click={() => remove(id)} />
                    <Icon icon={isChecked ? 'ok' : 'plus'} w={22} click={() => onCheck(id)} />
                    <Icon
                        icon={isExpanded ? 'collaps' : 'expand'}
                        w={20}
                        click={() => setIsExpanded(prev => !prev)}
                    />
                </div>
            </div>
            {isExpanded && <pre className={s.text}>{text}</pre>}
        </li>
    );
};

export default Record;
