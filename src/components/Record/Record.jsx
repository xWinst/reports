import { useEffect, useState } from 'react';
import { Icon } from 'components';
import s from './Record.module.css';

const Record = ({ record, isExpand, onCheck, isChecked }) => {
    // const [showForm, setShowForm] = useState(false);
    const [isExpanded, setIsExpanded] = useState(isExpand);
    // const [isChecked, setIsChecked] = useState(false);
    const { id, time, frequency, location, subdivision, action, text } = record;

    useEffect(() => {
        setIsExpanded(isExpand);
    }, [isExpand]);

    return (
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
                    <Icon
                        icon={isChecked ? 'ok' : 'plus'}
                        w={22}
                        // click={() => setIsChecked(prev => !prev)}
                        click={() => onCheck(id)}
                    />
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
