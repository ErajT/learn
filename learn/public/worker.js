console.log("Service Worker Loaded...");
// import logofornoti from "logofornoti";

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "./logofornoti.png"
  });
});