import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Record, Select } from 'components';
import { clear } from 'state/database';
import s from './pages.module.css';

const Records = () => {
    const { records, frequencies } = useSelector(state => state.database);
    // console.log('records: ', records);
    const [isExpand, setIsExpand] = useState(false);

    const [visibleList, setVisibleList] = useState(records);

    const [frequency, setFrequency] = useState('Всі');
    const [location, setLocation] = useState('Всі');
    const [subdivision, setSubdivision] = useState('Всі');
    const [isAction, setIsAction] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        let list = [...records];
        if (frequency !== 'Всі') list = list.filter(record => record.frequency === frequency);
        if (location !== 'Всі') list = list.filter(record => record.location === location);
        if (subdivision !== 'Всі') list = list.filter(record => record.subdivision === subdivision);
        if (isAction) list = list.filter(record => record.action !== undefined);
        setVisibleList(list);
    }, [frequency, location, subdivision, isAction, records]);

    const getList = type => {
        const result = records.map(record => record[type]);
        result.unshift('Всі');
        return result.filter((el, ind) => ind === result.indexOf(el));
    };

    const setAction = value => {
        if (value === 'Всі') setIsAction(false);
        else setIsAction(true);
    };

    const toggleExpand = () => {
        setIsExpand(prev => !prev);
    };

    const save = () => {
        const data = JSON.stringify({ records, frequencies });
        const a = document.createElement('a');
        const file = new Blob([data], {
            type: 'plain/text',
        });
        a.href = URL.createObjectURL(file);
        a.download = 'db.json';
        a.click();
        a.remove();

        dispatch(clear());
    };

    return (
        <>
            <p>Фільтри:</p>
            <div className={s.box}>
                <div className={s.fff}>
                    <p>Частота</p>
                    <Select
                        list={getList('frequency')}
                        onSelect={setFrequency}
                        value={frequency}
                        name="frequency"
                    />
                </div>
                <div>
                    <p>Район</p>
                    <Select
                        list={getList('location')}
                        onSelect={setLocation}
                        value={location}
                        name="location"
                    />
                </div>
                <div>
                    <p>Підрозділ</p>
                    <Select
                        list={getList('subdivision')}
                        onSelect={setSubdivision}
                        value={subdivision}
                        name="subdivision"
                    />
                </div>
                <div>
                    <p>Подія</p>
                    <Select
                        list={['Всі', 'Тільки відмічені']}
                        onSelect={setAction}
                        value={isAction ? 'Тільки відмічені' : 'Всі'}
                        name="action"
                    />
                </div>
            </div>
            <Button text={isExpand ? 'Згорнути все' : 'Розгорнути все'} click={toggleExpand} />
            <ul className={s.list}>
                {visibleList.map(record => (
                    <Record key={record.id} record={record} isExpand={isExpand} />
                ))}
            </ul>
            <Button text="Зберегти БД" click={save} />
        </>
    );
};

export default Records;
