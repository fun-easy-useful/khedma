(()=>{
const cfg=window.KHEDMA_SUPABASE;if(!cfg||!window.supabase)return;
const client=window.supabase.createClient(cfg.url,cfg.publishableKey);window.KhedmaSupabase=client;
window.KhedmaVehiclesCloud={
 async list(){const {data,error}=await client.from('vehicles').select('*').eq('available',true).order('created_at',{ascending:false});if(error)throw error;return data||[];},
 async upload(file,vehicle){const {data:{user}}=await client.auth.getUser();if(!user)throw new Error('AUTH_REQUIRED');const ext=(file.name.split('.').pop()||'jpg').toLowerCase();const path=`${user.id}/${crypto.randomUUID()}.${ext}`;const up=await client.storage.from('vehicle-images').upload(path,file,{contentType:file.type||'image/jpeg',upsert:false});if(up.error)throw up.error;const image_url=client.storage.from('vehicle-images').getPublicUrl(path).data.publicUrl;const row={provider_id:user.id,image_path:path,image_url,vehicle_type:vehicle.type,price:Number(vehicle.price),currency:vehicle.currency,details:vehicle.details||'',available:true};const ins=await client.from('vehicles').insert(row).select().single();if(ins.error){await client.storage.from('vehicle-images').remove([path]);throw ins.error;}return ins.data;},
 async remove(id,imagePath){const {data:{user}}=await client.auth.getUser();if(!user)throw new Error('AUTH_REQUIRED');const del=await client.from('vehicles').delete().eq('id',id).eq('provider_id',user.id);if(del.error)throw del.error;if(imagePath)await client.storage.from('vehicle-images').remove([imagePath]);}
};
})();
