import { Icon } from 'components';
import { useState, useEffect } from 'react';
import s from './MultiSelect.module.css';

const getCheckedList = list => {
    return list.map(el => true);
};

const MultiSelect = ({ list, onSelect, value, name }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [checkedList, setCheckedList] = useState(list);

    useEffect(() => {
        const onClick = e => {
            const target = e.target.getAttribute('name');
            const parent = e.target.parentElement?.getAttribute('name');
            const grandParent = e.target.parentElement?.parentElement?.getAttribute('name');
            if (target !== name && parent !== name && grandParent !== name) setIsExpanded(false);
        };

        const onKeyDown = event => {
            // console.log('Pressed = ', event.code);
            if (event.code === 'Tab' || event.code === 'Escape') setIsExpanded(false);
        };

        // window.addEventListener('click', onClick);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            // window.removeEventListener('click', onClick);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [name]);

    useEffect(() => {
        onSelect(checkedList);
    }, [checkedList, onSelect]);

    const toggleState = () => {
        setIsExpanded(state => !state);
    };

    const check = i => {
        const prev = [...checkedList];
        prev[i] = !prev[i];
        if (i === 0) {
            prev.forEach((el, i) => {
                prev[i] = prev[0];
            });
        } else if (prev.some(el => el === false)) prev[0] = false;

        if (prev.every((el, idx) => el === true || idx === 0)) prev[0] = true;

        setCheckedList(prev);
    };

    return (
        <div className={s.container}>
            <div className={s.select} onClick={toggleState} name={name}>
                {value}
                <Icon icon={isExpanded ? 'collaps' : 'expand'} w={20} />
            </div>
            {isExpanded && (
                <ul className={s.list}>
                    {list.map((item, i) => (
                        <li
                            key={item}
                            name="item"
                            className={checkedList[i] ? s.checked : s.item}
                            onClick={() => check(i)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MultiSelect;
