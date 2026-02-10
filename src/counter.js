export function setupCounter(element) {
  let counter = 0
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
let count = 0;
const counter = document.getElementById('counter');

if (counter) {
  counter.addEventListener('click', () => {
    count++;
    counter.textContent = count;
  });
}