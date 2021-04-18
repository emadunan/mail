document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  // By default, load the inbox
  load_mailbox("inbox");

  // When compose form submited
  document.querySelector("#compose-form").onsubmit = () => {
    fetch("/emails", {
      method: "POST",
      body: JSON.stringify({
        recipients: document.querySelector("#compose-recipients").value,
        subject: document.querySelector("#compose-subject").value,
        body: document.querySelector("#compose-body").value,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Print result
        console.log(result);
        load_mailbox("sent");
      });

    return false;
  };
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#email-view").style.display = "none";
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#email-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  // get mail box data from api
  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log(emails);

      // Display Emails according to it's mailbox
      emails.forEach((element) => {
        const el = document.createElement("div");
        element.read
          ? (el.style.backgroundColor = "#ffffff")
          : (el.style.backgroundColor = "#ebecf0");

        // Creating Mail child elements
        const el_sender = document.createElement("h5");
        el_sender.innerText = element.sender;

        const el_subject = document.createElement("p");
        el_subject.innerText = element.subject;

        const el_timestamp = document.createElement("p");
        el_timestamp.innerText = element.timestamp;

        // Appending child elements to the main Div
        if (mailbox === "sent") {
          const recipients = element.recipients;

          const el_recipients = document.createElement("div");

          recipients.forEach((recipient, i) => {
            const el_recipient = document.createElement("h6");
            el_recipient.style.margin = "0rem"
            el_recipient.innerText = recipients[i];
            el_recipients.append(el_recipient);
          });
          el.append(el_recipients);
          el.append(el_subject);
          el.append(el_timestamp);
        } else if (mailbox === "inbox" || mailbox === "archive") {
          el.append(el_sender);
          el.append(el_subject);
          el.append(el_timestamp);
        } else {
          console.log("Invalid Mailbox!");
        }

        // Adjust styles
        console.log(el.children);
        el.style.border = "solid blue 0.2rem";
        el.style.padding = "0.3rem";
        el.style.marginBottom = "0.5rem";
        el.style.display = "flex";
        el.style.alignItems = "center";

        el.childNodes.forEach((ch) => {
          ch.style.display = "inline";
          ch.style.marginBottom = "0rem";
        });

        chn = el.childNodes;
        chn[1].style.marginLeft = "1rem";
        chn[1].style.color = "#0000ff";

        chn[2].style.marginLeft = "auto";

        // Add event listener to the main element
        el.addEventListener("click", function () {
          console.log("This element has been clicked!");
          fetch(`/emails/${element.id}`)
            .then((response) => response.json())
            .then((email) => {
              // Print email
              console.log(email);

              // Clear last preview
              document.querySelector("#email-view").innerHTML = "";
              document.querySelector("#email-view").style.display = "block";
              document.querySelector("#emails-view").style.display = "none";

              // Show the selected email
              mailEl = document.createElement("div");

              mailEl_br = document.createElement("hr");

              mailEl_sender = document.createElement("h5");
              mailEl_sender.innerText = `From: ${email.sender}`;
              mailEl.append(mailEl_sender);

              mailEl_recipients = document.createElement("h6");
              mailEl_recipients.innerText = `To: ${email.recipients}`;
              mailEl.append(mailEl_recipients);

              mailEl_subject = document.createElement("h4");
              mailEl_subject.innerText = `Subject: ${email.subject}`;
              mailEl_subject.style.color = "#0000ff";
              mailEl.append(mailEl_subject);

              mailEl_body = document.createElement("p");
              mailEl_body.innerText = `${email.body}`;
              mailEl.append(mailEl_body);

              mailEl.append(mailEl_br);
              mailEl_timestamp = document.createElement("small");
              mailEl_timestamp.innerText = `${email.timestamp}`;
              mailEl.append(mailEl_timestamp);

              document.querySelector("#email-view").append(mailEl);
            });
        });

        // Add CSS Class to the main element
        el.classList.add("mail_element__list");

        document.querySelector("#emails-view").append(el);
      });
    });
}
