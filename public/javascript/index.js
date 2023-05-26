'use strict'
document.querySelector('.btn_form_submit').addEventListener('submit', (e) => {
    e.preventDefault();
});
// variable form for nodemailer in server
const form = document.getElementById('contactForm')
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  fetch("/send", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      alert(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("There was a problem sending your message. Please try again later.");
    });
});
