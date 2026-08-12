export default {
  async fetch(request, env) {
    const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
    if(request.method==='OPTIONS') return new Response(null,{headers:cors});
    if(request.method!=='POST') return Response.json({error:'Method not allowed'},{status:405,headers:cors});
    if(!env.OPENAI_API_KEY) return Response.json({error:'AI service is not configured'},{status:503,headers:cors});
    try{
      const body=await request.json();
      const image=body?.image, language=body?.language||'en';
      if(typeof image!=='string'||!image.startsWith('data:image/')) return Response.json({error:'A valid image is required'},{status:400,headers:cors});
      if(image.length>7_000_000) return Response.json({error:'Image is too large'},{status:413,headers:cors});
      const names={ar:'Arabic',ary:'Moroccan Darija',en:'English',fr:'French',es:'Spanish',pt:'Portuguese',de:'German',it:'Italian',nl:'Dutch',ru:'Russian',kk:'Kazakh',zh:'Chinese',ja:'Japanese',hi:'Hindi',ko:'Korean',vi:'Vietnamese',id:'Indonesian',th:'Thai',fil:'Filipino',mt:'Maltese',ga:'Irish',gd:'Scottish Gaelic'};
      const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${env.OPENAI_API_KEY}`},body:JSON.stringify({model:'gpt-5',input:[{role:'user',content:[{type:'input_text',text:`Analyze this Khedma service-problem photo. Reply ONLY valid JSON with keys category,summary,urgency,suggested_service,safety_note. Write in ${names[language]||'English'}. Be uncertain when the image is unclear. Do not provide dangerous repair instructions. urgency must be low, medium, or high.`},{type:'input_image',image_url:image,detail:'auto'}]}]})});
      if(!response.ok)return Response.json({error:'AI analysis failed'},{status:502,headers:cors});
      const data=await response.json();let text=data.output_text||'';let parsed;
      try{parsed=JSON.parse(text)}catch{const m=text.match(/\{[\s\S]*\}/);parsed=m?JSON.parse(m[0]):{category:'غير محدد',summary:text,urgency:'medium',suggested_service:'مقدم خدمة مختص',safety_note:'النتيجة تقديرية وليست تشخيصًا مؤكدًا.'};}
      return Response.json(parsed,{headers:{...cors,'Content-Type':'application/json'}});
    }catch(e){return Response.json({error:'Unexpected server error'},{status:500,headers:cors});}
  }
};
