export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.OPENAI_API_KEY;
  if(!key) return res.status(503).json({error:'AI service is not configured'});
  try{
    const {image,language='ar'}=req.body||{};
    if(typeof image!=='string'||!image.startsWith('data:image/')) return res.status(400).json({error:'A valid image data URL is required'});
    if(image.length>7_000_000) return res.status(413).json({error:'Image is too large'});
    const langNames={ar:'Arabic',ary:'Moroccan Darija',en:'English',fr:'French',es:'Spanish',pt:'Portuguese',de:'German',it:'Italian',nl:'Dutch',ru:'Russian',kk:'Kazakh',zh:'Chinese',ja:'Japanese',hi:'Hindi',ko:'Korean',vi:'Vietnamese',id:'Indonesian',th:'Thai',fil:'Filipino',mt:'Maltese',ga:'Irish',gd:'Scottish Gaelic'};
    const languageName=langNames[language]||'English';
    const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model:'gpt-5',input:[{role:'user',content:[{type:'input_text',text:`Analyze this service/problem photo for Khedma. Reply ONLY as JSON with keys category, summary, urgency, suggested_service, safety_note. Use ${languageName}. Do not claim certainty. If the image is unclear, say so. Do not give dangerous repair instructions. category should be a short service/problem category. urgency should be low, medium, or high.`},{type:'input_image',image_url:image,detail:'auto'}]}]})});
    if(!response.ok){const detail=await response.text();console.error(detail);return res.status(502).json({error:'AI analysis failed'});}
    const data=await response.json();let text=data.output_text||'';let parsed;try{parsed=JSON.parse(text)}catch{const m=text.match(/\{[\s\S]*\}/);parsed=m?JSON.parse(m[0]):{category:'غير محدد',summary:text,urgency:'medium',suggested_service:'مقدم خدمة مختص',safety_note:'النتيجة تقديرية وليست تشخيصًا مؤكدًا.'};}
    return res.status(200).json(parsed);
  }catch(e){console.error(e);return res.status(500).json({error:'Unexpected server error'});}
}
