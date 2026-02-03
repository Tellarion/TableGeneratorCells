let config = null;
let images = []; // Массив загруженных изображений

// Загрузка конфигурации при старте
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        config = await response.json();
        applyConfigToUI();
        generateTable();
    } catch (error) {
        console.error('Ошибка загрузки конфигурации:', error);
    }
}

// Применить конфигурацию к элементам UI
function applyConfigToUI() {
    document.getElementById('startLetter').value = config.table.startLetter;
    document.getElementById('endLetter').value = config.table.endLetter;
    document.getElementById('startNumber').value = config.table.startNumber;
    document.getElementById('endNumber').value = config.table.endNumber;
    document.getElementById('cellWidth').value = parseInt(config.table.cellWidth);
    document.getElementById('cellHeight').value = parseInt(config.table.cellHeight);
    document.getElementById('zoom').value = config.table.zoom || 100;
    document.getElementById('zoomValue').textContent = (config.table.zoom || 100) + '%';
    document.getElementById('cornerText').value = config.table.cornerText || '';
    document.getElementById('cornerColor').value = config.table.cornerColor || '#ffffff';
    document.getElementById('cornerFontSize').value = parseInt(config.table.cornerFontSize) || 20;
    document.getElementById('cornerFontFamily').value = config.table.cornerFontFamily || 'Arial, sans-serif';
    document.getElementById('cornerBold').checked = config.table.cornerBold || false;
    
    document.getElementById('fontSize').value = parseInt(config.styles.cell.fontSize);
    document.getElementById('cellBold').checked = config.styles.cell.fontBold || false;
    document.getElementById('textColor').value = config.styles.cell.color;
    document.getElementById('enableTextStroke').checked = config.styles.cell.textStrokeEnabled || false;
    document.getElementById('textStrokeColor').value = config.styles.cell.textStrokeColor || '#ffffff';
    document.getElementById('textStrokeWidth').value = parseInt(config.styles.cell.textStrokeWidth) || 2;
    document.getElementById('cellBgColor').value = config.styles.cell.backgroundColor;
    document.getElementById('cellBgOpacity').value = config.styles.cell.backgroundOpacity || 100;
    document.getElementById('cellBgOpacityValue').textContent = (config.styles.cell.backgroundOpacity || 100) + '%';
    document.getElementById('borderColor').value = config.styles.cell.border.split(' ')[2];
    document.getElementById('borderWidth').value = parseInt(config.styles.cell.border);
    document.getElementById('cellPadding').value = parseInt(config.styles.cell.padding);
    document.getElementById('fontFamily').value = config.styles.table.fontFamily;
    
    document.getElementById('headerBold').checked = config.styles.header.fontBold !== undefined ? config.styles.header.fontBold : true;
    document.getElementById('headerBgColor').value = config.styles.header.backgroundColor;
    document.getElementById('headerBgOpacity').value = config.styles.header.backgroundOpacity || 100;
    document.getElementById('headerBgOpacityValue').textContent = (config.styles.header.backgroundOpacity || 100) + '%';
    document.getElementById('headerTextColor').value = config.styles.header.color;
    
    document.getElementById('tableBgColor').value = config.styles.table.backgroundColor;
    document.getElementById('tableBgOpacity').value = config.styles.table.backgroundOpacity || 100;
    document.getElementById('tableBgOpacityValue').textContent = (config.styles.table.backgroundOpacity || 100) + '%';
}

