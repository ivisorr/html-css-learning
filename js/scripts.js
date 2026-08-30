// ************************************
// Proekt: html-css-learning
// Avtor:  Fendrikov Iliya
// Data:   2024-06-10
//
// JavaScript dlya - index.html 
// ************************************


// #region  Атрибуты элементов
// ************************************
{
    // Выпадающий список єлементов на форме
    const elementSelect = document.getElementById("element_HTML")

    // Таблица элементов:
    //      elementName - имя элемента
    //      description - описание
    //      attributeLinks - атрибуты
    let dataElements = {}; 

    // Таблица атрибутов:
    //      attributeName - имя атрибута
    //      elements - перечень элементов имеющих такой атрибут
    //      description - описание
    //      value - тип значения
    let dataAttributes = {};

    // Получение таблицы элементов ( dataElements) 
    // и таблицы атрибутов (dataAttributes)
    // со страницы: https://html.spec.whatwg.org/dev/indices.html 
    async function loadHTMLStandard() {
        const response = await fetch( "https://html.spec.whatwg.org/dev/indices.html" );
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }        

        // Помещает HTML-код всей страницы в строку htmlString
        const htmlString = await response.text();

        // Превращает строку в DOM
        const parser = new DOMParser();
        const documentDOM = parser.parseFromString(htmlString, "text/html");
        // console.log("documentDOM", documentDOM);

        // Заполняет Таблицу элементов
        // Таблицу находим по 
        // caption.textContent = "List of elements"
        const elementsTable = [...documentDOM.querySelectorAll("caption")]
            .find(caption => caption.textContent.trim() === "List of elements")
                ?.closest("table");
        if (!elementsTable) { throw new Error("Таблица элементов не найдена"); }
        
        // Формирует строки таблицы элемента
        const elementRows = elementsTable.querySelectorAll("tbody tr");
        // console.log("rows: ", elementRows);
        for (const row of elementRows) {
            // Имя элемента
            const elementName = row.cells[0].textContent.trim();

            // описание элемента
            const description = row.cells[1].textContent.trim();

            // Получение ссылки с описанием элемента текущей строки на сайте whatwg.org :
            // В текущей строке "row" - (строка элемента) 
            // В ячейке 0 "cells[0]" - на исходном сайте это первая колонка. 
            //      (Там находится имя атрибута как ссылка ссылка <a href = "..." >имя</a>)
            // Найти первый тег "a" - "querySelector("a")" потому что адрес "href" как раз внутри ноды <a href = "..." >
            // Если он найден "?" - тогда получаем атрибут "href" - getAttribute("href")
            const elementURL = row.cells[0].querySelector("a")?.getAttribute("href");

            // перечень атрибутов
            const attributeLinks = row.cells[5].querySelectorAll("a");
            const attributes = [];
            for (const link of attributeLinks) {
                const name = link.textContent.trim();
                const url = link.getAttribute("href");
                attributes.push({
                    name: name,
                    url: url
                });
            }

            const childrenLinks = row.cells[4].querySelectorAll("a");
            const children = [];
            for (const link of childrenLinks) {
                const name = link.textContent.trim();
                const url = link.getAttribute("href");
                children.push({
                    name: name,
                    url: url
                });
            }


            dataElements[elementName] = {
                description: description,
                url: elementURL,
                children: children,
                attributes: attributes
            };
        }

        // Заполняет Таблицу атрибутов. 
        // Таблицу находим по 
        // caption.textContent = "List of attributes (excluding event handler content attributes)"
        const attributesTable = [...documentDOM.querySelectorAll("caption")]
            .find(caption =>
                caption.textContent.trim() === "List of attributes (excluding event handler content attributes)"
            )
            ?.closest("table");
        if (!attributesTable) { throw new Error("Таблица атрибутов не найдена"); }
        
        // Формирует строки таблицы атрибутов
        const attributeRows = attributesTable.querySelectorAll("tbody tr");
        for (const row of attributeRows) {
            const attributeName = row.cells[0].textContent.trim();
            const elements =
                row.cells[1].textContent
                    .split(";")
                    .map(element => element.trim())
                    .filter(element => element !== "");
            const description = row.cells[2].textContent.trim();
            const value = row.cells[3].textContent.trim();

            if (!dataAttributes[attributeName]) { dataAttributes[attributeName] = []; }

            dataAttributes[attributeName].push({
                elements: elements,
                description: description,
                value: value
            });
        }

    }       

    // Получение данных, заполнение таблиц, 
    // первичное заполнение формы и таблицы атрибутов (первого элеимента)
    async function loadData() {
        await Promise.all([
            loadHTMLStandard()
        ]);
        // console.log("dataElements", dataElements);
        // console.log("dataAttributes:", dataAttributes);

        // Заполняет на форме поле с выпадающим списком эелементов (elementSelect) данными из (dataElements)
        fillSelectElements();
        // Заполняет на форме описание выбранного элемента (elementSelect)
        fillElenetDescription(elementSelect.value);
        // Заполняет на форме таблицу атрибутов (из dataAttributes) для первого выбранного элемента (elementSelect)
        fillAttributesTable(elementSelect.value); 
    }

    // Заполняет на форме поле с выпадающим списком эелементов (elementSelect) из (dataElements)
    function fillSelectElements() {
        const elements = Object.keys(dataElements);

        elementSelect.innerHTML = "";
        // console.log("elementSelect$: ", elementSelect);

        for (const element of elements) {
            const option = document.createElement("option");
            option.value = element;
            option.textContent = element;
            elementSelect.append(option);
        }
    }

    // Заполняет описание для выбранного элемента (elementSelect)
    function fillElenetDescription(elementName){
        const elementDescription = document.getElementById("elementDescription");
        elementDescription.innerHTML = dataElements[elementName].description;
        // console.log("dataElements[elementName]:", dataElements[elementName]);

        const elementURL = document.getElementById("elementURL");
        elementURL.href = new URL(
            dataElements[elementName].url,
            "https://html.spec.whatwg.org/dev/"
        );
        elementURL.textContent = dataElements[elementName].url;
        elementURL.target = "_blank";

    }
        
    // Заполняет на форме таблицу атрибутов (из dataAttributes) 
    // для выбранного элемента (elementSelect)
    function fillAttributesTable(elementName){
        // таблица
        const tbody = document.getElementById("attributes-table-body");
        tbody.innerHTML = "";

        // перечень атрибутов выбранного в (elementSelect) элемента (elementName = elementSelect.value)
        const attributes = dataElements[elementName].attributes; 
        for (const attribute of attributes) {
            const name = attribute.name;
            const url = attribute.url;

            // добавляет новубю строку и ячейки для атрибута
            const row = document.createElement("tr");
            
            const nameCell = document.createElement("td");
            const descriptionCell = document.createElement("td");
            const valueCell = document.createElement("td");
            const linkCell = document.createElement("td");

            // Имя атрибута
            nameCell.textContent = name;

            // Ищем описание и значение атрибута для выбранного элемента
            const attributeData = dataAttributes[name]
                ?.find(data => data.elements.includes(elementName));

            if (attributeData) {
                descriptionCell.textContent = attributeData.description;
                valueCell.textContent = attributeData.value;
            }

            // Ссылка на описание атрибута
            if (url) {
                const link = document.createElement("a");
                link.href = new URL(
                    url,
                    "https://html.spec.whatwg.org/dev/"
                );
                link.textContent = url;
                link.target = "_blank";
                linkCell.appendChild(link);
            }

            // Добавляет ячейки и строку на форму
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(valueCell);
            row.appendChild(linkCell);

            tbody.appendChild(row);
        }

        // перебор потомков
        const children = dataElements[elementName].children; 
        for (const elementChild of children) {
            const name = elementChild.name;
            const url = elementChild.url;

            // добавляет новубю строку и ячейки для атрибута
            const row = document.createElement("tr");
            
            const nameCell = document.createElement("td");
            const descriptionCell = document.createElement("td");
            const valueCell = document.createElement("td");
            const linkCell = document.createElement("td");

            // Имя элемента-потомка
            nameCell.textContent = name;
            descriptionCell.textContent = dataElements[name]?.description;
            valueCell.textContent = ""; // elenemtData.value;
            // Ссылка на описание 
            if (url) {
                const link = document.createElement("a");
                link.href = new URL(
                    url,
                    "https://html.spec.whatwg.org/dev/"
                );
                link.textContent = url;
                link.target = "_blank";
                linkCell.appendChild(link);
            }

            // Добавляет ячейки и строку на форму
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(valueCell);
            row.appendChild(linkCell);

            tbody.appendChild(row);
        }
        
    }

    loadData(); // Инициализация

    // Назначение обработчика при выборе elementSelect
    elementSelect.addEventListener("change", function () { 
        fillAttributesTable(elementSelect.value);
        fillElenetDescription(elementSelect.value)
    });

}
// ************************************
// #endregion  Атрибуты элементов


