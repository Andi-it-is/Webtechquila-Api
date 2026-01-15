
function toIsoDate(dateStr) {
  const [day, month, year] = dateStr.split('.');
  const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  return date
}

function buildTimeslots(startTime, count = 8, step = 15) {
  const [h, m] = startTime.split(':').map(Number);
  const startMinutes = h * 60 + m;

  return Array.from({ length: count }, (_, i) => {
    const total = startMinutes + i * step;
    const hh = String(Math.floor(total / 60)).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  });
}

function buildTimeslots(startTime, count = 8, step = 15) {
  const [h, m] = startTime.split(':').map(Number);
  const startMinutes = h * 60 + m;

  return Array.from({ length: count }, (_, i) => {
    const total = startMinutes + i * step;
    const hh = String(Math.floor(total / 60)).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  });
}

function removeBlockedRange(slots, reservationStart, reservationEnd, buffer = 105) {
  const toMin = t => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const startMin = toMin(reservationStart) - buffer;
  const endMin = toMin(reservationEnd);

  const slotCount = Math.floor((endMin - startMin) / 15) + 1;
  const rangeSlots = buildTimeslots(
    `${String(Math.floor(startMin / 60)).padStart(2, '0')}:${String(startMin % 60).padStart(2, '0')}`,
    slotCount
  );

  const removeSet = new Set(rangeSlots);
  return slots.filter(slot => !removeSet.has(slot));
}


module.exports = {
  toIsoDate,
  buildTimeslots,
  removeBlockedRange
}