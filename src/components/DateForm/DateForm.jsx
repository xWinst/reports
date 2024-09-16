import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Icon, Select } from 'components';
import { setDate, setShift } from 'state/date';
import 'react-datepicker/dist/react-datepicker.css';
import s from './DateForm.module.css';

const formatDate = date => {
    // console.log('date: ', date);
    const dateFormated = date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    return dateFormated.replaceAll('.', '-');
};

const DateForm = () => {
    const date = useSelector(state => state.date.date);
    const shift = useSelector(state => state.date.shift);

    const dispatch = useDispatch();

    useEffect(() => {
        if (date === '') {
            const newDate = formatDate(new Date());
            console.log('newDate: ', newDate);
            dispatch(setDate(newDate));
        }
    }, [dispatch, date]);

    // const [date, setDate] = useState(new Date());
    // const [shift, setShift] = useState('Денна');

    const saveDate = value => {
        const newDate = formatDate(value);
        dispatch(setDate(newDate));
    };

    const saveShift = value => {
        dispatch(setShift(value));
    };

    return (
        <div className={s.calendar}>
            <Icon icon="calendar" w={18} h={20} />
            <p>Поточна Дата: </p>
            <p className={s.date}>{date}</p>
            <DatePicker
                maxDate={new Date()}
                // selected={date}
                onChange={date => saveDate(date)}
                className={s.datePicker}
                // dateFormat="dd/MM/yyyy"
                // dateFormat="MMMM d, yyyy h:mm aa"
            />
            <p>Зміна</p>
            <Select list={['Денна', 'Нічна']} onSelect={saveShift} value={shift} name="shift" />
        </div>
    );
};

export default DateForm;
