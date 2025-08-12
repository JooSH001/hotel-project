Promise.all([
  fetch('/api/rooms').then(res => res.json()),
  fetch('/api/prices').then(res => res.json()),
  fetch('/api/seasons').then(res => res.json())
]).then(([rooms, prices, seasons]) => {
  const table = document.createElement('table');
  table.border = "0";
  table.style.borderCollapse = "collapse";

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th rowspan="2" class="reser_th">객실</th>
      <th rowspan="2" class="reser_th">면적</th>
      <th rowspan="2" class="reser_th">인원<br>(기준/최대)</th>
      ${seasons.map(s => `<th colspan="3" class="reser_th_1">${s.name}<br>(${(s.startDate || s.start_date).replace(/\d{4}-/, '')}~${(s.endDate || s.end_date).replace(/\d{4}-/, '')})</th>`).join('')}
    </tr>
    <tr>
      ${seasons.map(() => `<th class="reser_thh">주중</th><th class="reser_thh">주말</th><th class="reser_thh">휴일</th>`).join('')}
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rooms.forEach(room => {
    const tr = document.createElement('tr');
    const row = [
      `<td>${room.name}</td>`,
      `<td>${room.area}㎡</td>`,
      `<td>${room.minGuest}/${room.capacity}</td>`
    ];

    seasons.forEach(season => {
      const priceData = prices.find(p => p.room.id === room.id && p.season.id === season.id);
      if (priceData) {
        row.push(`<td>${priceData.weekdayPrice.toLocaleString()}</td>`);
        row.push(`<td>${priceData.weekendPrice.toLocaleString()}</td>`);
        row.push(`<td>${priceData.holidayPrice.toLocaleString()}</td>`);
      } else {
        row.push('<td>-</td><td>-</td><td>-</td>');
      }
    });

    tr.innerHTML = row.join('');
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  document.getElementById('reservation-table').appendChild(table);
});
