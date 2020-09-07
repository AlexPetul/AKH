//Создаём конструктор, который будет принимать объект, с определёнными значениями (userEmail: new ValidationInput())
export class ValidationInput {
    constructor(rules = [], isValid = true, value = "", validationMessage = []) { //значения
        this.rules = rules;
        this.isValid = isValid;
        this.value = value;
        this.validationMessage = validationMessage;
    }
}

//Создаём конструктор, который будет принматься в ValidationInput, а именно в rules = [],
//в нём нужно указать type, message  ->
//type - это тип проверки, который берется из TypeOfRule(например: TypeOfRule.REQUIRED, )
//message - это строка, которая будет выводится на экран в случае провала валидации
export class Rule {
    constructor(type, message, parameter = "") {
        this.type = type;
        this.parameter = parameter; //------????????
        this.message = message;
        this.isValid = true;
    }
}

//Типы проверок для конструктора Rule
export const TypeOfRule = {
    REQUIRED: "REQUIRED",
    REGEX: "REGEX",
    LENGTH5: "LENGTH5",
    DATETIME: "DATETIME",
    REPEAT: "REPEAT",
    INTERVAL: "INTERVAL"
};

//Функция берёт state из компонента (например=> userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста email адрес")]),)
export function ValidateState(state) {
    let inputs = [];                     //создаёт массив из элементов state
    for (const property in state) {      //перебераем массив элементов
        if (state[property] instanceof ValidationInput) { //если элемент создан на основе ValidationInput
            const result = ValidateInput(state[property]); //засовываем его значение в result
            inputs.push(result); //создаём массив из элементов требующих валидации
            state[property] = result; //---------ЗАЧЕМ ЭТА СТРОКА----------
        }
    }
    const isValid = inputs.every((item) => { //every проверяет каждый элемент массива и если ВСЕ true - вернет true
        return item.isValid;
    })
    return {state, isValid}; //----------????
}

//Функция валидации которая принимает ?ЭЛЕМЕНТ ИЗ STATE? и поределяет принадлежит ли принимаемый объект к классу ValidationInput
export function ValidateInput(input) {
    if (input instanceof ValidationInput) {  //Оператор instanceof позволяет проверить, к какому классу принадлежит объект, вернёт true, если obj принадлежит классу.
        input.isValid = true //Если объект от ValidationInput, то его характеристика isValid = true, сбрасываем предыдущий результат
        input.validationMessage = [] //Массив из сообщений, ошибки которые нашли стираем
        input.rules.forEach((rule) => { //forEach для перебора массива rules, берем отдельный элемент и смотрим
            let result = ValidateRule(rule, input.value) //проходит ли валидацию
            if (!result) {  //если не проходит
                input.isValid = false; // то isValid
                input.validationMessage.push(rule.message); // и выводи сообщение из массива сообщений о непрошедшей валидации
            }
        })
        return input; // возвращаем
    }
}

//Функция принимает тип проверки и значение из поля и проводит ВАЛИДАЦИЮ
export function ValidateRule(rule, value) {
    if (rule instanceof Rule) { //вернёт true, если obj принадлежит классу Rule
        switch (rule.type) {
            case  TypeOfRule.REQUIRED: //Если тип проверки REQUIRED
                if (value || value === 0) {            //Если value - true
                    rule.isValid = true;
                    return true;  //Возвращаем в ValidateInput
                } else {
                    rule.isValid = false;
                    return false;
                }
            case TypeOfRule.REGEX: //Если тип проверки REGEX
                if (rule.parameter) {       //value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i); Пример regex для email
                    return value.match(rule.parameter); //Метод str.match(regexp) ищет совпадения с regexp в строке str. При отсутствии совпадений возвращается null
                } else {
                    console.log("required parameter");
                    return false;
                }
            case TypeOfRule.LENGTH5: //Тип проверки на количество символов
                if (value.length > 4) {            //Если value - true
                    console.log("validation of length worked");
                    return true;  //Возвращаем в ValidateInput;
                } else {
                    rule.isValid = false;
                    console.log("you need more symbols");
                    return false;
                }
            case TypeOfRule.INTERVAL:
                let intervalTypeControl = document.getElementById('interval__type');
                let intervalType = intervalTypeControl.options[intervalTypeControl.selectedIndex].value;
                if (intervalType === "min") {
                    if ((value >= 60) || (value <= 0)) {
                        return false;
                    }
                } else if (intervalType === "hours") {
                    if ((value >= 24) || (value <= 0)) {
                        return false;
                    }
                }
                return true;
            case TypeOfRule.REPEAT: //Тип проверки на количество символов
                const confirmValue = rule.parameter();
                if (value == confirmValue) {
                    return true;
                } else {
                    console.log("passwords don't match " + confirmValue);
                    return false;
                }
            case TypeOfRule.DATETIME:
                return value.match(rule.parameter);
            default:
                console.log("Unexpected type of rule: " + rule.type);
        }
    }
}