// Получить значения из UI
function getUIValues() {
    return {
        table: {
            startLetter: document.getElementById('startLetter').value,
            endLetter: document.getElementById('endLetter').value,
            startNumber: parseInt(document.getElementById('startNumber').value),
            endNumber: parseInt(document.getElementById('endNumber').value),
            cellWidth: document.getElementById('cellWidth').value + 'px',
            cellHeight: document.getElementById('cellHeight').value + 'px',
            zoom: parseInt(document.getElementById('zoom').value),
            cornerText: document.getElementById('cornerText').value,
            cornerColor: document.getElementById('cornerColor').value,
            cornerFontSize: document.getElementById('cornerFontSize').value + 'px',
            cornerFontFamily: document.getElementById('cornerFontFamily').value,
            cornerBold: document.getElementById('cornerBold').checked
        },
        styles: {
            table: {
                borderCollapse: 'collapse',
                backgroundColor: document.getElementById('tableBgColor').value,
                backgroundOpacity: parseInt(document.getElementById('tableBgOpacity').value),
                fontFamily: document.getElementById('fontFamily').value
            },
            cell: {
                border: `${document.getElementById('borderWidth').value}px solid ${document.getElementById('borderColor').value}`,
                padding: document.getElementById('cellPadding').value + 'px',
                textAlign: 'center',
                fontSize: document.getElementById('fontSize').value + 'px',
                color: document.getElementById('textColor').value,
                backgroundColor: document.getElementById('cellBgColor').value,
                backgroundOpacity: parseInt(document.getElementById('cellBgOpacity').value),
                textStrokeEnabled: document.getElementById('enableTextStroke').checked,
                textStrokeColor: document.getElementById('textStrokeColor').value,
                textStrokeWidth: document.getElementById('textStrokeWidth').value + 'px',
                fontBold: document.getElementById('cellBold').checked
            },
            header: {
                backgroundColor: document.getElementById('headerBgColor').value,
                backgroundOpacity: parseInt(document.getElementById('headerBgOpacity').value),
                color: document.getElementById('headerTextColor').value,
                fontBold: document.getElementById('headerBold').checked
            }
        }
    };
}

// Генерация таблицы
function generateTable() {
    const currentConfig = getUIValues();
    
    // Получение диапазона букв (кириллица) - это будут КОЛОНКИ
    const startCode = currentConfig.table.startLetter.toUpperCase().charCodeAt(0);
    const endCode = currentConfig.table.endLetter.toUpperCase().charCodeAt(0);
    
    const letters = [];
    for (let i = startCode; i <= endCode; i++) {
        letters.push(String.fromCharCode(i));
    }
    
    // Получение диапазона чисел - это будут СТРОКИ
    const startNum = currentConfig.table.startNumber;
    const endNum = currentConfig.table.endNumber;
    
    // Создание таблицы
    let tableHTML = '<table id="generatedTable">';
    
    // Создаем заголовок с буквами (колонки)
    tableHTML += '<tr>';
    const cornerText = currentConfig.table.cornerText || '';
    tableHTML += `<td class="header-cell corner-cell">${cornerText}</td>`; // Угловая ячейка с текстом
    for (let letter of letters) {
        tableHTML += `<td class="header-cell">${letter}</td>`;
    }
    tableHTML += '</tr>';
    
    // Создаем строки с номерами и ячейками
    for (let num = startNum; num <= endNum; num++) {
        tableHTML += '<tr>';
        // Первая ячейка - номер строки (заголовок строки)
        tableHTML += `<td class="header-cell">${num}</td>`;
        
        // Ячейки с данными (буква + номер)
        for (let letter of letters) {
            tableHTML += `<td>${letter}${num}</td>`;
        }
        tableHTML += '</tr>';
    }
    
    tableHTML += '</table>';
    
    document.getElementById('tableContainer').innerHTML = tableHTML;
    
    // Применение стилей
    applyStyles(currentConfig);
    
    // Перерисовываем изображения после обновления таблицы
    renderImages();
}

