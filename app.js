/* NOIR COFFEE — динамічний блок відгуків (Практична робота №4) */

const form = document.querySelector('#review-form');
const nameInput = document.querySelector('#review-name');
const textInput = document.querySelector('#review-text');
const nameError = document.querySelector('#name-error');
const textError = document.querySelector('#text-error');
const textCounter = document.querySelector('#text-counter');
const reviewsList = document.querySelector('#reviews-list');
const reviewsCount = document.querySelector('#reviews-count');
const statusBox = document.querySelector('#form-status');

let statusTimer = null;

// Лічильник: рахуємо картки відгуків у DOM
function updateCount() {
  reviewsCount.textContent = reviewsList.querySelectorAll('.review').length;
}

// Повідомлення під формою (успіх або помилка)
function showStatus(message, type) {
  statusBox.textContent = message;
  statusBox.classList.remove('is-success', 'is-error');
  statusBox.classList.add('is-visible', type === 'error' ? 'is-error' : 'is-success');
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(hideStatus, 5000);
}

function hideStatus() {
  statusBox.classList.remove('is-visible', 'is-success', 'is-error');
}

// Перевірка одного поля: порожнє або лише пробіли — помилка
function validateField(input, errorEl, message) {
  const isEmpty = input.value.trim() === '';
  errorEl.textContent = isEmpty ? message : '';
  input.classList.toggle('is-invalid', isEmpty);
  input.classList.toggle('is-valid', !isEmpty);
  return !isEmpty;
}

// Динамічне створення вузлів відгуку
function createReview(name, text) {
  const article = document.createElement('article');
  article.classList.add('review', 'review--new');

  const title = document.createElement('h3');
  title.classList.add('review__name');
  title.textContent = name; // textContent — без HTML-ін'єкцій

  const paragraph = document.createElement('p');
  paragraph.classList.add('review__text');
  paragraph.textContent = text;

  article.append(title, paragraph);
  return article;
}

// input — лічильник символів і прибирання помилки під час набору
nameInput.addEventListener('input', () => {
  if (nameInput.classList.contains('is-invalid')) {
    validateField(nameInput, nameError, "Введіть ім'я.");
  }
});

textInput.addEventListener('input', () => {
  textCounter.textContent = textInput.value.length;
  if (textInput.classList.contains('is-invalid')) {
    validateField(textInput, textError, 'Напишіть текст відгуку.');
  }
});

// submit — основна логіка
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameOk = validateField(nameInput, nameError, "Введіть ім'я.");
  const textOk = validateField(textInput, textError, 'Напишіть текст відгуку.');

  if (!nameOk || !textOk) {
    showStatus('Заповніть обидва поля, щоб надіслати відгук.', 'error');
    return;
  }

  const review = createReview(nameInput.value.trim(), textInput.value.trim());
  reviewsList.prepend(review);
  updateCount();

  form.reset();
  textCounter.textContent = '0';
  nameInput.classList.remove('is-valid', 'is-invalid');
  textInput.classList.remove('is-valid', 'is-invalid');

  showStatus('Дякуємо! Ваш відгук додано.', 'success');
});

// keydown — Escape закриває повідомлення
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideStatus();
  }
});

updateCount();