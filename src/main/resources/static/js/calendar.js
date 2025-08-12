const calendarEl = document.getElementById('calendar');
let currentDate = window.selectedCheckIn ? new Date(window.selectedCheckIn) : new Date();

window.selectedCheckIn = window.selectedCheckIn || null;
window.selectedCheckOut = window.selectedCheckOut || null;

function formatDateLocal(date) {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
}

function renderCalendar(year, month, reservedDates = [], holidays = [], seasons = []) {
    calendarEl.innerHTML = '';

    const today = new Date();
    const todayStr = formatDateLocal(today);
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay.setDate(firstDay.getDate() - firstDay.getDay()));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41);

    let html = `<div class="calendar-header">
        <button id="prev-month" ${year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth()) ? 'disabled' : ''}>&lt;</button>
        <span>${year}년 ${(month + 1).toString().padStart(2, '0')}월</span>
        <button id="next-month">&gt;</button>
    </div>
    
    <table class="calendar-table">
        <thead><tr>${['일', '월', '화', '수', '목', '금', '토'].map(d => `<th>${d}</th>`).join('')}</tr></thead>
        <tbody>`;

    const iter = new Date(startDate);
    for (let w = 0; w < 6; w++) {
        html += '<tr>';
        for (let d = 0; d < 7; d++) {
            const dateStr = formatDateLocal(iter);
            const isPast = dateStr < todayStr;
            const isReserved = reservedDates.includes(dateStr);
            const isHoliday = holidays.includes(dateStr) || iter.getDay() === 0;

            let label = '';
            if (window.selectedCheckIn === dateStr) label = '<div class="status">입실</div>';
            else if (window.selectedCheckOut === dateStr) label = '<div class="status">퇴실</div>';
            else if (isReserved) label = '<div class="status">예약완료</div>';

            let tdClass = '';
            if (isPast) tdClass += 'past ';
            if (isHoliday) tdClass += 'holiday ';
            if (isReserved) tdClass += 'reserved ';
            
            if (window.selectedCheckIn === dateStr || window.selectedCheckOut === dateStr) {
                tdClass += 'selected ';
            }

            const isReadOnly = window.isReadOnlyMode === true;
            const disableClick = isPast || isReserved || isReadOnly;

            html += `<td class="${tdClass.trim()}" data-date="${dateStr}" ${disableClick ? 'style="pointer-events:none;"' : ''}>
                ${iter.getDate()}${label}</td>`;

            iter.setDate(iter.getDate() + 1);
        }
        html += '</tr>';
    }

    html += '</tbody></table>';
    calendarEl.innerHTML = html;

    if (!window.isReadOnlyMode) {
        calendarEl.querySelectorAll('td:not(.past):not(.reserved)').forEach(cell => {
            cell.addEventListener('click', () => {
                const date = cell.getAttribute('data-date');

                if (!window.selectedCheckIn || (window.selectedCheckIn && window.selectedCheckOut)) {
                    window.selectedCheckIn = date;
                    window.selectedCheckOut = null;
                } else if (date < window.selectedCheckIn) {
                    window.selectedCheckIn = date;
                    window.selectedCheckOut = null;
                } else if (date === window.selectedCheckIn) {
                    window.selectedCheckIn = null;
                    window.selectedCheckOut = null;
                } else {
                    const checkIn = new Date(window.selectedCheckIn);
                    const checkOut = new Date(date);
                    const diffDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

                    if (diffDays >= 6) {
                        alert("최대 5박 6일까지만 선택 가능합니다.");
                        window.selectedCheckIn = null;
                        window.selectedCheckOut = null;
                        renderCalendar(year, month, reservedDates, holidays, seasons);
                        return;
                    }

                    let hasReserved = false;
                    for (let i = 1; i < diffDays; i++) {
                        const mid = new Date(checkIn);
                        mid.setDate(mid.getDate() + i);
                        if (reservedDates.includes(formatDateLocal(mid))) {
                            hasReserved = true;
                            break;
                        }
                    }

                    if (hasReserved) {
                        alert("선택한 날짜는 예약 할 수 없습니다.");
                        window.selectedCheckIn = null;
                        window.selectedCheckOut = null;
                        renderCalendar(year, month, reservedDates, holidays, seasons);
                        return;
                    }

                    window.selectedCheckOut = date;
                }

                renderCalendar(year, month, reservedDates, holidays, seasons);
                highlightSelectedRange();
                updateReserveButton();
                calculateTotalPrice(roomId, seasons, holidays, prices, parseInt(document.getElementById('extra-person').value));
            });
        });
    }

    document.getElementById('next-month').onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth(), reservedDates, holidays, seasons);
    };
    document.getElementById('prev-month').onclick = () => {
        if (!(year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth()))) {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth(), reservedDates, holidays, seasons);
        }
    };

    if (window.isReadOnlyMode) {
        highlightSelectedRange();
    }
}

function highlightSelectedRange() {
    calendarEl.querySelectorAll('td').forEach(cell => {
        const date = cell.getAttribute('data-date');
        if (!date) return;

        cell.classList.remove('in-range');
        
        if (window.selectedCheckIn && window.selectedCheckOut) {
            const cellDate = formatDateLocal(new Date(date));
            const checkIn = window.selectedCheckIn;
            const checkOut = window.selectedCheckOut;

            if (cellDate === checkIn || cellDate === checkOut) {
                if (!cell.classList.contains('selected')) {
                    cell.classList.add('selected');
                }
            } else if (checkIn && checkOut && cellDate > checkIn && cellDate < checkOut) {
                cell.classList.add('in-range');
            }
        } else if (window.selectedCheckIn) {
            const cellDate = formatDateLocal(new Date(date));
            if (cellDate === window.selectedCheckIn) {
                if (!cell.classList.contains('selected')) {
                    cell.classList.add('selected');
                }
            }
        }
    });
}

function updateReserveButton() {
    const btn = document.getElementById('reserveBtn');
    if (btn) btn.disabled = !(selectedCheckIn && selectedCheckOut);
}

function getSeasonIdForDate(date, seasons) {
    const current = new Date(date);
    for (const season of seasons) {
        const seasonStart = new Date(season.startDate);
        const seasonEnd = new Date(season.endDate);
        if (current >= seasonStart && current <= seasonEnd) return season.id;
    }
    return null;
}

function calculateTotalPrice(roomId, seasons, holidays, prices, extraPersonCount) {
    if (!selectedCheckIn || !selectedCheckOut) return;

    let total = 0;
    const start = new Date(selectedCheckIn);
    const end = new Date(selectedCheckOut);

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDateLocal(d);
        const seasonId = getSeasonIdForDate(dateStr, seasons);

        const priceData = prices.find(p =>
            (p.room?.id || p.room_id) === roomId &&
            (p.season?.id || p.season_id) === seasonId
        );


        let base = 0;
        if (priceData) {
            const holidayPrice = priceData.holidayPrice ?? priceData.holiday_price;
            const weekendPrice = priceData.weekendPrice ?? priceData.weekend_price;
            const weekdayPrice = priceData.weekdayPrice ?? priceData.weekday_price;

            const isHoliday = holidays.includes(dateStr);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;

            base = isHoliday ? holidayPrice
                : (isWeekend ? weekendPrice : weekdayPrice);
        }
        total += base + (base * 0.2 * extraPersonCount);
    }

    document.getElementById("total-price").textContent = total.toLocaleString();
}

window.renderCalendar = renderCalendar;
window.calculateTotalPrice = calculateTotalPrice;
window.highlightSelectedRange = highlightSelectedRange;
window.updateReserveButton = updateReserveButton;