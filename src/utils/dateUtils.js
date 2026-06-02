const OPENING_HOUR = 7;
const CLOSING_HOUR = 22;

/**
 * Verifica se uma data é no passado
 */
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Verifica se o horário está dentro do funcionamento (07:00 - 22:00)
 */
const isWithinBusinessHours = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;

  return startHour >= OPENING_HOUR && endHour <= CLOSING_HOUR;
};

/**
 * Verifica se startDate é antes de endDate
 */
const isValidRange = (startDate, endDate) => {
  return new Date(startDate) < new Date(endDate);
};

/**
 * Verifica conflito de horário entre reservas
 * Lógica: nova reserva conflita se newStart < existingEnd && newEnd > existingStart
 */
const hasConflict = (newStart, newEnd, existingStart, existingEnd) => {
  return new Date(newStart) < new Date(existingEnd) &&
    new Date(newEnd) > new Date(existingStart);
};

module.exports = {
  isPastDate,
  isWithinBusinessHours,
  isValidRange,
  hasConflict,
  OPENING_HOUR,
  CLOSING_HOUR,
};
