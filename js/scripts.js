// ************************************
// Proekt: html-css-learning
// Avtor:  Fendrikov Iliya
// Data:   2024-06-10
//
// JavaScript dlya - index.html 
// ************************************



// #region  ATRIBUTI ELEMENTOV
// ************************************
{
    const elementSelect = document.getElementById("element_BCD");

    let dataBCD;

    // poluchaem dannie iz MDN
    async function loadBCD() {
        const response = await fetch(
            "https://unpkg.com/@mdn/browser-compat-data/data.json"
        );

        dataBCD = await response.json();

        // console.log(data.html.elements.img);
        // console.log(Object.keys( dataBCD.html.elements));
        // console.log(Object.keys(data.html.elements.img));

        // zapolnenie Select elementami
        fillSelectElements(); 
    }

    // zapolnayet Select na forme - perechnem elementov poluchennih iz BCD
    function fillSelectElements() {
        const elementsBCD = Object.keys(dataBCD.html.elements);

        elementSelect.innerHTML = "";

        for (const element of elementsBCD) {
            const option = document.createElement("option");
            option.value = element;
            option.textContent = element;
            elementSelect.append(option);
        }
    }

    // zapolnyaet telo tablici atributov pri vibore elementa "elementName"        
    function fillAttributesTable(elementName){
        // telo tablici
        
        const tbody = document.getElementById("attributes-table-body");

        const elementData = dataBCD.html.elements[elementName];
        // const attributes = Object.keys(elementData).filter( attribute => attribute !== "__compat" );
        const attributes = Object.entries(elementData)
            .filter(([name]) => name !== "__compat");
        // console.log(attributes);
        
        tbody.innerHTML = "";

        // Poluchit atributi elementa iz dataDCB
        for (const [name, data] of attributes) {
            console.log(name);
            console.log(data);
            
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            const descriptionCell = document.createElement("td");
            const linkCell = document.createElement("td");

            // const attributeData = elementData[attribute];
            // const compat = elementData[attribute].__compat;

            // Имя атрибута
            nameCell.textContent = name;
            // console.log("attribute: " + attribute);
            // console.log(attributeData);

            // valueCell1.textContent = compat.source_file;
            // valueCell2.textContent = compat.mdn_url;

            row.appendChild(nameCell);
            row.appendChild(valueCell1);
            row.appendChild(valueCell2);

            tbody.appendChild(row);
        }
    }


    loadBCD();

    // naznacheniye obrabotchika sobitiy dlya izmeneniya parametrov shrifta
    elementSelect.addEventListener("change", function () { fillAttributesTable(elementSelect.value); });

}
// ************************************
// #endregion  ATRIBUTI ELEMENTOV

    
// #region  FORMY
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
// #endregion  FORMY


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