import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { Button, Icon } from 'components';
import { addRecord, setFrequencies } from 'state/database';
import s from './RecordForm.module.css';

const emptyRecord = {
    time: '',
    frequency: '',
    location: '',
    subdivision: '',
    asker: '',
    answerer: '',
    text: '',
    action: '',
};

// const saved = {frequency = []};
const RecordForm = () => {
    const { frequencies } = useSelector(state => state.database);
    const [record, setRecord] = useState(emptyRecord);
    const [saved, setSaved] = useState({});
    const [callsign, setCallsign] = useState('');
    const [other, setOther] = useState([]);
    const [knownCallsigns, setKnownCallsigns] = useState([]);

    const dispatch = useDispatch();

    const copyText = useRef();

    const save = () => {
        let subdivisionsList = frequencies.flatMap(({ subdivisions }) => subdivisions);
        subdivisionsList.push(record.subdivision);
        subdivisionsList = subdivisionsList.filter((el, ind, arr) => ind === arr.indexOf(el));
        let locationsList = frequencies.flatMap(({ locations }) => locations);
        locationsList.push(record.location);
        locationsList = locationsList.filter((el, ind, arr) => ind === arr.indexOf(el));

        const newFrequencie = {
            value: record.frequency,
            nickNames: [...knownCallsigns],
            currentSubdivision: record.subdivision,
            subdivisions: subdivisionsList,
            currentLocation: record.location,
            locations: locationsList,
        };

        const newFrequencieList = frequencies.filter(({ value }) => value !== record.frequency);
        newFrequencieList.push(newFrequencie);
        dispatch(setFrequencies(newFrequencieList));

        setRecord(emptyRecord);
        setCallsign('');
        setOther([]);

        copyText.current.value = '';
    };

    const sendRecord = () => {
        dispatch(addRecord({ ...record, id: nanoid() }));

        save();
    };

    const setData = event => {
        let { name, value } = event.target;
        console.log('value: ', value);
        if (name === 'frequency') {
            console.log('Bingo!');
            value = parseFloat(value);
            console.log('value: ', value);
            if (!value) value = '';
            const knownFrequency = frequencies.find(item => item.value === value);
            if (knownFrequency) {
                setKnownCallsigns(knownFrequency.nickNames || []);
                const subdivision = knownFrequency.currentSubdivision;
                const location = knownFrequency.currentLocation;
                setRecord(prev => ({ ...prev, value, location, subdivision }));
                return;
            }
        }

        // if (name === 'location') {
        //     const knownLocation = locations.find(item => item.value === value);
        //     if (knownLocation) {
        //     }
        // }
        console.log('value2: ', value);
        setRecord(prev => ({ ...prev, [name]: value }));
    };

    const saveData = e => {
        const { name, value } = e.target;
        // console.log('name: ', name);
        let arr = saved[name] ? [...saved[name]] : [];
        arr.push(value);
        arr = arr.filter((el, ind) => ind === arr.indexOf(el));
        setSaved(prev => ({ ...prev, [name]: arr }));
    };

    const addCallsigns = e => {
        const { value } = e.target;
        // console.log('e', e.target.value);
        // console.log(' other.includes(value)', knownCallsigns.includes(value));
        // console.log('e.keyCode', e.keyCode);
        if (e.code === 'Enter' || knownCallsigns.includes(value)) {
            let arr = [...other];
            let arr2 = [...knownCallsigns];
            arr.push(value);
            arr2.push(value);
            arr = arr.filter((el, ind) => ind === arr.indexOf(el));
            arr2 = arr2.filter((el, ind) => ind === arr2.indexOf(el));
            setCallsign('');
            setOther(arr);
            setRecord(prev => ({ ...prev, other: arr }));
            setKnownCallsigns(arr2);
        } else setCallsign(value);
    };

    const addKnownNick = e => {
        const { value } = e.target;
        console.log('e', e.target.value);
        let arr2 = [...knownCallsigns];
        arr2.push(value);
        arr2 = arr2.filter((el, ind) => ind === arr2.indexOf(el));
        setKnownCallsigns(arr2);
    };

    const delNickName = name => {
        setOther(other.filter(nickName => nickName !== name));
    };

    const parseData = e => {
        const data = e.target.value;
        if (data.includes('Локація')) {
            const timeStartIdx = data.indexOf('Час:');
            const timeEndIdx = data.indexOf(';', timeStartIdx);

            const freStartIdx = data.indexOf('Частота:');
            const freEndIdx = data.indexOf(';', freStartIdx);

            const locStartIdx = data.indexOf('Локація:');
            const locEndIdx = data.indexOf(';', locStartIdx);

            const subDivStartIdx = data.indexOf('Підрозділ:');
            const subDivEndIdx = data.indexOf(';', subDivStartIdx);

            const askerStartIdx = data.indexOf('Хто:');
            const askerEndIdx = data.indexOf(';', askerStartIdx);
            const answererStartIdx = data.indexOf('Кому:');
            const answererEndIdx = data.indexOf(';', answererStartIdx);
            const textStartIdx = data.indexOf('Текст:');

            const time = data.slice(timeStartIdx + 5, timeEndIdx);
            const frequency = data.slice(freStartIdx + 9, freEndIdx);
            const location = data.slice(locStartIdx + 9, locEndIdx);
            const subdivision = data.slice(subDivStartIdx + 11, subDivEndIdx);
            const asker = data.slice(askerStartIdx + 5, askerEndIdx);
            const answerer = data.slice(answererStartIdx + 6, answererEndIdx);
            const text = data.slice(textStartIdx + 6);

            setRecord(prev => ({
                ...prev,
                time,
                frequency,
                location,
                subdivision,
                asker,
                answerer,
                text,
            }));
        } else {
            const rows = data.split('\n');
            if (rows[0][9] === ':' && rows[0][12] === ':') {
                const time = data.slice(7, 15);
                const frequency = rows[1];

                const asker = rows[3] === 'НВ' ? '' : rows[3];
                const answerer = rows[4] === 'НВ' ? '' : rows[4];

                const text = rows.slice(6).join('\n');

                setRecord(prev => ({
                    ...prev,
                    time,
                    frequency,
                    // location,
                    // subdivision,
                    asker,
                    answerer,
                    text,
                }));
            }
        }
    };

    return (
        <form className={s.form} onSubmit={sendRecord}>
            <div className={s.box}>
                <label className={s.label}>
                    <span className={s.title}>Час</span>
                    <input
                        // className="pl-4"
                        type="text"
                        value={record.time}
                        onChange={setData}
                        name="time"
                    />
                </label>
                <label className={s.label}>
                    <span className={s.title}>Частота</span>
                    <input
                        list="frequency"
                        type="text"
                        value={record.frequency}
                        onChange={setData}
                        onBlur={saveData}
                        name="frequency"
                    />
                    <datalist id="frequency">
                        {saved.frequency && saved.frequency.map(f => <option key={f} value={f} />)}
                    </datalist>
                </label>
                <label className={s.label}>
                    <span className={s.title}>Район</span>
                    <input
                        type="text"
                        value={record.location}
                        onChange={setData}
                        onBlur={saveData}
                        name="location"
                    />
                </label>
                <label className={s.label}>
                    <span className={s.title}>Підрозділ</span>
                    <input
                        type="text"
                        value={record.subdivision}
                        onChange={setData}
                        onBlur={saveData}
                        name="subdivision"
                    />
                </label>
            </div>
            <div>
                <label className={s.label}>
                    <span className={s.title}>Хто викликае</span>
                    <input
                        list="callsigns"
                        type="text"
                        value={record.asker}
                        onChange={setData}
                        onBlur={addKnownNick}
                        name="asker"
                    />
                </label>
                <label className={s.label}>
                    <span className={s.title}>Кого викликають</span>
                    <input
                        list="callsigns"
                        type="text"
                        value={record.answerer}
                        onChange={setData}
                        onBlur={addKnownNick}
                        name="answerer"
                    />
                </label>
                <label className={s.label}>
                    <span className={s.title}>Згадані позивні</span>
                    <input
                        list="callsigns"
                        type="text"
                        value={callsign}
                        onChange={addCallsigns}
                        onKeyDown={addCallsigns}
                        name="another"
                    />
                    <datalist id="callsigns">
                        {knownCallsigns.map(el => (
                            <option key={el} value={el} />
                        ))}
                    </datalist>
                </label>
            </div>
            <div className={s.listBox}>
                <span className={s.title2}>Перелік згаданих позивних</span>
                <ul className={s.list}>
                    {other.map(nikname => (
                        <li key={nikname} className={s.item}>
                            <p>{nikname}</p>
                            <Icon
                                icon="close"
                                w={14}
                                cn={s.icon}
                                click={() => {
                                    delNickName(nikname);
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <label className={s.label}>
                <span className={s.title}>Текст</span>
                <textarea
                    className={s.message}
                    value={record.text}
                    onChange={setData}
                    name="text"
                />
            </label>

            <label className={s.label}>
                <span className={s.title}>Подія</span>
                <input
                    className={s.message}
                    type="text"
                    value={record.action}
                    onChange={setData}
                    name="action"
                />
            </label>

            <Button text="Додати запис" click={sendRecord} />

            <label className={s.label}>
                <span className={s.title}>Копія повідомлення</span>
                <textarea className={s.copyMessage} ref={copyText} onChange={parseData} />
            </label>
        </form>
    );
};

export default RecordForm;
