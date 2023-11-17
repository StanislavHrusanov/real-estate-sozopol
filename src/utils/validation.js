exports.validateUser = ({ username, firstName, lastName, password, repass, email }) => {
    if (username.length < 3 || username.includes(' ')) {
        throw ('Потребителското име трябва да съдържа поне 3 символа различни от интервал!');
    }
    if (!firstName.match(/^[А-Я][а-я]*$/gm)) {
        throw ('Името трябва да започва с главна буква!');
    }
    if (!lastName.match(/^[А-Я][а-я]*$/gm)) {
        throw ('Фамилията трябва да започва с главна буква!');
    }
    if (password.length < 6 || password.includes(' ')) {
        throw ('Паролата трябва да съдържа поне 6 символа различни от интервал!');
    }
    if (password != repass) {
        throw ('Паролите не съвпадат!');
    }
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gm)) {
        throw ('Невалиден имейл адрес!');
    }
}

exports.validateAdData = ({ type, location, price, area, phoneNumber }, files) => {
    const types = ['1-СТАЕН', '2-СТАЕН', '3-СТАЕН', 'МНОГОСТАЕН', 'КЪЩА', 'ХОТЕЛ', 'МАГАЗИН', 'РЕСТОРАНТ', 'ПАРЦЕЛ'];
    const mimetypes = ['image/jpeg', 'image/png'];

    if (!types.includes(type)) {
        throw ('Невалиден тип на имота!');
    }

    if (!files.mainImage || !mimetypes.includes(files.mainImage[0].mimetype)) {
        throw (`Основната снимка е задължителна и трябва да бъде от тип '.jpg' или '.png'!`);
    }

    if (files.images) {
        files.images.forEach(image => {
            if (!mimetypes.includes(image.mimetype)) {
                throw (`Допълнителните снимки трябва да бъдат от тип '.jpg' или '.png'!`);
            }
        });
    }

    if (location == '') {
        throw ('Локацията е задължителна!');
    }

    if (!price.match(/^[0-9]+$/g)) {
        throw ('Цената е задължителна и трябва да бъде положително число!');
    }

    if (!area.match(/^[0-9]+$/g)) {
        throw ('Площта е задължителна и трябва да бъде положително число!');
    }

    if (phoneNumber == '') {
        throw ('Телефонният номер е задължителен!');
    }
}