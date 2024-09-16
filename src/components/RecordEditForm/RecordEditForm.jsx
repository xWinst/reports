import { useState } from 'react';
import { Button } from 'components';
import s from './RecordEditForm.module.css';

const RecordEditForm = ({ record, onSubmit, cancel }) => {
    const [data, setData] = useState(record);

    const saveData = e => {
        let { name, value } = e.target;
        if (name === 'frequency') {
            value = parseFloat(value);
            if (!value) value = '';
        } else value = value.toLowerCase();
        setData(prev => ({ ...prev, [name]: value }));
    };

    const submitData = e => {
        e.preventDefault();
        onSubmit(data);
    };

    const getStyle = () => {
        if (data.text) {
            const rows = data.text.split('\n').length;

            return { width: '100%', minHeight: '40px', height: `${rows * 16}px ` };
        } else return { width: '100%' };
    };

    return (
        <form className={s.form} onSubmit={submitData}>
            <div className={s.box}>
                <label className={s.label}>
                    <span className={s.title}>Час</span>
                    <input
                        className={s.time}
                        type="text"
                        value={data.time}
                        onChange={saveData}
                        name="time"
                    />
                </label>
                <label className={s.label}>
                    <span className={s.title}>Частота</span>
                    <input
                        className={s.time}
                        type="text"
                        value={data.frequency}
                        onChange={saveData}
                        name="frequency"
                    />
                </label>
                <label className={s.label}>
                    <span className={s.title}>Район</span>
                    <input
                        className={s.loc}
                        type="text"
                        value={data.location}
                        onChange={saveData}
                        name="location"
                    />
                </label>
                <label className={s.label}>
                    <span className={s.title}>Підрозділ</span>
                    <input
                        type="text"
                        value={data.subdivision}
                        onChange={saveData}
                        name="subdivision"
                    />
                </label>
            </div>

            <label className={s.label}>
                <span className={s.title}>Текст</span>
                <textarea style={getStyle()} value={data.text} onChange={saveData} name="text" />
            </label>

            <label className={s.label}>
                <span className={s.title}>Подія</span>
                <input
                    className={s.message}
                    type="text"
                    value={data.action}
                    onChange={saveData}
                    name="action"
                />
            </label>
            <div className={s.btnBox}>
                <Button icon="ok" text="Редагувати" click={submitData} />
                <Button icon="cancel" text="Відмінити" click={cancel} />
                {/* <Icon icon="ok" w={20} click={submitData} />
                <Icon icon="cancel" w={20} click={cancel} /> */}
            </div>
        </form>
    );
};

export default RecordEditForm;
