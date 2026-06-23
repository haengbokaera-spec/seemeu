const introScreen = document.getElementById("introScreen");
const chatScreen = document.getElementById("chatScreen");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const stopBtn = document.getElementById("stopBtn");
const reportBtn = document.getElementById("reportBtn");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const statusText = document.getElementById("statusText");

let isConnected = false;
let lastSentAt = 0;

const badWords = [
  "sex",
  "xxx",
  "địt",
  "dit",
  "lồn",
  "lon",
  "cặc",
  "cac",
  "đụ",
  "du"
];

function showChatScreen() {
  introScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
  findStranger();
}

function addSystemMessage(text) {
  const div = document.createElement("div");
  div.className = "system-message";
  div.textContent = text;
  messages.appendChild(div);
  scrollToBottom();
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  messages.appendChild(div);
  scrollToBottom();
}

function clearMessages() {
  messages.innerHTML = "";
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function containsBadWords(text) {
  const lower = text.toLowerCase();
  return badWords.some((word) => lower.includes(word));
}

function findStranger() {
  clearMessages();
  isConnected = false;
  statusText.textContent = "Đang tìm người lạ...";
  messageInput.disabled = true;

  addSystemMessage("Đang tìm người lạ để ghép chat...");

  setTimeout(() => {
    isConnected = true;
    statusText.textContent = "Đã kết nối với một người lạ";
    messageInput.disabled = false;
    messageInput.focus();

    clearMessages();
    addSystemMessage("Bạn đã được kết nối với một người lạ. Hãy bắt đầu bằng một lời chào.");
  }, 900);
}

function stopChat() {
  isConnected = false;
  statusText.textContent = "Đã dừng chat";
  messageInput.disabled = true;
  clearMessages();
  addSystemMessage("Bạn đã dừng cuộc trò chuyện. Bấm “Người khác” để tìm người mới.");
}

function reportUser() {
  addSystemMessage("Cảm ơn bạn đã báo cáo. Ở bước sau, báo cáo này sẽ được lưu vào hệ thống.");
}

function sendMessage(text) {
  const now = Date.now();

  if (!isConnected) {
    addSystemMessage("Bạn chưa kết nối với người lạ.");
    return;
  }

  if (now - lastSentAt < 900) {
    addSystemMessage("Bạn gửi hơi nhanh. Chờ một chút rồi gửi tiếp.");
    return;
  }

  if (text.length > 400) {
    addSystemMessage("Tin nhắn quá dài.");
    return;
  }

  if (containsBadWords(text)) {
    addSystemMessage("Tin nhắn có nội dung không phù hợp nên chưa được gửi.");
    return;
  }

  lastSentAt = now;
  addMessage(text, "me");

  setTimeout(() => {
    addMessage("Hiện tại đây là bản thử giao diện. Bước sau sẽ ghép người thật bằng Firebase.", "stranger");
  }, 600);
}

startBtn.addEventListener("click", showChatScreen);

nextBtn.addEventListener("click", () => {
  findStranger();
});

stopBtn.addEventListener("click", () => {
  stopChat();
});

reportBtn.addEventListener("click", () => {
  reportUser();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();

  if (!text) return;

  messageInput.value = "";
  sendMessage(text);
});
