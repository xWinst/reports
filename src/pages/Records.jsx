import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, MultiSelect, Record, Select, Modal, DateForm, Menu } from 'components';
import { clear } from 'state/database';
import s from './pages.module.css';

const Records = () => {
    const { records, frequencies } = useSelector(state => state.database);
    const date = useSelector(state => state.date.date);
    console.log('date: ', date.toLocaleString());
    const shift = useSelector(state => state.date.shift);
    const [checkedRecords, setCheckedRecords] = useState(records.map(() => false));
    // console.log('records: ', records);
    const [isExpand, setIsExpand] = useState(false);

    const [visibleList, setVisibleList] = useState(records);

    const [frequency, setFrequency] = useState('Всі');
    const [location, setLocation] = useState('Всі');
    const [checkedLocations, setCheckedLocations] = useState([]);
    const [subdivision, setSubdivision] = useState('Всі');
    const [isAction, setIsAction] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [resultRep, setResultRep] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        let list = [...records];
        if (frequency !== 'Всі') list = list.filter(record => record.frequency === frequency);
        if (location !== 'Всі') {
            list = list.filter(record => checkedLocations.includes(record.location));
        }
        if (subdivision !== 'Всі') list = list.filter(record => record.subdivision === subdivision);
        if (isAction) list = list.filter(record => record.action !== undefined);
        setVisibleList(list);
    }, [frequency, location, checkedLocations, subdivision, isAction, records]);

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
        const fileName = `${date}${shift === 'Денна' ? '_d' : '_n'}.json`;
        console.log('fileName: ', fileName);
        a.download = fileName;
        a.click();
        a.remove();

        dispatch(clear());
    };

    const checkLocation = checkedList => {
        console.log('WARNING!!!!');
        if (checkedList[0]) setLocation('Всі');
        else setLocation('Обрані');

        setCheckedLocations(getList('location').filter((loc, i) => checkedList[i]));
    };

    const onCheck = id => {
        const prev = [...checkedRecords];
        console.log('prev: ', prev);
        const index = records.findIndex(record => record.id === id);
        prev[index] = !prev[index];
        setCheckedRecords(prev);
    };

    const createReport = () => {
        const choosenRecords = records.filter((_, i) => checkedRecords[i]);

        const subdivs = choosenRecords
            .map(record => record.subdivision)
            .filter((el, ind, arr) => ind === arr.indexOf(el));
        const locs = choosenRecords
            .map(record => record.location)
            .filter((el, ind, arr) => ind === arr.indexOf(el));

        const text = choosenRecords.map(record => record.time + '\n' + record.text);

        const result =
            'Локація:\n' +
            locs.join(', ') +
            '\n\nПідрозділ:\n' +
            subdivs.join(', ') +
            '\n\n' +
            text.join('\n\n');

        setShowModal(true);
        setResultRep(result);
    };

    return (
        <>
            <div className={s.box}>
                <DateForm />
                <Menu />
            </div>
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
                    <MultiSelect
                        list={getList('location')}
                        onSelect={checkLocation}
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
            <div className={s.btnBox}>
                <Button text={isExpand ? 'Згорнути все' : 'Розгорнути все'} click={toggleExpand} />
                <Button text="Зробити виборку" click={createReport} />
            </div>
            <ul className={s.list}>
                {visibleList.map((record, i) => (
                    <Record
                        key={record.id}
                        record={record}
                        isExpand={isExpand}
                        onCheck={onCheck}
                        isChecked={checkedRecords[i]}
                    />
                ))}
            </ul>
            <Button text="Зберегти БД" click={save} />
            {showModal && (
                <Modal close={() => setShowModal(false)}>
                    <textarea className={s.report} value={resultRep} />
                </Modal>
            )}
        </>
    );
};

export default Records;
