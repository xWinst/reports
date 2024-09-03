import { useDispatch } from 'react-redux';
import { Button } from 'components';
import { setDataBase } from 'state/database';

const Menu = () => {
    // const selectDir = async () => {
    //     // const dirHandle = await window.showDirectoryPicker();
    //     // const dirHandle = await dialog.showOpenDialog({
    //     //     properties: ['openDirectory', 'multiSelections'],
    //     // });
    //     // console.log('dirHandle: ', dirHandle);
    // };

    const dispatch = useDispatch();
    let input;
    const chooseFile = e => {
        const { files } = e.target;

        if (files && files[0]) {
            const file = files[0];
            input.remove();

            const reader = new FileReader();

            reader.addEventListener(
                'load',
                () => {
                    const result = JSON.parse(reader.result);
                    console.log('result: ', result);
                    dispatch(setDataBase(result));
                },
                false
            );

            if (file) reader.readAsText(file);
        }
    };

    const load = () => {
        input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.json');
        input.addEventListener('change', chooseFile);
        input.click();
    };

    return (
        <div>
            <Button text="Завантажити БД" click={load} />
        </div>
    );
};

export default Menu;
