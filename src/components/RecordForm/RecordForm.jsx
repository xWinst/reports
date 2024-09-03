import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { Button, Icon } from 'components';
import { addRecord, setFrequencies } from 'state/database';
import s from './RecordForm.module.css';

// const saved = {frequency = []};
const RecordForm = () => {
    const { frequencies } = useSelector(state => state.database);
    const [record, setRecord] = useState({});
    const [saved, setSaved] = useState({});
    const [callsign, setCallsign] = useState('');
    const [other, setOther] = useState([]);
    const [knownCallsigns, setKnownCallsigns] = useState([]);

    const dispatch = useDispatch();

    const copyTetx = useRef();

    const save = () => {
        // const data = JSON.stringify(record);
        // localStorage.setItem('record', data);

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

        setRecord({});

        console.log('copyTetx: ', copyTetx);
        // const a = document.createElement('a');
        // const file = new Blob([data], {
        //     type: 'plain/text',
        // });
        // a.href = URL.createObjectURL(file);
        // console.log('file: ', file);
        // console.log('a.href: ', a);
        // a.download = 'lights.json';
        // a.click();
        // a.remove();
    };

    const sendRecord = () => {
        dispatch(addRecord({ ...record, id: nanoid() }));

        save();
    };

    const setData = event => {
        const { name, value } = event.target;
        if (name === 'frequency') {
            const knownFrequency = frequencies.find(item => item.value === value);
            if (knownFrequency) {
                setKnownCallsigns(knownFrequency.nickNames || []);
                const subdivision = knownFrequency.currentSubdivision;
                const location = knownFrequency.currentLocation;
                setRecord(prev => ({ ...prev, [name]: value, location, subdivision }));
                return;
            }
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
        console.log('name: ', name);
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
                        type="number"
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
                <textarea className={s.copyMessage} ref={copyTetx} />
            </label>
        </form>
    );
};

export default RecordForm;
