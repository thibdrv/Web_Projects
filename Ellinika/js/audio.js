/* ---------- audio ----------
   Every word, phrase and letter name has an id (the "a" field in data/greek-data.js).
   Its recording is audio/<id>.mp3, made by tools/make_audio.py. */
const AUDIO_DIR = "audio/";

/* the voice speed: normal, or slow (0.7) from the settings panel; kept in "gl-slow" */
let voiceRate = 1;
try{ if(localStorage.getItem("gl-slow")==="1") voiceRate = 0.7; }catch(e){}
function setVoiceSlow(slow){
  voiceRate = slow ? 0.7 : 1;
  try{ localStorage.setItem("gl-slow", slow ? "1" : "0"); }catch(e){}
  document.querySelectorAll("[data-speed-set]").forEach(b=>b.setAttribute("aria-pressed", (b.dataset.speedSet==="slow")===slow));
}
let el=null, settle=null;   // settle = ends the sound that is playing now
/* words you add yourself ("My difficulties") have no recording: the voice of the device reads them. sound id -> Greek text */
const OWN_TEXT = {};
/* sound id -> Greek text, for a recording that does not exist yet (the voices are made little by little): the voice of the device reads it instead */
const FALLBACK_TEXT = {};
const canSpeak = () => "speechSynthesis" in window && typeof SpeechSynthesisUtterance!=="undefined";
function stopSound(){
  if(settle) settle("stop");
  if(el) el.pause();
  if(canSpeak()) try{ speechSynthesis.cancel(); }catch(e){}
}
/* resolves "ok" when the file has played, "fail" if it can't be played, "stop" if cut short */
function playRec(k){
  return new Promise(resolve=>{
    if(settle) settle("stop");
    let over=false;
    const end=r=>{ if(over) return; over=true; if(settle===end) settle=null; document.dispatchEvent(new Event("gl-sound-end")); resolve(r); };
    settle=end; document.dispatchEvent(new Event("gl-sound-start"));
    if(OWN_TEXT[k]){
      if(!canSpeak()) return end("fail");
      try{
        speechSynthesis.cancel();
        const u=new SpeechSynthesisUtterance(OWN_TEXT[k]);
        u.lang="el-GR"; u.rate=voiceRate;
        u.onend=()=>end("ok"); u.onerror=()=>end("fail");
        speechSynthesis.speak(u);
      }catch(e){ end("fail"); }
      return;
    }
    try{
      if(!el) el=new Audio();
      el.pause();
      el.defaultPlaybackRate=voiceRate; el.playbackRate=voiceRate;
      el.onended=()=>end("ok");
      el.onerror=()=>{                                              /* no recording yet: the voice of the device, if the text is known */
        if(FALLBACK_TEXT[k] && canSpeak() && !over){
          try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(FALLBACK_TEXT[k]); u.lang="el-GR"; u.rate=voiceRate; u.onend=()=>end("ok"); u.onerror=()=>end("fail"); speechSynthesis.speak(u); return; }catch(e){}
        }
        end("fail");
      };
      el.src=AUDIO_DIR+k+".mp3";
      const p=el.play(); if(p&&p.catch) p.catch(()=>end("fail"));
    }catch(e){ end("fail"); }
  });
}

/* ----- what the rest of the app calls ----- */
function play(k){ playRec(k); }
/* plays the sounds one after the other; resolves when finished or cut short */
async function playSeq(keys){
  for(const k of keys){
    if(await playRec(k)!=="ok") return;
  }
}

/* ----- finding the sound of a text ----- */
/* Short fingerprint of a Greek text (FNV-1a). tools/make_audio.py computes the very same one. */
function sid(text){
  let h=0x811c9dc5;
  for(const b of new TextEncoder().encode(text.replace(/;/g,"").trim())){ h^=b; h=Math.imul(h,0x01000193)>>>0; }
  return h.toString(16).padStart(8,"0");
}
/* a Greek text, or {id: "sound name"} for words of the first category that already have one */
const soundId = t => typeof t==="object" ? t.id : sid(t);
/* one Greek text, or a list of texts played one after the other */
function say(text){
  const list = Array.isArray(text) ? text : [text];
  list.forEach(x=>{ if(typeof x==="string") FALLBACK_TEXT[sid(x)] = x.replace(/;/g,"").trim(); });
  if(Array.isArray(text)) playSeq(text.map(soundId)); else play(soundId(text));
}
/* letters data: a word without an "a" field uses the fingerprint of its text */
DATA.levels.forEach(L=>L.words.forEach(w=>{ w.a = w.a || sid(w.gr.replace(/;/g,"")); }));
DATA.alpha.forEach(a=>{ a.a = a.a || sid(a.name); });
