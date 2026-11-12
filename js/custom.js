// copiare l'email
function copiaEmail(email) {
  navigator.clipboard.writeText(email);
}

// locandina
document.addEventListener('DOMContentLoaded', () => {
  const chip = document.querySelector('#chip');
  const xd = document.querySelector('#xd');

  if (!chip || !xd) return;

  window.hideFloatingTerminal();

  chip.addEventListener('click', () => {
    xd.style.display = 'block';
    window.showFloatingTerminal();
  });
});
