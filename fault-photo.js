(()=>{
const form=document.getElementById('requestForm'); if(!form)return;
const label=document.createElement('label'); label.innerHTML='📸 صورة العطل <span class="muted">(اختياري)</span><input id="faultPhoto" type="file" accept="image/*" capture="environment"><small id="faultPhotoHint" class="muted">صوّر العطل أو اختر صورة واضحة ليساعد مقدم الخدمة على فهم المشكلة.</small><div id="faultPreview"></div></label>;
const desc=form.querySelector('textarea'); if(desc)desc.parentNode.insertBefore(label,desc); else form.insertBefore(label,form.firstChild);
const input=label.querySelector('#faultPhoto'),preview=label.querySelector('#faultPreview');
input.addEventListener('change',()=>{preview.innerHTML='';const file=input.files&&input.files[0];if(!file)return; if(!file.type.startsWith('image/')){input.value='';return} const img=document.createElement('img');img.alt='معاينة صورة العطل';img.style.cssText='max-width:100%;max-height:260px;border-radius:12px;margin-top:10px;object-fit:cover';img.src=URL.createObjectURL(file);preview.appendChild(img);});
})();
