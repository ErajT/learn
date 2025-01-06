console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "https://st4.depositphotos.com/4263287/23116/v/450/depositphotos_231160548-stock-illustration-work-hand-written-word-text.jpg"
  });
});