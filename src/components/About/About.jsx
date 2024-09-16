import { Button } from 'components';
import s from './About.module.css';

const About = ({ data, actions }) => {
    console.log('actions: ', actions);
    console.log('data: ', data);
    return (
        data && (
            <div className={s.container}>
                <p className={s.wave}>
                    {data.name}: <span>{data.value}</span>
                </p>
                {data.locations && (
                    <>
                        <p className="title">Пов'язані локації:</p>
                        <ul className={s.list}>
                            {data.locations.map(loc => (
                                <li key={loc}>
                                    <Button text={loc} />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {data.subdivisions && (
                    <>
                        <p className="title">Пов'язані підрозділи:</p>
                        <ul className={s.list}>
                            {data.subdivisions.map(subdiv => (
                                <li key={subdiv}>
                                    <Button text={subdiv} />
                                </li>
                            ))}
                        </ul>{' '}
                    </>
                )}
                {data.waves && (
                    <>
                        <p className="title">Пов'язані частоти:</p>
                        <ul className={s.list}>
                            {data.waves.map(wave => (
                                <li key={wave}>
                                    <Button text={wave} click={() => actions(wave)} />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {data.nickNames && (
                    <>
                        <p className="title">Пов'язані позивні:</p>
                        <ul className={s.list}>
                            {data.nickNames.map(name => (
                                <li key={name}>
                                    <Button text={name} />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )
    );
};

export default About;
