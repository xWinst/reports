import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Icon, Select } from 'components';
import s from './DateForm.module.css';

const DateForm = () => {
    const [date, setDate] = useState(new Date());
    const [shift, setShift] = useState('Денна');

    return (
            <div className={s.calendar}>
                <Icon icon="calendar" w={18} h={20} />
                <p>Поточна Дата: </p>
                <DatePicker
                    maxDate={new Date()}
                    selected={date}
                    onChange={date => setDate(date)}
                    className={s.datePicker}
                    dateFormat="dd/MM/yyyy"
                />
                <p>Зміна</p>
                <Select list={['Денна', 'Нічна']} onSelect={setShift} value={shift} name="shift" />
            </div>
    );
};

export default DateForm;
