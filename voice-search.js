(()=>{
  const input=document.getElementById('serviceSearch');
  if(!input) return;
  const wrap=input.parentElement;
  const btn=document.createElement('button');
  btn.type='button'; btn.id='voiceSearchBtn'; btn.className='voice-search-btn'; btn.title='البحث الصوتي'; btn.setAttribute('aria-label','البحث الصوتي'); btn.textContent='🎙️';
  wrap.appendChild(btn);
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){btn.disabled=true;btn.title='البحث الصوتي غير مدعوم في هذا المتصفح';return;}
  const recognition=new SpeechRecognition(); recognition.continuous=false; recognition.interimResults=false; recognition.maxAlternatives=1;
  const langMap={ar:'ar-MA',ary:'ar-MA',fr:'fr-FR',en:'en-US',es:'es-ES',pt:'pt-PT',de:'de-DE',it:'it-IT',nl:'nl-NL',ru:'ru-RU',kk:'kk-KZ',zh:'zh-CN',ja:'ja-JP',hi:'hi-IN',ko:'ko-KR',vi:'vi-VN',id:'id-ID',th:'th-TH',fil:'fil-PH',mt:'mt-MT',ga:'ga-IE',gd:'gd-GB'};
  function setLang(){recognition.lang=langMap[localStorage.getItem('khedma_lang')||'ary']||'en-US';}
  btn.addEventListener('click',()=>{setLang();try{recognition.start();btn.classList.add('listening');btn.textContent='🔴';}catch(e){}});
  recognition.onresult=e=>{input.value=e.results[0][0].transcript;input.dispatchEvent(new Event('input',{bubbles:true}));};
  recognition.onend=()=>{btn.classList.remove('listening');btn.textContent='🎙️';};
  recognition.onerror=()=>{btn.classList.remove('listening');btn.textContent='🎙️';};
})();
