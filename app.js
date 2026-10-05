let db = {items:[],mods:[],traders:{locations:[],vendors:[],listings:[]},interactions:[],definitions:{},verification:[],reporting:{}};
let currentItemId = null;
let navigationStack = [];

const $ = id => document.getElementById(id);
const searchInput = $("searchInput"), categoryFilter = $("categoryFilter"), sourceFilter = $("sourceFilter");
const itemResults = $("itemResults"), resultCount = $("resultCount"), itemModal = $("itemModal"), modalBody = $("modalBody");

document.addEventListener("DOMContentLoaded", loadDatabase);

async function loadDatabase(){
  try{
    const names=["items","mods","traders","interactions","definitions","verification","reporting"];
    const data=await Promise.all(names.map(n=>fetch(`data/${n}.json`).then(r=>{if(!r.ok)throw new Error(`Could not load ${n}.json`);return r.json()})));
    names.forEach((n,i)=>db[n]=data[i]);
    initializeFilters();
    displayItems();
  }catch(e){
    console.error(e); resultCount.textContent="Database error"; itemResults.innerHTML=`<p>${escapeHtml(e.message)}</p>`;
  }
}

function initializeFilters(){
  categoryFilter.innerHTML='<option value="">All categories</option>';
  sourceFilter.innerHTML='<option value="">All sources</option>';
  [...new Set(db.items.map(x=>x.category).filter(Boolean))].sort().forEach(v=>categoryFilter.add(new Option(v,v)));
  [...new Set(db.items.map(getSourceName).filter(Boolean))].sort().forEach(v=>sourceFilter.add(new Option(v,v)));
}
function getSourceName(item){
  if(!item.source || item.source.modId==="vanilla") return "Vanilla DayZ";
  return db.mods.find(m=>m.id===item.source.modId)?.name || item.source.modId;
}
function findItem(id){return db.items.find(x=>x.id===id)}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function stateFor(entityType,entityId,dataPath){
  return db.verification.find(v=>v.entityType===entityType&&v.entityId===entityId&&v.dataPath===dataPath);
}
function marker(v){
  if(!v) return "";
  const icons={missing:"🛈",underReview:"✓",incorrect:"⚠︎"};
  if(!icons[v.state]) return "";
  const title=db.definitions.reliabilityStates[v.state]?.description||v.state;
  return `<span class="marker ${v.state}" title="${escapeHtml(title)}">${icons[v.state]}</span>`;
}
function valueHTML(value,entityType,entityId,dataPath){
  if(value===undefined||value===null||value==="") return "—";
  return `${escapeHtml(formatValue(value))}${marker(stateFor(entityType,entityId,dataPath))}`;
}
function formatValue(v){
  if(Array.isArray(v)) return v.join(", ");
  if(typeof v==="object") return JSON.stringify(v);
  return v;
}

function getFilteredItems(){
  const q=searchInput.value.trim().toLowerCase(), cat=categoryFilter.value, src=sourceFilter.value;
  return db.items.filter(item=>{
    const hay=[item.name,item.category,item.subcategory,getSourceName(item),...(item.tags||[])].filter(Boolean).join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(!cat||item.category===cat)&&(!src||getSourceName(item)===src);
  });
}

/* Identical displayed names are collapsed only for list presentation.
   The underlying records remain separate and retain their own IDs. */
function groupByName(items){
  const map=new Map();
  items.forEach(item=>{
    const key=item.name;
    if(!map.has(key))map.set(key,[]);
    map.get(key).push(item);
  });
  return [...map.values()];
}

function displayItems(){
  const groups=groupByName(getFilteredItems());
  resultCount.textContent=`${groups.length} displayed item${groups.length===1?"":"s"} • ${getFilteredItems().length} records`;
  itemResults.innerHTML=groups.map(group=>{
    const first=group[0], source=[...new Set(group.map(getSourceName))].join(", ");
    const cats=[...new Set(group.map(x=>x.category).filter(Boolean))].join(", ");
    const count=group.length>1?`<span class="badge">${group.length} listings/records</span>`:"";
    return `<article class="item-card" data-name="${escapeHtml(first.name)}" onclick='openGroup(${JSON.stringify(group.map(x=>x.id))})'>
      <h3>${escapeHtml(first.name)}</h3>
      <div class="meta">${escapeHtml(cats)} • ${escapeHtml(source)}</div>
      ${count}
      ${group.some(x=>x.inventory?.dimensions)?`<span class="badge">${escapeHtml(group[0].inventory?.dimensions||"")}</span>`:""}
      ${group.some(x=>x.category==="Currency")?`<span class="badge">Currency</span>`:""}
    </article>`;
  }).join("")||"<p>No matching items.</p>";
}

