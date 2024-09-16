import { Button } from 'components';
import s from './About.module.css';

const About = ({ data }) => {
    console.log('data: ', data);
    return (
        data && (
            <div className={s.container}>
                <p className={s.wave}>
                    Частота: <span>{data.value}</span>
                </p>
                <p className="title">Пов'язані локації:</p>
                <ul className={s.list}>
                    {data.locations.map(loc => (
                        <li key={loc}>
                            <Button text={loc} />
                        </li>
                    ))}
                </ul>
                <p className="title">Пов'язані підрозділи:</p>
                <ul className={s.list}>
                    {data.subdivisions.map(subdiv => (
                        <li key={subdiv}>
                            <Button text={subdiv} />
                        </li>
                    ))}
                </ul>
                <p className="title">Пов'язані позивні:</p>
                <ul className={s.list}>
                    {data.nickNames.map(name => (
                        <li key={name}>
                            <Button text={name} />
                        </li>
                    ))}
                </ul>
            </div>
        )
    );
};

export default About;
