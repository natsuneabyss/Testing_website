document.addEventListener('DOMContentLoaded', () => {
  const currentRole = localStorage.getItem('skyInnRole') || 'customer';
  const currentUser = localStorage.getItem('skyInnUser') || 'Guest';

  const userBadge = document.querySelector('[data-user-badge]');
  if (userBadge) {
    userBadge.textContent = currentUser;
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const selectedRole = document.querySelector('input[name="role"]:checked')?.value || 'customer';
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value.trim();

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      const adminCredentials = email === 'admin@skyinn.com' && password === 'admin123';
      const customerCredentials = email === 'customer@skyinn.com' && password === 'customer123';

      if (selectedRole === 'admin' && !adminCredentials) {
        alert('Admin access denied. Use admin@skyinn.com / admin123');
        return;
      }

      if (selectedRole === 'customer' && !customerCredentials) {
        alert('Invalid customer login. Use customer@skyinn.com / customer123');
        return;
      }

      localStorage.setItem('skyInnRole', selectedRole);
      localStorage.setItem('skyInnUser', selectedRole === 'admin' ? 'Hotel Admin' : 'Sarah Johnson');
      window.location.href = selectedRole === 'admin' ? 'admin-dashboard.html' : 'welcome.html';
    });
  }

  const roomButtons = document.querySelectorAll('[data-room-book]');
  roomButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const roomName = button.dataset.roomName;
      const roomType = button.dataset.roomType;
      const price = Number(button.dataset.roomPrice || 0);

      localStorage.setItem('skyInnSelectedRoom', JSON.stringify({ roomName, roomType, price }));
      window.location.href = 'booking.html';
    });
  });

  const bookingSummary = document.querySelector('[data-booking-summary]');
  if (bookingSummary) {
    const roomData = JSON.parse(localStorage.getItem('skyInnSelectedRoom') || '{}');
    const roomName = roomData.roomName || 'Deluxe Suite';
    const price = Number(roomData.price || 280);
    const nights = 2;
    const total = price * nights + 60;

    const roomLabel = document.getElementById('selectedRoomName');
    const roomPrice = document.getElementById('selectedRoomPrice');
    const bookingTotal = document.getElementById('bookingTotal');

    if (roomLabel) roomLabel.textContent = roomName;
    if (roomPrice) roomPrice.textContent = 'RM ' + price.toFixed(2) + ' / night';
    if (bookingTotal) bookingTotal.textContent = 'RM ' + total.toFixed(2);
  }

  const paymentButton = document.getElementById('confirmPayment');
  if (paymentButton) {
    paymentButton.addEventListener('click', () => {
      localStorage.setItem('skyInnBookingStatus', 'confirmed');
      window.location.href = 'my-bookings.html';
    });
  }

  const detailCards = document.querySelectorAll('[data-role-link]');
  detailCards.forEach((card) => {
    card.addEventListener('click', () => {
      const target = card.dataset.roleLink;
      if (target === 'admin' && currentRole === 'customer') {
        alert('Access denied. Please sign in as an admin user.');
        return;
      }
      if (target === 'customer' && currentRole === 'admin') {
        alert('Admin is viewing the staff dashboard.');
      }
    });
  });
});
