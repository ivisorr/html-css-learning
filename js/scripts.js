// ************************************ //
// JavaScript funkcii dlya - index.html //
// ************************************ //


// ************************************ //
// ustanovka nachalnogo znacheniya dati vileta na segodnya
const depart = document.getElementById("depart");
const today = new Date();
depart.value =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");
    
const form = document.getElementById("testForm"); // sekciya formi s polyami
const result = document.getElementById("result"); // sekciya rezultatov (iznachalno pustaya)


// ************************************ //
// Функция для result
function jumpToResultSection() {
    document.getElementById("block_result").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ************************************ //
// Функция для вычисления высоты и скролла
function scrollToBottom(container) {
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
    
    
// ************************************ //
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

        /*
        // vivor strokami
        for (const [name, value] of formData) {
            const p = document.createElement("p");
            p.textContent = name + " = " + value;
            result.appendChild(p);
        }
        */
        
        // vivod tablicey
        const table = document.createElement("table");
        table.border = "1";
        
        // shapka tablici
        const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
                const thName = document.createElement("th");
                thName.textContent = "Параметр";
                const thValue = document.createElement("th");
                thValue.textContent = "Значение";

                headerRow.appendChild(thName);
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

        
        // Вызываем функцию скролла после вставки элементов в DOM
        // scrollToBottom();
        jumpToResultSection();
    });
});


