import { useEffect, useState } from 'react';
import { Icon } from 'components';
import s from './Record.module.css';

const Record = ({ record, isExpand }) => {
    // const [showForm, setShowForm] = useState(false);
    const [isExpanded, setIsExpanded] = useState(isExpand);
    const { time, frequency, location, subdivision, action, text } = record;

    useEffect(() => {
        setIsExpanded(isExpand);
    }, [isExpand]);

    return (
        <li className={s.record}>
            <div className={s.dscr}>
                <p className={s.time}>{time}</p>
                <p className={s.frequency}>{frequency}</p>
                <p className={s.location}>{location}</p>
                <p className={s.subdivision}>{subdivision}</p>
                <p className={s.action}>{action}</p>
                <Icon
                    icon={isExpanded ? 'collaps' : 'expand'}
                    w={20}
                    click={() => setIsExpanded(prev => !prev)}
                />
            </div>

            {isExpanded && (
                <>
                    <textarea disabled value={text} />
                </>
            )}
        </li>
    );
};

export default Record;
