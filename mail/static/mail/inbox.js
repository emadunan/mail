document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // When compose form submited
  document.querySelector('#compose-form').onsubmit = () => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent')
      })

    return false;
  }
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // get mail box data from api
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // Display Emails according to it's mailbox
      emails.forEach(element => {

        const el = document.createElement('div');

        // Creating Mail child elements
        const el_sender = document.createElement('h5');
        el_sender.innerText = element.sender;

        const el_recipients = document.createElement('h5');
        el_recipients.innerText = element.recipients[0];

        const el_subject = document.createElement('p');
        el_subject.innerText = element.subject;

        const el_timestamp = document.createElement('p');
        el_timestamp.innerText = element.timestamp

        // Appending child elements to the main Div
        if (mailbox === 'sent') {
          el.append(el_recipients);
          el.append(el_subject);
          el.append(el_timestamp);
        } else if (mailbox === 'inbox') {
          el.append(el_sender);
          el.append(el_subject);
          el.append(el_timestamp);
        } else if (mailbox === 'archive') {
          el.append(el_sender);
          el.append(el_subject);
          el.append(el_timestamp);
        } else {
          console.log("Invalid Mailbox!")
        }

        // Adjust styles
        console.log(el.children);
        el.style.border = "solid blue 0.2rem";
        el.style.padding = "0.3rem";
        el.style.marginBottom = "0.5rem";
        el.style.display = "flex";
        el.style.alignItems = "center"

        el.childNodes.forEach(ch => {
          ch.style.display = "inline";
          ch.style.marginBottom = "0rem"
        });

        chn = el.childNodes;
        chn[1].style.marginLeft = "1rem";
        chn[1].style.color = "#0000ff";

        chn[2].style.marginLeft = "auto"


        document.querySelector('#emails-view').append(el);
      });

    });
}
