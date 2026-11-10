const $ = (id) => document.getElementById(id);
const imageInput = $("imageInput"), dropZone = $("dropZone"), imagePreview = $("imagePreview");
const uploadEmpty = $("uploadEmpty"), removeImage = $("removeImage"), promptInput = $("prompt");
let selectedFile = null, imageData = null, toastTimer;
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3500)}
function setFile(file){
  if(!file)return;
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)){toast("Gunakan gambar PNG, JPG, atau WEBP.");return}
  if(file.size>10*1024*1024){toast("Ukuran gambar maksimal 10 MB.");return}
  selectedFile=file;const reader=new FileReader();
  reader.onload=()=>{imageData=reader.result;imagePreview.src=imageData;imagePreview.hidden=false;uploadEmpty.hidden=true;removeImage.hidden=false};
  reader.readAsDataURL(file);
}
imageInput.addEventListener("change",e=>setFile(e.target.files[0]));
["dragenter","dragover"].forEach(evt=>dropZone.addEventListener(evt,e=>{e.preventDefault();dropZone.classList.add("drag")}));
["dragleave","drop"].forEach(evt=>dropZone.addEventListener(evt,e=>{e.preventDefault();dropZone.classList.remove("drag")}));
dropZone.addEventListener("drop",e=>setFile(e.dataTransfer.files[0]));
removeImage.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();selectedFile=null;imageData=null;imageInput.value="";imagePreview.hidden=true;uploadEmpty.hidden=false;removeImage.hidden=true});
promptInput.addEventListener("input",()=> $("counter").textContent=`${promptInput.value.length} / 500`);
$("generateBtn").addEventListener("click",async()=>{
  if(!selectedFile){toast("Unggah gambar terlebih dahulu.");return}
  if(!promptInput.value.trim()){toast("Tulis motion prompt terlebih dahulu.");promptInput.focus();return}
  const btn=$("generateBtn");btn.disabled=true;btn.innerHTML="⟳ Mengirim permintaan...";
  try{
    const response=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:imageData,prompt:promptInput.value.trim(),aspectRatio:$("aspect").value,duration:Number($("duration").value)})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||"Layanan video belum dikonfigurasi.");
    if(data.videoUrl){$("previewStage").hidden=true;$("resultArea").hidden=false;$("resultArea").innerHTML="";const video=document.createElement("video");video.controls=true;video.src=data.videoUrl;video.playsInline=true;$("resultArea").append(video);const link=document.createElement("a");link.href=data.videoUrl;link.download="browiii-motion.mp4";link.textContent="↓ Download video";$("resultArea").append(link);$("engineStatus").textContent="Video siap"}
    else if(data.operationId){$("engineStatus").textContent="Sedang diproses";toast("Permintaan diterima. ID proses: "+data.operationId)}
    else throw new Error("Respons server belum berisi video.");
  }catch(err){toast(err.message);$("engineStatus").textContent="Belum terhubung"}
  finally{btn.disabled=false;btn.innerHTML='<span>✦</span> Generate video <span class="arrow">↗</span>'}
});