// Конвертация цвета в rgba с прозрачностью
function hexToRgba(hex, opacity) {
    // Проверка на undefined/null
    if (!hex) hex = '#ffffff';
    if (opacity === undefined || opacity === null) opacity = 100;
    
    // Если прозрачность 0, возвращаем transparent
    if (opacity === 0) return 'transparent';
    
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

// Применение стилей к таблице
function applyStyles(currentConfig) {
    const table = document.getElementById('generatedTable');
    const tableContainer = document.getElementById('tableContainer');
    if (!table) return;
    
    // Применение зума
    const zoom = currentConfig.table.zoom || 100;
    tableContainer.style.transform = `scale(${zoom / 100})`;
    
    // Стили таблицы
    table.style.borderCollapse = currentConfig.styles.table.borderCollapse;
    table.style.fontFamily = currentConfig.styles.table.fontFamily;
    
    const tableBgOpacity = parseInt(currentConfig.styles.table.backgroundOpacity);
    if (tableBgOpacity === 0 || isNaN(tableBgOpacity)) {
        table.style.backgroundColor = 'transparent';
    } else {
        table.style.backgroundColor = hexToRgba(
            currentConfig.styles.table.backgroundColor,
            tableBgOpacity
        );
    }
    
    // Стили ячеек
    const cells = table.getElementsByTagName('td');
    for (let cell of cells) {
        cell.style.border = currentConfig.styles.cell.border;
        cell.style.padding = currentConfig.styles.cell.padding;
        cell.style.textAlign = currentConfig.styles.cell.textAlign;
        cell.style.fontSize = currentConfig.styles.cell.fontSize;
        cell.style.width = currentConfig.table.cellWidth;
        cell.style.height = currentConfig.table.cellHeight;
        
        // Применение обводки текста
        if (currentConfig.styles.cell.textStrokeEnabled) {
            const strokeWidth = parseInt(currentConfig.styles.cell.textStrokeWidth) || 2;
            const strokeColor = currentConfig.styles.cell.textStrokeColor;
            
            // Используем только text-shadow для создания обводки
            // Это работает одинаково в превью и скриншоте
            const shadows = [];
            
            // Создаем более точную обводку с большим количеством теней
            const step = 0.5; // Шаг для более плавной обводки
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
                for (let dist = step; dist <= strokeWidth; dist += step) {
                    const x = Math.cos(angle) * dist;
                    const y = Math.sin(angle) * dist;
                    shadows.push(`${x.toFixed(1)}px ${y.toFixed(1)}px 0 ${strokeColor}`);
                }
            }
            
            cell.style.textShadow = shadows.join(', ');
            cell.style.webkitTextStroke = '';
            cell.style.paintOrder = '';
        } else {
            cell.style.textShadow = 'none';
            cell.style.webkitTextStroke = '';
            cell.style.paintOrder = '';
        }
        
        // Стили заголовка
        if (cell.classList.contains('header-cell')) {
            // Специальная обработка угловой ячейки
            if (cell.classList.contains('corner-cell')) {
                cell.style.fontSize = currentConfig.table.cornerFontSize;
                cell.style.fontFamily = currentConfig.table.cornerFontFamily;
                cell.style.fontWeight = currentConfig.table.cornerBold ? 'bold' : 'normal';
                cell.style.color = currentConfig.table.cornerColor || currentConfig.styles.header.color;
            } else {
                cell.style.fontWeight = currentConfig.styles.header.fontBold ? 'bold' : 'normal';
                cell.style.color = currentConfig.styles.header.color;
            }
            
            const headerBgOpacity = parseInt(currentConfig.styles.header.backgroundOpacity);
            if (headerBgOpacity === 0 || isNaN(headerBgOpacity)) {
                cell.style.backgroundColor = 'transparent';
            } else {
                cell.style.backgroundColor = hexToRgba(
                    currentConfig.styles.header.backgroundColor,
                    headerBgOpacity
                );
            }
        } else {
            // Обычные ячейки
            const cellBgOpacity = parseInt(currentConfig.styles.cell.backgroundOpacity);
            if (cellBgOpacity === 0 || isNaN(cellBgOpacity)) {
                cell.style.backgroundColor = 'transparent';
            } else {
                cell.style.backgroundColor = hexToRgba(
                    currentConfig.styles.cell.backgroundColor,
                    cellBgOpacity
                );
            }
            cell.style.color = currentConfig.styles.cell.color;
            cell.style.fontWeight = currentConfig.styles.cell.fontBold ? 'bold' : 'normal';
        }
    }
}

// Сохранение конфигурации
async function saveConfig() {
    const currentConfig = getUIValues();
    
    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentConfig)
        });
        
        if (response.ok) {
            alert('✅ Конфигурация сохранена!');
            config = currentConfig;
        } else {
            alert('❌ Ошибка сохранения конфигурации');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Ошибка сохранения конфигурации');
    }
}

