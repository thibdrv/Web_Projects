/* ---------- the "About" page (a link in the footer of the home page) ----------
   The texts are in index.html (section data-view="about"), translated like all the others.
   To show your name or a line of contact, fill the lines below: they appear on the page, and only if they are not empty.
   "mail" is the address of the "Found a bug or a mistake?" card. It is kept scrambled (base64), so that robots which read the code or the page
   do not find it: it is put together only when somebody taps a button (openMail). To change it, type btoa("you@example.com") in the console of the
   browser and paste the result below; to remove the contact, leave "" (the card and the links disappear). */
const ABOUT = {
  author: "",    /* for example "Made by Anna" */
  contact: "",   /* for example "Contact: see the About page" (do not write an address here: it would be public) */
  mail: "dGhpYmF1ZC5kZXJ2aWxsZUBvdXRsb29rLmZy",
  date: "09/11/26"      /* the date of the last update, day/month/year: change it at every update (there is no version number) */
};
/* the date as shown on the page: 09/11/26 -> 09/11/2026 */
const aboutDate = () => ABOUT.date.replace(/^(\d\d\/\d\d\/)(\d\d)$/, "$120$2");
const aboutEmail = () => { try{ return ABOUT.mail ? atob(ABOUT.mail) : ""; }catch(e){ return ""; } };
/* opens the mail program with a message to the author (the address is put together here, at the tap) */
function openMail(subject, body){
  const to = aboutEmail(); if(!to) return;
  location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + (body ? "&body=" + encodeURIComponent(body) : "");
}
/* the footer of the home page: the version and the "Report a mistake" link */
(function(){
  const v = $("footVer"); if(v) v.textContent = aboutDate();
  const m = $("footMail"); if(m){ m.href = "#about"; m.onclick = e=>{ if(ABOUT.mail){ e.preventDefault(); openMail("Elliniká: a bug or a mistake"); } }; }
})();
function openAbout(){
  $("aboutVersion").textContent = aboutDate();
  [["aboutWho", ABOUT.author], ["aboutContact", ABOUT.contact]].forEach(([id, text])=>{
    const p = $(id); p.textContent = text; p.hidden = !text;
  });
  $("aboutReview").href = "relecture-grec.html?lang=" + LANG;               /* the review sheet opens in the language of the app */
  const dev = document.querySelector(".about-dev"); dev.hidden = !ABOUT.mail;
  if(!ABOUT.mail) return;
  $("aboutMailText").textContent = tx("Write an e-mail");
  const mail = $("aboutMail"); mail.href = "#";
  mail.onclick = e=>{ e.preventDefault(); openMail(tx("Elliniká: a bug or a mistake")); };
  const copy = $("aboutCopy");
  copy.textContent = tx("Copy the address");
  copy.onclick = ()=>{
    const done = () => { copy.textContent = "✓ " + tx("Copied"); setTimeout(()=>{ copy.textContent = tx("Copy the address"); }, 2000); };
    try{ navigator.clipboard.writeText(aboutEmail()).then(done, ()=>{ copy.textContent = aboutEmail(); }); }catch(e){ copy.textContent = aboutEmail(); }
  };
}