function openGroup(ids){
  if(ids.length===1){openItem(ids[0],false);return;}
  const groups=ids.map(findItem).filter(Boolean);
  modalBody.innerHTML=`<div class="detail-header"><h2>${escapeHtml(groups[0].name)}</h2><p>${groups.length} individual records share this exact displayed name.</p></div>
    <section class="detail-section"><h3>Collapsed player view</h3><div class="detail-grid">
      <div class="detail-row"><strong>Records</strong>${groups.length}</div>
      <div class="detail-row"><strong>Sources</strong>${escapeHtml([...new Set(groups.map(getSourceName))].join(", "))}</div>
    </div></section>
    <section class="detail-section"><h3>Individual records</h3>
      ${groups.map((x,i)=>`<details class="group"><summary>Record ${i+1}</summary><div class="group-body"><button class="related-item" data-item-id="${x.id}">Open ${escapeHtml(x.name)} record</button></div></details>`).join("")}
    </section>`;
  showModal();
}
function openItem(id,push=true){
  const item=findItem(id); if(!item)return;
  if(push&&currentItemId)navigationStack.push(currentItemId);
  currentItemId=id;
  renderItem(item);
  showModal();
}
function showModal(){itemModal.classList.add("visible");itemModal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeModal(){itemModal.classList.remove("visible");itemModal.setAttribute("aria-hidden","true");document.body.style.overflow="";currentItemId=null;navigationStack=[]}

function renderItem(item){
  const traderListings=db.traders.listings.filter(x=>x.itemId===item.id);
  const relationships=[];
  (item.firearm?.validMagazines||[]).forEach(id=>relationships.push(["Uses magazine",id]));
  (item.magazine?.validAmmo||[]).forEach(id=>relationships.push(["Accepts ammunition",id]));
  (item.attachmentPoints||[]).forEach(p=>(p.accepts?.itemIds||[]).forEach(id=>relationships.push([p.name,id])));
  const reverse=[];
  db.items.forEach(other=>{
    (other.firearm?.validMagazines||[]).includes(item.id)&&reverse.push(["Magazine used by",other.id]);
    (other.magazine?.validAmmo||[]).includes(item.id)&&reverse.push(["Ammunition accepted by",other.id]);
    (other.attachmentPoints||[]).forEach(p=>(p.accepts?.itemIds||[]).includes(item.id)&&reverse.push([`${p.name} on ${other.name}`,other.id]));
  });
  modalBody.innerHTML=`<div class="detail-header"><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.category||"Uncategorized")} • ${escapeHtml(getSourceName(item))}</p></div>
    ${buildCoreSection(item)}
    ${buildTraderSection(traderListings)}
    ${buildAttachmentSection(item)}
    ${buildRelationshipSection(relationships,reverse)}
    ${buildNotesSection(item)}`;
}
function buildCoreSection(item){
  const rows=[];
  rows.push(`<div class="detail-row"><strong>Source</strong>${valueHTML(getSourceName(item),"item",item.id,"source")}</div>`);
  if(item.subcategory)rows.push(`<div class="detail-row"><strong>Subcategory</strong>${valueHTML(item.subcategory,"item",item.id,"subcategory")}</div>`);
  if(item.inventory?.dimensions)rows.push(`<div class="detail-row"><strong>Inventory dimensions</strong>${valueHTML(item.inventory.dimensions,"item",item.id,"inventory.dimensions")}</div>`);
  if(item.inventory?.size)rows.push(`<div class="detail-row"><strong>Storage size</strong>${valueHTML(item.inventory.size,"item",item.id,"inventory.size")}</div>`);
  if(item.inventory?.maxStack!==undefined)rows.push(`<div class="detail-row"><strong>Max stack</strong>${valueHTML(item.inventory.maxStack,"item",item.id,"inventory.maxStack")}</div>`);
  if(item.currency)rows.push(`<div class="detail-row"><strong>Currency value</strong>${valueHTML(item.currency.value,"item",item.id,"currency.value")}</div>`);
  if(item.clothing)rows.push(`<div class="detail-row"><strong>Equipment slot</strong>${valueHTML(item.clothing.slot,"item",item.id,"clothing.slot")}</div><div class="detail-row"><strong>Insulation</strong>${valueHTML(item.clothing.insulation+" Insulation","item",item.id,"clothing.insulation")}</div>`);
  if(item.firearm?.caliber)rows.push(`<div class="detail-row"><strong>Caliber</strong>${valueHTML(item.firearm.caliber,"item",item.id,"firearm.caliber")}</div>`);
  if(item.magazine?.capacity!==undefined)rows.push(`<div class="detail-row"><strong>Magazine capacity</strong>${valueHTML(item.magazine.capacity,"item",item.id,"magazine.capacity")}</div>`);
  return `<section class="detail-section"><h3>Core information</h3><div class="detail-grid">${rows.join("")}</div></section>`;
}
function buildTraderSection(listings){
  if(!listings.length)return "";
  const vendors=listings.map(l=>({l,v:db.traders.vendors.find(v=>v.id===l.vendorId),locs:db.traders.vendors.find(v=>v.id===l.vendorId)?.locations||[]}));
  return `<section class="detail-section"><h3>Trader listings</h3>${vendors.map(({l,v,locs})=>`<div class="group"><div class="group-body">
    <strong>${escapeHtml(v?.name||l.vendorId)}</strong> • ${escapeHtml(locs.map(id=>db.traders.locations.find(x=>x.id===id)?.name||id).join(", "))} • ${escapeHtml(l.menuCategory)}
    <div class="detail-grid" style="margin-top:8px">
      <div class="detail-row"><strong>Buy</strong>${l.buy===undefined?"—":valueHTML(l.buy,"traderListing",l.id,"buy")}</div>
      <div class="detail-row"><strong>Sell</strong>${l.sell===undefined?"—":valueHTML(l.sell,"traderListing",l.id,"sell")}</div>
    </div>
    ${l.notes?.length?`<p class="meta">${escapeHtml(l.notes.join(" "))}</p>`:""}
  </div></div>`).join("")}</section>`;
}
function buildAttachmentSection(item){
  if(!item.attachmentPoints?.length)return "";
  return `<section class="detail-section"><h3>Attachment / storage points</h3>${item.attachmentPoints.map(p=>`<div class="group"><summary>${escapeHtml(p.name)}</summary><div class="group-body">
    ${p.accepts?.rule?`<div class="meta">Acceptance rule: ${escapeHtml(p.accepts.rule)}</div>`:""}
    <div class="related-list">${(p.accepts?.itemIds||[]).map(id=>{const x=findItem(id);return x?`<button class="related-item" data-item-id="${x.id}">${escapeHtml(x.name)}</button>`:""}).join("")||'<span class="meta">No current example recorded.</span>'}</div>
    ${p.notes?.length?`<p class="meta">${escapeHtml(p.notes.join(" "))}</p>`:""}
  </div></div>`).join("")}</section>`;
}
function buildRelationshipSection(rels,reverse){
  if(!rels.length&&!reverse.length)return "";
  const make=(label,id)=>{const x=findItem(id);return x?`<div><span class="meta">${escapeHtml(label)}:</span> <button class="related-item" data-item-id="${x.id}">${escapeHtml(x.name)}</button></div>`:""};
  return `<section class="detail-section"><h3>Relationships</h3><div class="related-list">${rels.map(([l,id])=>make(l,id)).join("")}${reverse.map(([l,id])=>make(l,id)).join("")}</div></section>`;
}
function buildNotesSection(item){
  if(!item.notes?.length)return "";
  return `<section class="detail-section"><h3>Notes</h3><ul>${item.notes.map(n=>`<li>${escapeHtml(n)}</li>`).join("")}</ul></section>`;
}

$("modalClose").addEventListener("click",closeModal);
$("modalBackground").addEventListener("click",closeModal);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-item-id]");
  if(!b)return;
  const id=b.dataset.itemId;
  if(currentItemId)navigationStack.push(currentItemId);
  openItem(id,false);
});
searchInput.addEventListener("input",displayItems);
categoryFilter.addEventListener("change",displayItems);
sourceFilter.addEventListener("change",displayItems);

$("reportLink").addEventListener("click",()=>{
  if(db.reporting.formUrl){
    window.open(db.reporting.formUrl,"_blank","noopener");
  }else{
    alert("Reporting is architecturally enabled, but the final Google Form URL has not been added yet. Set data/reporting.json → formUrl when the form is ready.");
  }
});