// Создание скриншота
async function takeScreenshot() {
    const tableContainer = document.getElementById('tableContainer');
    
    if (!tableContainer) {
        alert('❌ Таблица не найдена');
        return;
    }
    
    try {
        // Проверяем настройку прозрачности
        const transparentBg = document.getElementById('transparentBg').checked;
        
        // Сохраняем текущие стили
        const originalBg = tableContainer.style.backgroundColor;
        const originalTransform = tableContainer.style.transform;
        const originalBoxShadow = tableContainer.style.boxShadow;
        
        // Сбрасываем зум для полного скриншота
        tableContainer.style.transform = 'scale(1)';
        tableContainer.style.boxShadow = 'none'; // Убираем тень для чистого скриншота
        
        // Если нужен прозрачный фон, временно убираем фон контейнера
        if (transparentBg) {
            tableContainer.style.backgroundColor = 'transparent';
        }
        
        // Небольшая задержка для применения стилей
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(tableContainer, {
            backgroundColor: transparentBg ? null : '#ffffff',
            scale: 2, // Увеличиваем качество
            logging: false,
            useCORS: true,
            removeContainer: false,
            allowTaint: true,
            foreignObjectRendering: false,
            width: tableContainer.scrollWidth,
            height: tableContainer.scrollHeight,
            windowWidth: tableContainer.scrollWidth,
            windowHeight: tableContainer.scrollHeight
        });
        
        // Восстанавливаем стили
        tableContainer.style.backgroundColor = originalBg;
        tableContainer.style.transform = originalTransform;
        tableContainer.style.boxShadow = originalBoxShadow;
        
        // Конвертация в PNG
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            link.download = `table-screenshot-${timestamp}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            alert(transparentBg ? '✅ Скриншот с прозрачным фоном сохранён!' : '✅ Скриншот сохранён!');
        }, 'image/png');
        
    } catch (error) {
        console.error('Ошибка создания скриншота:', error);
        alert('❌ Ошибка создания скриншота');
        
        // Восстанавливаем стили в случае ошибки
        const tableContainer = document.getElementById('tableContainer');
        if (tableContainer) {
            generateTable(); // Перегенерируем таблицу для восстановления стилей
        }
    }
}

// Быстрая установка прозрачности для всех элементов
function setAllOpacity(value) {
    // Устанавливаем значения для всех слайдеров прозрачности
    document.getElementById('cellBgOpacity').value = value;
    document.getElementById('cellBgOpacityValue').textContent = value + '%';
    
    document.getElementById('headerBgOpacity').value = value;
    document.getElementById('headerBgOpacityValue').textContent = value + '%';
    
    document.getElementById('tableBgOpacity').value = value;
    document.getElementById('tableBgOpacityValue').textContent = value + '%';
    
    // Обновляем таблицу
    generateTable();
}

// Добавляем drag-to-pan функциональность
function initDragToPan() {
    const mainContent = document.querySelector('.main-content');
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    mainContent.addEventListener('mousedown', (e) => {
        // Разрешаем граб везде, включая таблицу
        isDragging = true;
        mainContent.style.cursor = 'grabbing';
        startX = e.pageX - mainContent.offsetLeft;
        startY = e.pageY - mainContent.offsetTop;
        scrollLeft = mainContent.scrollLeft;
        scrollTop = mainContent.scrollTop;
    });
    
    mainContent.addEventListener('mouseleave', () => {
        isDragging = false;
        mainContent.style.cursor = 'grab';
    });
    
    mainContent.addEventListener('mouseup', () => {
        isDragging = false;
        mainContent.style.cursor = 'grab';
    });
    
    mainContent.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - mainContent.offsetLeft;
        const y = e.pageY - mainContent.offsetTop;
        const walkX = (x - startX) * 2; // Увеличил скорость прокрутки
        const walkY = (y - startY) * 2;
        mainContent.scrollLeft = scrollLeft - walkX;
        mainContent.scrollTop = scrollTop - walkY;
    });
}

// Добавляем зум колесиком мыши
function initMouseWheelZoom() {
    const mainContent = document.querySelector('.main-content');
    const zoomSlider = document.getElementById('zoom');
    const zoomValue = document.getElementById('zoomValue');
    
    mainContent.addEventListener('wheel', (e) => {
        // Проверяем, что курсор над областью таблицы
        if (e.target.closest('#tableContainer') || e.target === mainContent) {
            e.preventDefault();
            
            // Получаем текущее значение зума
            let currentZoom = parseInt(zoomSlider.value);
            
            // Изменяем зум в зависимости от направления прокрутки
            // deltaY < 0 = прокрутка вверх = увеличение
            // deltaY > 0 = прокрутка вниз = уменьшение
            const zoomDelta = e.deltaY < 0 ? 5 : -5;
            let newZoom = currentZoom + zoomDelta;
            
            // Ограничиваем диапазон 10-200%
            newZoom = Math.max(10, Math.min(200, newZoom));
            
            // Обновляем слайдер и значение
            zoomSlider.value = newZoom;
            zoomValue.textContent = newZoom + '%';
            
            // Применяем зум
            generateTable();
        }
    }, { passive: false });
}

// Система управления изображениями
function initImageSystem() {
    const imageUpload = document.getElementById('imageUpload');
    
    imageUpload.addEventListener('change', (e) => {
        const files = e.target.files;
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addImage(event.target.result, file.name);
                };
                reader.readAsDataURL(file);
            }
        }
        imageUpload.value = ''; // Очистка input для повторной загрузки
    });
}

function addImage(src, name) {
    const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const imageObj = {
        id: imageId,
        src: src,
        name: name,
        x: 100,
        y: 100,
        width: 100,
        height: 100
    };
    
    images.push(imageObj);
    updateImagesList();
    renderImages();
}

function updateImagesList() {
    const imagesList = document.getElementById('imagesList');
    imagesList.innerHTML = '';
    
    images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.innerHTML = `
            <div class="image-item-info">
                <img src="${img.src}" class="image-item-thumb" alt="${img.name}">
                <span>${img.name}</span>
            </div>
            <div class="image-item-controls">
                <input type="number" value="${parseInt(img.width)}" onchange="resizeImage(${index}, this.value)" 
                       placeholder="Размер" min="20" max="500" title="Ширина (px)">
                <button class="image-item-remove" onclick="removeImage(${index})">✕</button>
            </div>
        `;
        imagesList.appendChild(item);
    });
}

// Делаем функции глобальными для доступа из HTML
window.removeImage = function(index) {
    images.splice(index, 1);
    updateImagesList();
    renderImages();
}

window.resizeImage = function(index, width) {
    const w = parseInt(width);
    if (w >= 20 && w <= 500) {
        images[index].width = w;
        images[index].height = w; // Сохраняем пропорции
        renderImages();
    }
}

function renderImages() {
    const tableContainer = document.getElementById('tableContainer');
    
    // Удаляем старые изображения
    const oldImages = tableContainer.querySelectorAll('.draggable-image');
    oldImages.forEach(img => img.remove());
    
    // Добавляем новые
    images.forEach(imgData => {
        const img = document.createElement('img');
        img.src = imgData.src;
        img.className = 'draggable-image';
        img.id = imgData.id;
        img.style.left = imgData.x + 'px';
        img.style.top = imgData.y + 'px';
        img.style.width = imgData.width + 'px';
        img.style.height = imgData.height + 'px';
        
        makeDraggable(img, imgData);
        tableContainer.appendChild(img);
    });
}

function makeDraggable(element, imgData) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    element.addEventListener('mousedown', (e) => {
        e.stopPropagation(); // Предотвращаем drag-to-pan
        isDragging = true;
        element.classList.add('dragging');
        
        initialX = e.clientX - imgData.x;
        initialY = e.clientY - imgData.y;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging && element.id === imgData.id) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            imgData.x = currentX;
            imgData.y = currentY;
            
            element.style.left = currentX + 'px';
            element.style.top = currentY + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
        }
    });
}

// Добавляем слушатели на изменение значений для real-time обновления
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initDragToPan(); // Инициализируем drag-to-pan
    initMouseWheelZoom(); // Инициализируем зум колесиком
    initImageSystem(); // Инициализируем систему изображений
    
    // Real-time обновление при изменении любого параметра
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            generateTable();
        });
        
        // Для number, color, range и text полей - обновление при вводе
        if (input.type === 'number' || input.type === 'color' || input.type === 'range') {
            input.addEventListener('input', () => {
                generateTable();
            });
        }
    });
});

