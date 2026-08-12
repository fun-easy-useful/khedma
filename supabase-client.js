(()=>{
const SUPABASE_URL='https://lavzkptvyibvhtnrlity.supabase.co';
const SUPABASE_KEY='sb_publishable_TRFH58lsbfYLxwRih6tglQ_a2ESuXNK';
let clientPromise;
async function client(){if(!window.supabase)return null;if(!clientPromise)clientPromise=Promise.resolve(window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY));return clientPromise;}
window.KhedmaVehiclesCloud={
 async upload(file,data){const sb=await client();if(!sb)throw new Error('SUPABASE_CLIENT_MISSING');const {data:{user}}=await sb.auth.getUser();if(!user)throw new Error('AUTH_REQUIRED');const ext=(file.name.split('.').pop()||'jpg').toLowerCase();const path=`${user.id}/${crypto.randomUUID()}.${ext}`;const up=await sb.storage.from('vehicle-images').upload(path,file,{contentType:file.type||'image/jpeg',upsert:false});if(up.error)throw up.error;const pub=sb.storage.from('vehicle-images').getPublicUrl(path);const ins=await sb.from('vehicles').insert({provider_id:user.id,image_path:path,image_url:pub.data.publicUrl,vehicle_type:data.type,price:Number(data.price),currency:data.currency,details:data.details||'',available:true}).select().single();if(ins.error){await sb.storage.from('vehicle-images').remove([path]);throw ins.error;}return ins.data;},
 async list(){const sb=await client();if(!sb)throw new Error('SUPABASE_CLIENT_MISSING');const {data,error}=await sb.from('vehicles').select('*').eq('available',true).order('created_at',{ascending:false});if(error)throw error;return data||[];}
};
})();
