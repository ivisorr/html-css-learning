<?php
// result.php

// Устанавливаем кодировку
header('Content-Type: text/plain; charset=utf-8');

// Проверяем, есть ли данные POST
if (!empty($_POST)) {
    echo "Сервер получил данные:\n\n";

    foreach ($_POST as $key => $value) {
        echo $key . " = " . $value . "\n";
    }
} else {
    echo "POST-параметры не получены.";
}
?>