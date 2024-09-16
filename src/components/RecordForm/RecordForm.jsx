import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { Button, Icon } from 'components';
import { addRecord, setFrequencies, setLocations, setSubdivisions } from 'state/database';
import message from 'helpers/Message';
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
    const { frequencies, locations, subdivisions } = useSelector(state => state.database);
    const [record, setRecord] = useState(emptyRecord);
    const [saved, setSaved] = useState({});
    const [callsign, setCallsign] = useState('');
    const [other, setOther] = useState([]);
    const [knownCallsigns, setKnownCallsigns] = useState([]);

    const dispatch = useDispatch();
    const copyText = useRef();

    useEffect(() => {}, []);

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

        let locationUnitList = locations.flatMap(({ subdivisions }) => subdivisions);
        locationUnitList.push(record.subdivision);
        locationUnitList = locationUnitList.filter((el, ind, arr) => ind === arr.indexOf(el));

        let wavetList = locations.flatMap(({ waves }) => waves);
        wavetList.push(record.frequency);
        wavetList = wavetList.filter((el, ind, arr) => ind === arr.indexOf(el));

        const newLocation = {
            loc: record.location,
            subdivisions: locationUnitList,
            waves: wavetList,
        };

        let unitlocationsList = subdivisions.flatMap(({ locations }) => locations);
        unitlocationsList.push(record.location);
        unitlocationsList = unitlocationsList.filter((el, ind, arr) => ind === arr.indexOf(el));

        let unitWavetList = subdivisions.flatMap(({ waves }) => waves);
        unitWavetList.push(record.frequency);
        unitWavetList = unitWavetList.filter((el, ind, arr) => ind === arr.indexOf(el));

        const newUnit = {
            unit: record.subdivision,
            locations: unitlocationsList,
            waves: unitWavetList,
        };

        const newFrequencieList = frequencies.filter(({ value }) => value !== record.frequency);
        newFrequencieList.push(newFrequencie);
        dispatch(setFrequencies(newFrequencieList));

        const newLocationsList = locations.filter(({ loc }) => loc !== record.location);
        newLocationsList.push(newLocation);
        dispatch(setLocations(newLocationsList));

        const newUnitsList = subdivisions.filter(({ unit }) => unit !== record.subdivision);
        newUnitsList.push(newUnit);
        dispatch(setSubdivisions(newUnitsList));

        setRecord(emptyRecord);
        setCallsign('');
        setOther([]);

        copyText.current.value = '';
    };

    const sendRecord = () => {
        dispatch(addRecord({ ...record, id: nanoid() }));

        save();

        message.sucsess('Запис додано');
    };

    const setData = event => {
        let { name, value } = event.target;
        // console.log('value: ', value);
        if (name === 'frequency') {
            // console.log('Bingo!');
            value = parseFloat(value);
            // console.log('value: ', value);
            if (!value) value = '';
            const knownFrequency = frequencies.find(item => item.value === value);
            if (knownFrequency) {
                setKnownCallsigns(knownFrequency.nickNames || []);
                const subdivision = knownFrequency.currentSubdivision;
                const location = knownFrequency.currentLocation;
                console.log('value: SET ', value);
                setRecord(prev => ({ ...prev, frequency: value, location, subdivision }));
                return;
            }
        } else value = value.toLowerCase();

        if (name === 'text') {
        }

        // if (name === 'location') {
        //     const knownLocation = locations.find(item => item.value === value);
        //     if (knownLocation) {
        //     }
        // }

        setRecord(prev => ({ ...prev, [name]: value }));
    };

    const saveData = e => {
        const { name, value } = e.target;
        console.log('value: ', value);
        // console.log('name: ', name);
        let arr = saved[name] ? [...saved[name]] : [];
        arr.push(value);
        arr = arr.filter((el, ind) => ind === arr.indexOf(el));
        setSaved(prev => ({ ...prev, [name]: arr }));
    };

    const addCallsigns = e => {
        // console.log('e: ', e);
        let { value } = e.target;
        console.log('value: ', value);
        value = value.toLowerCase();
        // if (value.includes(',')) {
        //     return;
        // }
        if (e.code === 'Enter' || value.includes(',')) {
            let arr = [...other];
            let arr2 = [...knownCallsigns];
            console.log('value.split[', ']: ', value.split(','));
            value = value
                .split(',')
                .map(el => el.trim())
                .filter(el => el);
            if (value) arr.push(...value);
            arr2.push(...value);
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
        let arr2 = [...knownCallsigns];
        arr2.push(value.toLowerCase());
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
            const frequency = parseFloat(data.slice(freStartIdx + 9, freEndIdx));
            const location = data.slice(locStartIdx + 9, locEndIdx).toLowerCase();
            const subdivision = data.slice(subDivStartIdx + 11, subDivEndIdx).toLowerCase();
            const asker = data.slice(askerStartIdx + 5, askerEndIdx).toLowerCase();
            const answerer = data.slice(answererStartIdx + 6, answererEndIdx).toLowerCase();
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

                const asker = rows[3] === 'НВ' ? '' : rows[3].toLowerCase();
                const answerer = rows[4] === 'НВ' ? '' : rows[4].toLowerCase();

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

    const getStyle = () => {
        if (record.text) {
            const rows = record.text.split('\n').length;

            return { width: '100%', minHeight: '40px', height: `${rows * 16}px ` };
        } else return { width: '100%' };
    };

    return (
        <form className={s.form} onSubmit={sendRecord}>
            <div className={s.box}>
                <label className={s.label}>
                    <span className={s.title}>Час</span>
                    <input
                        className={s.time}
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
                        className={s.time}
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
                        className={s.loc}
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
                        autoComplete="off"
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
                        autoComplete="off"
                    />
                </label>
                <div className={s.multiInputBox}>
                    <span className={s.title}>Згадані позивні</span>
                    <ul className={s.list}>
                        {other.map(nikname => (
                            <li key={nikname} className={s.item}>
                                <p>{nikname}</p>
                                <Icon
                                    icon="close"
                                    w={14}
                                    cn={s.icon}
                                    click={() => delNickName(nikname)}
                                />
                            </li>
                        ))}
                        <label className={s.label}>
                            <input
                                list="callsigns"
                                type="text"
                                value={callsign}
                                onChange={addCallsigns}
                                onKeyDown={addCallsigns}
                                name="another"
                                autoComplete="off"
                            />
                            <datalist id="callsigns">
                                {knownCallsigns.map(el => (
                                    <option key={el} value={el} />
                                ))}
                            </datalist>
                        </label>
                    </ul>
                </div>
            </div>
            <label className={s.label}>
                <span className={s.title}>Текст</span>
                <textarea style={getStyle()} value={record.text} onChange={setData} name="text" />
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
