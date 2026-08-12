(()=>{
const form=document.getElementById('requestForm');const photo=document.getElementById('faultPhoto');if(!form||!photo)return;
const box=document.createElement('div');box.id='faultAiAnalysis';box.className='fault-ai-analysis';box.innerHTML='<button type="button" id="analyzeFaultBtn">🤖 تحليل العطل بالصورة</button><p id="faultAiResult" class="muted">سيساعد التحليل على اقتراح نوع العطل والخدمة المناسبة. النتيجة تقديرية وليست تشخيصًا مؤكدًا.</p>';
photo.closest('label')?.appendChild(box);
const result=box.querySelector('#faultAiResult');
box.querySelector('#analyzeFaultBtn').addEventListener('click',async()=>{
 const file=photo.files?.[0];if(!file){result.textContent='📸 أضف صورة للعطل أولًا.';return;}
 result.textContent='🔎 جارٍ تحليل الصورة...';
 // The production endpoint keeps the AI key on the server; never expose a secret key in browser code.
 try{const r=await fetch('/api/analyze-fault',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageName:file.name,imageType:file.type})});
 if(!r.ok)throw new Error('analysis unavailable');const data=await r.json();
 result.textContent=`🤖 ${data.category||'نوع العطل غير محدد'} — ${data.summary||'يرجى مراجعة مقدم الخدمة.'}`;
 }catch(e){result.textContent='ℹ️ التحليل الذكي سيصبح متاحًا بعد ربط خادم Khedma بخدمة رؤية بالذكاء الاصطناعي. لا يتم إرسال الصورة حاليًا.';}
});
})();