// #region  Формы
// ************************************
{
    // ustanovka nachalnogo znacheniya dati vileta na segodnya
    const depart = document.getElementById("depart"); // pole dlya vvod daty vileta
    const today = new Date();
    depart.value =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    // Perehod na nachalo sekciyu "result" posle vivoda rezultatov
    function jumpToResultSection() {
        // izmenenie zagolovka formi posle otpravki
        const now = new Date();
        document.title = "My HTML/CSS test form ( submitted:" + now.toLocaleString() + " )";

        document.getElementById("block_result").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

      // Функция для вычисления высоты и скролла (ne ispolzuetsa, prosto dlya primera)
    function scrollToBottom() {
        // izmenenie zagolovka formi posle otpravki
        const now = new Date();
        document.title = "My HTML/CSS test form ( submitted:" + now.toLocaleString() + " )";

        // Rasschitivaem visotu formi i vivodim na formu
        const height = document.body.scrollHeight; // или container.scrollHeight
        // console.log("Current doc height:", height);
        
        const docHeight = document.getElementById("docHeight"); // sekciya rezultatov (iznachalno pustaya)
        const p = document.createElement("p");
        p.textContent = "Doc height = " + height;
        docHeight.textContent = "";
        docHeight.appendChild(p);
            
        window.scrollTo({
        top: Math.max(0, height - 100), // немного сверху
        behavior: "smooth"
        });
    }
        
    // vivod otpravlaemih parametrov dlya luboy iz 2 form
    const forms = [document.getElementById("testForm"),	document.getElementById("serchForm")].filter(Boolean); //filtr po naliciy elementa (formi)
    forms.forEach(form => {		
        form.addEventListener("submit", function(event) {
            
            if (event.submitter?.value !== "fetch") {
                // otpravka cherez standartniy POST (GET) s vivodom rezultatov raboty PHP  
                return;
            }					
            
            // otpravka cherez FETCH s vivodom rezultatov na stranicu 
            event.preventDefault(); // Останавливаем стандартный submit
            
            // Читаем данные
            const formData = new FormData(form);
            const result = document.getElementById("result");
            result.textContent = "";

            // vivor strokami
            for (const [name, value] of formData) {
                const p = document.createElement("p");
                p.textContent = name + " = " + value;
                result.appendChild(p);
            }
            
            // vivod tablicey
            const table = document.createElement("table");
            table.border = "1";
            
            // shapka tablici
            const thead = document.createElement("thead");
                const headerRow = document.createElement("tr");
                    
                    const thName = document.createElement("th");
                        thName.textContent = "Параметр";
                    headerRow.appendChild(thName);

                    const thValue = document.createElement("th");
                        thValue.textContent = "Значение";
                    headerRow.appendChild(thValue);

                thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // telo tablici
            const tbody = document.createElement("tbody");

            for (const [name, value] of formData) {
                const row = document.createElement("tr");

                const nameCell = document.createElement("td");
                nameCell.textContent = name;

                const valueCell = document.createElement("td");
                valueCell.textContent = value;

                row.appendChild(nameCell);
                row.appendChild(valueCell);

                tbody.appendChild(row);
            }
            
            table.appendChild(tbody);
            result.appendChild(table);
            
            // otpravlaem cherez FETCH shtobi forma ne obnolalas
            // console.log("Action: ", form.action);
            fetch(form.action, { method: "POST", body: formData })
                .then(res => res.text())
                .then(data => console.log(data));
                        
            // scrollToBottom(); // Вызываем функцию скролла после вставки элементов в DOM
            jumpToResultSection(); // Prigaet na sekciyu rezultata
        });
    });

}
// ************************************
// #endregion  Формы


// #region  ШРИФТ //
// ************************************
{
    // DOM
    const fontFamilySelect = document.getElementById("font-family");
    const fontStyleSelect = document.getElementById("font-style");
    const fontTransformSelect = document.getElementById("text-transform");
    const fontSizeInput = document.getElementById("font-size");
    const fontWeightSelect = document.getElementById("font-weight");
    const fontSizeValue = document.getElementById("font-size-value");
    // const applyButton = document.getElementById("apply-font");

    const target = document.getElementById("font-example"); // imya sekcii-primera k kotoromu primenyaetsya shrift
    const fontSettingsText = document.getElementById("font-settings-output"); // tekst s tekushimi nastroykami shrifta

    // Data
    const fonts = [
        "Arial",
        "Verdana",
        "Georgia",
        "Times New Roman",
        "Courier New"
    ];
    const fontStyles = [
        "normal", 
        "italic", 
        "oblique"
    ];
    const fontTransforms = [
        "none",
        "uppercase",
        "lowercase",
        "capitalize"
    ];
    const fontWeights = [
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900
    ];

    // funkciya zapolnaet element selec - [selectElement]
    // znacheniyami iz massiva - [values]   
    function fillSelect(selectElement, values) {
        for (const value of values) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            selectElement.append(option);
        }
    }

    // primenenie parametrov shrifta k sekcii primera 
    function applyFontSettings() {
        target.style.fontFamily = fontFamilySelect.value;
        target.style.fontStyle = fontStyleSelect.value;
        target.style.textTransform = fontTransformSelect.value;
        target.style.fontWeight = fontWeightSelect.value;
        target.style.fontSize = fontSizeInput.value + "px";

        fontSizeValue.textContent =	fontSizeInput.value + "px";
        fontSettingsText.innerHTML = `
            Шрифт (font-family): ${fontFamilySelect.value}<br>
            Стиль: (font-style): ${fontStyleSelect.value}<br>
            Регистр (text-transform): ${fontTransformSelect.value}<br>
            Размер (font-size): ${fontSizeInput.value}px<br>
            Жирность (font-weight): ${fontWeightSelect.value}
        `;
    }

    // inicializaciya select-elementov
    // zapolnanie u atributov shfifta na forme cpiskov vozmojnih znacheniy
    fillSelect(fontFamilySelect, fonts);
    fillSelect(fontStyleSelect, fontStyles );
    fillSelect(fontTransformSelect, fontTransforms);
    fillSelect(fontWeightSelect, fontWeights);

    applyFontSettings(); // primenenie parametrov shrifta k sekcii primera

    // naznacheniye obrabotchika sobitiy dlya izmeneniya parametrov shrifta
    fontFamilySelect.addEventListener("change", applyFontSettings);
    fontStyleSelect.addEventListener("change", applyFontSettings);
    fontTransformSelect.addEventListener("change", applyFontSettings);
    fontWeightSelect.addEventListener("change", applyFontSettings);
    fontSizeInput.addEventListener("input", applyFontSettings);
    // applyButton.addEventListener("click", applyFontSettings);

}
// ************************************
// #endregion  ШРИФT