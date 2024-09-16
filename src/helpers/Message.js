import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const styles = {
    width: '340px',
    svgSize: '100px',
    titleFontSize: '20px',
    buttonFontSize: '20px',
    borderRadius: '10px',
};

Report.init({
    plainText: false,
    titleMaxLength: 100,
});

class Message {
    warning(warning, text, buttonText) {
        return Report.warning(warning, text, buttonText, styles);
    }

    error(error, text, buttonText) {
        return Report.failure(error, text, buttonText, styles);
    }

    sucsess(text) {
        return Notify.success(text);
    }
}

const message = new Message();

export default message;
