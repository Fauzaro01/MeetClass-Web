const socket = io();

socket.on('chatlog', (log) => {
    if (!log.pengirim == USERNAME) {
        appendMessage(log.pengirim, PERSON_IMG, 'left', log.pesan, log.waktu);
    }
    // console.log(log)
});

socket.on('disconnect', function () {
    console.log('Kamu terputus dari server.');
});

const msgerForm = get('.msger-inputarea');
const msgerInput = get('.msger-input');
const msgerChat = get('.msger-chat');

const BOT_IMG = 'https://dummyimage.com/100x100/ff4242/000000.png';
const PERSON_IMG = 'https://dummyimage.com/100x100/00ffd0/000000.png';
const MY_PROFILE = 'https://dummyimage.com/100x100/ffdd00/000c8c.png';
const USERNAME = document.cookie.split('; username=')[1];

msgerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(USERNAME, MY_PROFILE, 'right', msgText, new Date());
    socket.emit('chatlog', {
        pengirim: USERNAME,
        pesan: msgText,
        waktu: new Date(),
    });
    msgerInput.value = '';
});

function appendMessage(name, img, side, text, waktu) {
    //   Simple solution for small apps
    const msgHTML = `
<div class="msg ${side}-msg">
  <div class="msg-img" style="background-image: url(${img})"></div>

  <div class="msg-bubble">
    <div class="msg-info">
      <div class="msg-info-name">${name}</div>
      <div class="msg-info-time">${formatDate(waktu)}</div>
    </div>

    <div class="msg-text">${text}</div>
  </div>
</div>
`;

    msgerChat.insertAdjacentHTML('beforeend', msgHTML);
    msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const waktu = Date.parse(date);
    const objekWaktu = new Date(waktu);
    const h = '0' + objekWaktu.getHours();
    const m = '0' + objekWaktu.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}
