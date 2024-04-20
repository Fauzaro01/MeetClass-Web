const socket = io();

const msgerForm = get('.msger-inputarea');
const msgerInput = get('.msger-input');
const msgerChat = get('.msger-chat');

const PERSON_IMG = 'https://dummyimage.com/100x100/00ffd0/000000.png';
const MY_PROFILE = 'https://dummyimage.com/100x100/ffdd00/000c8c.png';
var userData;

socket.on('chatlog', (log) => {
    if (!log.senderUsername == userData.username) {
        appendMessage(
            log.senderUsername,
            PERSON_IMG,
            'left',
            log.message,
            log.timestamp
        );
    }
});

socket.on("warnUser", (data) => {
    if (socket.id == data.senderId) {
      Swal.fire({
        title: "Peringatan Spam!",
        text: "Anda telah melakukan spam! ",
        footer: "Harap tunggu 5 detik sebelum mengirim pesan lagi.",
        icon: "warning",
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
      });
    }
  });

document.addEventListener('DOMContentLoaded', async function () {
    await axios
        .get('/api/account')
        .then(function (response) {
            userData = response.data;
            appendMessage(
                'Welcomer BOT',
                'https://dummyimage.com/100x100/ff4242/000000.png',
                'left',
                `Hi ${userData.username}, Selamat datang di MeetClass! <br> Mari Bersosialiasi dan Mengobrol bersama. 😄`,
                1594949400000
            );
        })
        .catch(function (error) {
            console.log(error);
        });
});
msgerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const msgText = msgerInput.value;
    if (!msgText) return;
    appendMessage(
        userData.username,
        MY_PROFILE,
        'right',
        validator.escape(msgText),
        new Date().getTime()
    );
    socket.emit('chatlog', {
        senderUsername: userData.username,
        message: msgText,
        timestamp: new Date().getTime(),
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
      <div class="msg-info-time" data-timestamp="${waktu}">${formatChatTime(
        waktu
    )}</div>
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

function formatChatTime(timestamp) {
    const waktu = new Date(timestamp);
    const now = new Date();
    const timeDiff = now - waktu.getTime();

    // Menghitung perbedaan waktu dalam detik
    const seconds = Math.floor(timeDiff / 1000);

    if (seconds < 60) {
        return 'Baru saja';
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} menit yang lalu`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} jam yang lalu`;
    } else if (seconds < 2592000) {
        const days = Math.floor(seconds / 86400);
        return `${days} hari yang lalu`;
    } else {
        // Jika lebih dari sebulan, kembalikan format tanggal
        return waktu.toLocaleDateString('id-ID');
    }
}

function updateChatTime() {
    const timeElements = document.querySelectorAll('.msg-info-time');
    timeElements.forEach((element) => {
        const timestamp = new Date(parseInt(element.dataset.timestamp));
        const relativeTime = formatChatTime(timestamp);
        element.textContent = relativeTime;
    });
}

// Panggil fungsi updateChatTime setiap 30 detik
setInterval(updateChatTime, 30000); // 30.000 milidetik = 30 detik
