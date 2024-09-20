import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { About, Button } from 'components';
import s from './pages.module.css';

// const menu = ['Частоти', 'Підрозділи', 'Локації', 'Позивні'];

const DataBase = () => {
    const { frequencies, locations, subdivisions } = useSelector(state => state.database);
    const [search, setSearch] = useState('');

    const getList = useCallback(
        name => {
            return frequencies
                .flatMap(wave => wave[name])
                .filter((el, ind, arr) => ind === arr.indexOf(el));
        },
        [frequencies]
    );

    const [knownWaves, setKnownWaves] = useState(getList('value'));
    const [subDivs, setSubDivs] = useState(getList('subdivisions'));
    const [locs, setLocations] = useState(getList('locations'));
    const [nickNames, setNickNames] = useState(getList('nickNames'));

    const [data, setData] = useState();
    // const [menuItem, setMenuItem] = useState('Частоти');

    useEffect(() => {
        const str = search.toLowerCase();

        const filteredKnownWaves = getList('value').filter(el => el.toString().includes(search));
        const filteredSubDivs = getList('subdivisions').filter(el =>
            el.toLowerCase().includes(str)
        );
        const filteredLocations = getList('locations').filter(el => el.toLowerCase().includes(str));
        const filteredNickNames = getList('nickNames').filter(el => el.toLowerCase().includes(str));

        setKnownWaves(filteredKnownWaves);
        setSubDivs(filteredSubDivs);
        setLocations(filteredLocations);
        setNickNames(filteredNickNames);
    }, [search, getList]);

    const showWave = wave => {
        const waveData = frequencies.find(({ value }) => value === wave);
        waveData.name = 'Частота';
        setData(waveData);
    };

    const showLoc = value => {
        const locData = locations.find(({ loc }) => loc === value);
        locData.name = 'Локація';
        locData.value = locData.loc.toUpperCase();

        setData(locData);
    };
    const showDiv = subdiv => {
        const locData = subdivisions.find(({ unit }) => unit === subdiv);
        locData.name = 'Підрозділ';
        locData.value = locData.unit.toUpperCase();

        setData(locData);
    };

    const showName = name => {
        const waves = frequencies.filter(({ nickNames }) => nickNames.includes(name));
        const locData = {
            name: 'Позивний',
            value: name.toUpperCase(),
            waves: waves.map(({ value }) => value),
        };

        setData(locData);
    };

    // const actions =

    return (
        <div className={s.container}>
            <About data={data} actions={showWave} />
            {/* <ul className={s.menu}>
                {menu.map(item => (
                    <li
                        key={item}
                        className={menuItem === item ? s.activeMarker : s.marker}
                        onClick={() => setMenuItem(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul> */}
            <div className={s.aside}>
                <input
                    className={s.search}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <p className="title">Частоти</p>
                <ul className={s.btnThumb}>
                    {knownWaves.map(wave => (
                        <Button key={wave} text={wave} click={() => showWave(wave)} />
                    ))}
                </ul>
                <p className="title">Підрозділи</p>
                <ul className={s.btnThumb}>
                    {subDivs.map(subdiv => (
                        <Button key={subdiv} text={subdiv} click={() => showDiv(subdiv)} />
                    ))}
                </ul>
                <p className="title">Локації</p>
                <ul className={s.btnThumb}>
                    {locs.map(loc => (
                        <Button key={loc} text={loc} click={() => showLoc(loc)} />
                    ))}
                </ul>
                <p className="title">Позивні</p>
                <ul className={s.btnThumb}>
                    {nickNames.map(name => (
                        <Button key={name} text={name} click={() => showName(name)} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DataBase;
