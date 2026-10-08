let db={items:[],mods:[],traders:{locations:[],vendors:[],listings:[]},interactions:[],definitions:{},verification:[],reporting:{}};
let currentView="database",detailReturnView="database",currentDetailId=null;
let traderBrowse={location:"",vendor:"",category:""};
let tooltipTimer=null;
let activeTooltipTarget=null;
const appTooltip=document.createElement("div");
appTooltip.className="app-tooltip";
appTooltip.setAttribute("role","tooltip");
appTooltip.setAttribute("aria-hidden","true");
document.addEventListener("DOMContentLoaded",()=>document.body.appendChild(appTooltip));
const $=id=>document.getElementById(id);
const searchInput=$("searchInput"),modFilter=$("modFilter"),itemResults=$("itemResults"),resultCount=$("resultCount");

function pushHistory(state){history.pushState(state,"",location.pathname+location.search+location.hash)}
window.addEventListener("popstate",event=>{
  const state=event.state;
  if(!state){showView("database");displayItems();return}
  if(state.view==="detail"){
    const item=findItem(state.id);
    if(item){currentDetailId=state.id;detailReturnView=state.returnView||"database";renderDetailPage(item,state.focusAttachment);showView("detail");return}
  }
  if(state.view==="trader"){
    if(state.location)traderBrowse.location=state.location;
    if(state.vendor)traderBrowse.vendor=state.vendor;
    if(state.category!==undefined)traderBrowse.category=state.category;
    showView("trader");renderTraderBrowser(state.focusItemId||null,state.focusListingId||null);return;
  }
  showView("database");displayItems();
});

document.addEventListener("DOMContentLoaded",loadDatabase);
async function loadDatabase(){
  try{
    const names=["items","mods","traders","interactions","definitions","verification","reporting"];
    const data=await Promise.all(names.map(n=>fetch(`data/${n}.json`).then(r=>{if(!r.ok)throw Error(`Could not load ${n}.json`);return r.json()})));
    names.forEach((n,i)=>db[n]=data[i]);
    initializeFilters();
    initializeTraderBrowser();
    wireNavigation();
    history.replaceState({view:"database"},"",location.href);
    displayItems();
    showView("database");
  }catch(e){console.error(e);resultCount.textContent="Database error";itemResults.innerHTML=`<div class="empty-state">${escapeHtml(e.message)}</div>`}
}
function wireNavigation(){
  $("siteHome").addEventListener("click",()=>{pushHistory({view:"database"});showView("database");displayItems()});
  $("databaseViewButton").addEventListener("click",()=>{pushHistory({view:"database"});showView("database");displayItems()});
  $("traderViewButton").addEventListener("click",()=>{pushHistory({view:"trader",location:traderBrowse.location,vendor:traderBrowse.vendor,category:traderBrowse.category});showView("trader");renderTraderBrowser()});
  $("backToDatabase").addEventListener("click",()=>{pushHistory({view:"database"});showView("database");displayItems()});
  $("detailBack").addEventListener("click",()=>{if(history.state?.view==="detail")history.back();else{showView(detailReturnView);detailReturnView==="database"?displayItems():renderTraderBrowser()}});
  $("clearFilters").addEventListener("click",()=>{searchInput.value="";modFilter.value="";setCategoryFilter("")});
  $("reportLink").addEventListener("click",()=>openReport({entityType:"site",entityId:"database",path:"general"}));
  searchInput.addEventListener("input",displayItems);
  modFilter.addEventListener("change",displayItems);
  document.addEventListener("click",handleGlobalClick);
}
function showView(view){
  currentView=view;
  $("databaseView").classList.toggle("hidden",view!=="database");
  $("traderView").classList.toggle("hidden",view!=="trader");
  $("detailView").classList.toggle("hidden",view!=="detail");
  $("databaseViewButton").classList.toggle("active",view==="database");
  $("traderViewButton").classList.toggle("active",view==="trader");
  if(view!=="detail")window.scrollTo({top:0,behavior:"smooth"});
}
function initializeFilters(){
  modFilter.innerHTML='<option value="">All mods</option>';
  [...new Set(db.items.map(getModName).filter(Boolean))].sort().forEach(v=>modFilter.add(new Option(v,v)));
  renderCategoryExplorer();
}

/* ---------- Item category browser ---------- */
function getBrowseTaxonomy(){return db.definitions.browseTaxonomy||[]}
function itemMatchesBrowseRule(item,rule={}){
  if(rule.categories?.length&&!rule.categories.includes(item.category))return false;
  if(rule.subcategories?.length&&!rule.subcategories.includes(item.subcategory||""))return false;
  if(rule.excludeSubcategories?.length&&rule.excludeSubcategories.includes(item.subcategory||""))return false;
  if(rule.slots?.length){const slots=[item.clothing?.slot,...(item.equipment?.slots||[])].filter(Boolean);if(!rule.slots.some(s=>slots.includes(s)))return false}
  if(rule.nameIncludes?.length&&!rule.nameIncludes.some(v=>item.name.toLowerCase().includes(v.toLowerCase())))return false;
  return true;
}
function collectBrowseRuleItems(node){
  if(node.children?.length){const found=[];node.children.forEach(child=>found.push(...collectBrowseRuleItems(child)));return [...new Map(found.map(x=>[x.id,x])).values()]}
  return node.match?db.items.filter(item=>itemMatchesBrowseRule(item,node.match)):[];
}
function getBrowseNodeItems(node){return collectBrowseRuleItems(node)}
function findBrowseNode(id,nodes=getBrowseTaxonomy()){
  if(!id)return null;
  for(const node of nodes){if(node.id===id)return node;const found=node.children&&findBrowseNode(id,node.children);if(found)return found}
  return null;
}
function findBrowsePath(id,nodes=getBrowseTaxonomy(),trail=[]){
  if(!id)return [];
  for(const node of nodes){
    const next=[...trail,node];
    if(node.id===id)return next;
    if(node.children){const found=findBrowsePath(id,node.children,next);if(found.length)return found}
  }
  return [];
}
function getBrowsePathsForItem(item,nodes=getBrowseTaxonomy(),trail=[]){
  const paths=[];
  for(const node of nodes){
    const next=[...trail,node];
    if(node.children){
      const childPaths=getBrowsePathsForItem(item,node.children,next);
      paths.push(...childPaths);
    }else if(node.match&&itemMatchesBrowseRule(item,node.match)){
      paths.push(next);
    }
  }
  return paths;
}
function renderCategoryExplorer(selectedCategory=""){
  const root=$("categoryExplorer"),taxonomy=getBrowseTaxonomy();
  const selectedPath=findBrowsePath(selectedCategory);
  const openIds=new Set(selectedPath.slice(0,-1).map(n=>n.id));
  const nodeMarkup=node=>{
    const ids=getBrowseNodeItems(node).map(x=>x.id);
    if(!ids.length)return "";
    const selected=selectedCategory===node.id;
    if(node.children?.length){
      const children=node.children.map(nodeMarkup).filter(Boolean).join("");
      if(!children)return "";
      return `<details class="browse-node" data-node-id="${escapeHtml(node.id)}" ${openIds.has(node.id)||selected?"open":""}><summary class="${selected?"selected":""}" data-browse-node="${escapeHtml(node.id)}">${escapeHtml(node.label)}</summary><div class="browse-children">${children}</div></details>`;
    }
    return `<button class="tree-leaf ${selected?"selected":""}" data-browse-node="${escapeHtml(node.id)}">${escapeHtml(node.label)}</button>`;
  };
  root.innerHTML=taxonomy.map(nodeMarkup).filter(Boolean).join("");
}
function setCategoryFilter(category){
  searchInput.dataset.category=category||"";
  renderCategoryExplorer(category||"");
  displayItems();
}
function getCategoryFilter(){return{category:searchInput.dataset.category||""}}

/* ---------- General item helpers ---------- */
function getModName(item){if(!item.source||item.source.modId==="vanilla")return"Vanilla";return db.mods.find(m=>m.id===item.source.modId)?.name||item.source.modId}
function findItem(id){return db.items.find(x=>x.id===id)}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function stateFor(entityType,entityId,dataPath){return db.verification.find(v=>v.entityType===entityType&&v.entityId===entityId&&v.dataPath===dataPath)}
function infoIcon(text){return `<span class="marker informational" data-tooltip="${escapeHtml(text)}" aria-label="${escapeHtml(text)}" tabindex="0">ⓘ</span>`}
function unavailableIcon(action){const text=`Trader does not ${action} this item.`;return `<span class="unavailable-symbol" data-tooltip="${escapeHtml(text)}" aria-label="${escapeHtml(text)}" tabindex="0">❌</span>`}
function marker(entityType,entityId,dataPath,missing=false){
  const v=stateFor(entityType,entityId,dataPath);let state=v?.state;if(missing&&!state)state="missing";
  if(!state||state==="confirmed")return"";
  const states=db.definitions.reliabilityStates||{};const text=states[state]?.description||state;
  const icon=state==="notApplicable"?"❌":(state==="inferred"||state==="informational"||state==="underReview"||state==="corrected"?"ⓘ":"⚠");
  return `<button class="marker ${escapeHtml(state)}" data-tooltip="${escapeHtml(text)}" aria-label="${escapeHtml(states[state]?.display||state)}" data-report="1" data-entity-type="${escapeHtml(entityType)}" data-entity-id="${escapeHtml(entityId)}" data-path="${escapeHtml(dataPath)}">${icon}</button>`;
}
function modValueHTML(item){
  const raw=item?.source?.modId;
  if(!raw||raw==="unknown")return `<span>Unknown</span>${marker("item",item.id,"source.modId",true)}`;
  return valueHTML(getModName(item),"item",item.id,"source.modId");
}
function valueHTML(value,entityType,entityId,dataPath){const missing=value===undefined||value===null||value==="";if(missing)return `<span class="missing-value">Missing</span>${marker(entityType,entityId,dataPath,true)}`;return `${escapeHtml(formatValue(value))}${marker(entityType,entityId,dataPath)}`}
function formatValue(v){if(Array.isArray(v))return v.join(", ");if(typeof v==="object")return JSON.stringify(v);return v}
function uniqueValues(values){return[...new Set(values.filter(v=>v!==undefined&&v!==null&&v!==""))]}
function getItemListings(item){return db.traders.listings.filter(x=>x.itemId===item.id)}
function getGroupListings(group){const ids=new Set(group.map(x=>x.id));return db.traders.listings.filter(x=>ids.has(x.itemId))}
function getListingPriceSummary(listings,field){const values=listings.map(l=>l[field]).filter(v=>v!==undefined&&v!==null);const missingCount=listings.length-values.length;if(!values.length)return missingCount?{values:[],counts:[],unique:0,minimum:null,maximum:null,missingCount}:null;const counts=new Map();values.forEach(v=>counts.set(v,(counts.get(v)||0)+1));const ordered=[...counts.entries()].sort((a,b)=>a[0]-b[0]);return{values,counts:ordered,unique:ordered.length,minimum:Math.min(...values),maximum:Math.max(...values),missingCount}}
function formatPriceList(summary){return summary.counts.map(([price,count])=>`${count>1?`${count} at `:""}${Number(price).toLocaleString()}`).join(", ")}
function listingLocationNames(listing){const v=db.traders.vendors.find(x=>x.id===listing.vendorId);return(v?.locations||[]).map(id=>db.traders.locations.find(x=>x.id===id)?.name||id)}
function listingLabel(listing){const v=db.traders.vendors.find(x=>x.id===listing.vendorId);return `${v?.name||listing.vendorId} • ${listing.menuCategory||""}`}
function getTraderSummary(item){const listings=getItemListings(item);if(!listings.length)return null;return{listings,buy:getListingPriceSummary(listings,"buy"),sell:getListingPriceSummary(listings,"sell")}}

/* ---------- Item filtering / rows ---------- */
function getFilteredItems(){
  const q=searchInput.value.trim().toLowerCase(),mod=modFilter.value,{category}=getCategoryFilter();
  const browseNode=category?findBrowseNode(category):null,allowed=browseNode?new Set(getBrowseNodeItems(browseNode).map(x=>x.id)):null;
  return db.items.filter(item=>{
    const hay=[item.name,item.category,item.subcategory,getModName(item),...(item.properties||[])].filter(Boolean).join(" ").toLowerCase();
    return(!q||hay.includes(q))&&(!allowed||allowed.has(item.id))&&(!mod||getModName(item)===mod);
  });
}
function groupByName(items){const map=new Map();items.forEach(i=>{if(!map.has(i.name))map.set(i.name,[]);map.get(i.name).push(i)});return[...map.values()]}
function displayItems(){const records=getFilteredItems(),groups=groupByName(records);resultCount.textContent=`${groups.length} displayed item${groups.length===1?"":"s"} • ${records.length} records`;itemResults.innerHTML=groups.map(renderItemRow).join("")||`<div class="empty-state">No matching items.</div>`}
function classificationLabel(item){
  const paths=getBrowsePathsForItem(item);
  if(paths.length)return paths[0].slice(1).map(n=>n.label).join("/");
  const subMap={Rifles:"Rifle",Sidearms:"Sidearm",Shotguns:"Shotgun","Submachine Guns":"Submachine Gun","Sniper Rifles":"Sniper Rifle","Hats & Caps":"Hat / Cap",Helmets:"Helmet","Shoes & Boots":"Shoe / Boot","Jackets & Coats":"Jacket / Coat","Hoodies & Sweater":"Hoodie / Sweater",Optics:"Optic",Supressors:"Suppressor",Grenades:"Grenade","Tackle and Knifes":"Tackle / Fishing Tool"};
  return(item.category||"Uncategorized")+(item.subcategory?`/${subMap[item.subcategory]||item.subcategory}`:"");
}
function classificationHTML(item){
  const paths=getBrowsePathsForItem(item);
  if(!paths.length)return escapeHtml(classificationLabel(item));
  const first=paths[0].map(n=>n.label).join("/");
  if(paths.length===1)return escapeHtml(first);
  const alternatives=paths.slice(1).map(p=>p.map(n=>n.label).join("/")).filter((v,i,a)=>v!==first&&a.indexOf(v)===i);
  const tip=`This item appears in multiple categories. You will also find it under:\n${alternatives.join("\n")}`;
  return `${escapeHtml(first)} ${infoIcon(tip)}`;
}
function getMaxMagazineCapacity(item){const ids=item.firearm?.validMagazines||[];const caps=ids.map(findItem).map(x=>x?.magazine?.capacity).filter(v=>typeof v==='number');return caps.length?Math.max(...caps):null}
function primaryFactsHTML(item){
  const facts=[];
  if(item.firearm){
    facts.push(item.firearm.caliber?`Caliber ${escapeHtml(item.firearm.caliber)}`:`Caliber ${marker("item",item.id,"firearm.caliber",true)}`);
    const maxMag=getMaxMagazineCapacity(item);if(maxMag!==null)facts.push(`Mag ${maxMag}`);
  }
  if(item.magazine){facts.push(item.magazine.capacity!==undefined?`Capacity ${item.magazine.capacity}${marker("item",item.id,"magazine.capacity")}`:`Capacity ${marker("item",item.id,"magazine.capacity",true)}`);}
  if(item.ballistics){
    if(item.ballistics.damage!==undefined)facts.push(`Damage ${item.ballistics.damage}${marker("item",item.id,"ballistics.damage")}`);
    else facts.push(`Damage ${marker("item",item.id,"ballistics.damage",true)}`);
    if(item.ballistics.shock!==undefined&&item.ballistics.shock!==0)facts.push(`Shock ${item.ballistics.shock}${marker("item",item.id,"ballistics.shock")}`);
  }
  if(item.clothing){facts.push(item.clothing.slot?`Slot ${escapeHtml(item.clothing.slot)}`:`Slot ${marker("item",item.id,"clothing.slot",true)}`);if(item.clothing.insulation!==undefined)facts.push(`${escapeHtml(item.clothing.insulation)} insulation${marker("item",item.id,"clothing.insulation")}`);}
  if(item.inventory?.size)facts.push(`Storage ${escapeHtml(item.inventory.size)}`);
  else if(['Backpack','Bag','Pouch','Container','Storage'].includes(item.category))facts.push(`Storage ${marker("item",item.id,"inventory.size",true)}`);
  if(item.vehicle?.totalPossibleStorage!==undefined||item.vehicle?.storageSlots!==undefined)facts.push(`Storage ${item.vehicle.totalPossibleStorage??item.vehicle.storageSlots}`);
  if(item.vehicle?.maxOccupancy!==undefined)facts.push(`Seats ${item.vehicle.maxOccupancy}`);
  if(item.inventory?.maxStack!==undefined&&item.category==='Ammunition')facts.push(`Stack ${item.inventory.maxStack}`);
  return facts.slice(0,3);
}
function priceText(summary){return summary?(summary.minimum===summary.maximum?Number(summary.minimum).toLocaleString():`${Number(summary.minimum).toLocaleString()}–${Number(summary.maximum).toLocaleString()}`):null}
function priceInfo(summary,label,action){if(!summary)return label?`${label}: ${unavailableIcon(action)}`:unavailableIcon(action);const value=summary.values.length?priceText(summary):unavailableIcon(action);const mixed=summary.missingCount>0&&summary.values.length?` ${unavailableIcon(action)}`:"";return label?`${label}: ${value}${mixed}`:`${value}${mixed}`}
function mainLineTrader(item,listings){
  if(!listings.length)return `<span class="trader-inline"><span class="trader-label">Trader Info</span> ${marker("item",item.id,"availability.trader",true)}</span>`;
  const buy=getListingPriceSummary(listings,"buy"),sell=getListingPriceSummary(listings,"sell");
  return `<span class="trader-inline"><span class="trader-label">Trader Info</span> ${priceInfo(buy,"Buy","buy")} ${priceInfo(sell,"Sell","sell")}</span>`;
}
function renderItemRow(group){
  const first=group[0],listings=getGroupListings(group),facts=primaryFactsHTML(first),multi=group.length>1;
  const infoParts=[];
  if(multi)infoParts.push("This item has multiple records with the same displayed name. Any ranges shown denote differences between entries. The individual item records can be seen once expanded.");
  if(listings.length>1)infoParts.push(`${listings.length} trader entries share this displayed item name. Their individual trader records can be seen once expanded.`);
  const groupTip=infoParts.join("\n\n");
  return `<details class="item-row" data-group-name="${escapeHtml(first.name)}"><summary><span class="item-name-wrap"><span class="item-name">${escapeHtml(first.name)}</span>${marker("item",first.id,"name")}</span><span class="item-classification">${classificationHTML(first)}</span><span class="item-facts">${facts.map(f=>`<span>${f}</span>`).join("")}</span>${mainLineTrader(first,listings)}${groupTip?infoIcon(groupTip):""}<span class="row-expander" aria-hidden="true">›</span></summary><div class="item-row-body">${buildRowDetails(group)}</div></details>`;
}
function buildRowDetails(group){
  const first=group[0],listings=getGroupListings(group),buy=getListingPriceSummary(listings,"buy"),sell=getListingPriceSummary(listings,"sell");let html="";
  html+=`<div class="detail-grid"><div class="detail-row"><strong>Mod</strong>${modValueHTML(first)}</div>`;
  if(first.inventory?.dimensions)html+=`<div class="detail-row"><strong>Inventory dimensions</strong>${valueHTML(first.inventory.dimensions,"item",first.id,"inventory.dimensions")}</div>`;
  if(first.inventory?.size)html+=`<div class="detail-row"><strong>Storage space</strong>${valueHTML(first.inventory.size,"item",first.id,"inventory.size")}</div>`;
  if(first.inventory?.maxStack!==undefined)html+=`<div class="detail-row"><strong>Max stack</strong>${valueHTML(first.inventory.maxStack,"item",first.id,"inventory.maxStack")}</div>`;
  if(first.properties?.length)html+=`<div class="detail-row"><strong>Properties</strong>${valueHTML(first.properties,"item",first.id,"properties")}</div>`;
  html+=`</div>`;
  if(first.attachmentPoints?.length){
    html+=`<section class="detail-section"><h3>Attachment / storage points</h3><div class="related-list attachment-point-list">${first.attachmentPoints.map(p=>`<button class="link-button" data-detail-id="${escapeHtml(first.id)}" data-attachment-point="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button>`).join("")}</div></section>`;
  }
  html+=`<div class="row-links"><button class="link-button" data-detail-id="${escapeHtml(first.id)}">Open item details</button>${listings.length?`<button class="link-button" data-trader-item="${escapeHtml(first.id)}">Trader Listings${listings.length>1?` (${listings.length})`:""}</button>`:""}<button class="text-button back-top-link" data-scroll-top="1">Back to top ↑</button></div>`;
  if(buy||sell)html+=`<section class="detail-section"><h3>Trader</h3><div class="detail-grid">${buy?`<div class="detail-row clickable-value" data-trader-item="${escapeHtml(first.id)}"><strong>Buy</strong>${escapeHtml(formatPriceList(buy))}</div>`:`<div class="detail-row"><strong>Buy</strong>${unavailableIcon("buy")}</div>`}${sell?`<div class="detail-row clickable-value" data-trader-item="${escapeHtml(first.id)}"><strong>Sell</strong>${escapeHtml(formatPriceList(sell))}</div>`:`<div class="detail-row"><strong>Sell</strong>${unavailableIcon("sell")}</div>`}</div></section>`;
  if(group.length>1)html+=`<section class="detail-section"><h3>Individual records</h3>${group.map((x,i)=>`<details class="group"><summary>Record ${i+1}${getItemListings(x).length?` • ${getItemListings(x).length} trader listing${getItemListings(x).length===1?"":"s"}`:""}</summary><div class="group-body"><div class="detail-grid"><div class="detail-row"><strong>Mod</strong>${escapeHtml(getModName(x))}</div>${x.inventory?.dimensions?`<div class="detail-row"><strong>Dimensions</strong>${escapeHtml(x.inventory.dimensions)}`:""}${x.firearm?.caliber?`</div><div class="detail-row"><strong>Caliber</strong>${escapeHtml(x.firearm.caliber)}</div>`:""}</div><button class="link-button" data-detail-id="${escapeHtml(x.id)}">Open this record</button></div></details>`).join("")}</section>`;
  return html;
}

/* ---------- Detailed item page ---------- */
function openItemDetail(id,returnView="database",focusAttachment=null){const item=findItem(id);if(!item)return;currentDetailId=id;detailReturnView=returnView;renderDetailPage(item,focusAttachment);showView("detail");pushHistory({view:"detail",id,returnView,focusAttachment});window.scrollTo({top:0,behavior:"smooth"})}
function renderDetailPage(item,focusAttachment=null){const listings=getItemListings(item);$("detailHeader").innerHTML=`<div class="detail-title"><div><h2>${escapeHtml(item.name)} ${marker("item",item.id,"name")}</h2><p>${escapeHtml(item.category||"Uncategorized")}${item.subcategory?` → ${escapeHtml(item.subcategory)}`:""} • Mod: ${escapeHtml(getModName(item))}</p></div><div class="detail-actions">${listings.length?`<button class="link-button" data-trader-item="${escapeHtml(item.id)}">Trader Listings</button>`:""}<button class="link-button" data-report="1" data-entity-type="item" data-entity-id="${escapeHtml(item.id)}" data-path="item">Report</button></div></div>`;$("detailBody").innerHTML=buildCoreDetail(item)+buildTraderDetail(item,listings)+buildAttachmentDetail(item,focusAttachment)+buildRelationshipDetail(item)+buildNotesDetail(item)}
function buildBallisticsDetail(item){
  const b=item.ballistics;if(!b)return marker("item",item.id,"ballistics",true);
  const rows=[];
  if(b.damage!==undefined)rows.push(`<div class="detail-row"><strong>Damage</strong>${valueHTML(b.damage,"item",item.id,"ballistics.damage")}</div>`);
  if(b.shock!==undefined)rows.push(`<div class="detail-row"><strong>Shock</strong>${valueHTML(b.shock,"item",item.id,"ballistics.shock")}</div>`);
  if(b.dieselOverride!==undefined)rows.push(`<div class="detail-row"><strong>Diesel Override</strong>${valueHTML(b.dieselOverride,"item",item.id,"ballistics.dieselOverride")}</div>`);
  if(b.armor!==undefined)rows.push(`<div class="detail-row"><strong>Armor</strong>${valueHTML(b.armor,"item",item.id,"ballistics.armor")}</div>`);
  if(b.dieselArmor!==undefined)rows.push(`<div class="detail-row"><strong>Diesel Armor</strong>${valueHTML(b.dieselArmor,"item",item.id,"ballistics.dieselArmor")}</div>`);
  return rows.join("");
}
function buildCoreDetail(item){
  const rows=[];
  rows.push(`<div class="detail-row"><strong>Mod</strong>${modValueHTML(item)}</div>`);
  rows.push(`<div class="detail-row"><strong>Category</strong>${escapeHtml(classificationLabel(item))}</div>`);
  if(item.subcategory)rows.push(`<div class="detail-row"><strong>Subcategory</strong>${valueHTML(item.subcategory,"item",item.id,"subcategory")}</div>`);
  if(item.properties?.length)rows.push(`<div class="detail-row"><strong>Properties</strong>${valueHTML(item.properties,"item",item.id,"properties")}</div>`);
  if(item.inventory||stateFor("item",item.id,"inventory.dimensions")||stateFor("item",item.id,"inventory.size")||stateFor("item",item.id,"inventory.maxStack")){
    if(item.inventory?.dimensions!==undefined||stateFor("item",item.id,"inventory.dimensions"))rows.push(`<div class="detail-row"><strong>Inventory dimensions</strong>${valueHTML(item.inventory?.dimensions,"item",item.id,"inventory.dimensions")}</div>`);
    if(item.inventory?.size!==undefined||stateFor("item",item.id,"inventory.size"))rows.push(`<div class="detail-row"><strong>Storage space</strong>${valueHTML(item.inventory?.size,"item",item.id,"inventory.size")}</div>`);
    if(item.inventory?.maxStack!==undefined||stateFor("item",item.id,"inventory.maxStack"))rows.push(`<div class="detail-row"><strong>Max stack</strong>${valueHTML(item.inventory?.maxStack,"item",item.id,"inventory.maxStack")}</div>`);
  }
  if(item.currency)rows.push(`<div class="detail-row"><strong>Currency value</strong>${valueHTML(item.currency.value,"item",item.id,"currency.value")}</div>`);
  if(item.clothing){
    rows.push(`<div class="detail-row"><strong>Equipment slot</strong>${item.clothing.slot?valueHTML(item.clothing.slot,"item",item.id,"clothing.slot"):marker("item",item.id,"clothing.slot",true)}</div>`);
    rows.push(`<div class="detail-row"><strong>Insulation</strong>${item.clothing.insulation!==undefined?valueHTML(item.clothing.insulation+" Insulation","item",item.id,"clothing.insulation"):marker("item",item.id,"clothing.insulation",true)}</div>`);
  }
  if(item.equipment?.slots?.length)rows.push(`<div class="detail-row"><strong>Equipment slots</strong>${valueHTML(item.equipment.slots,"item",item.id,"equipment.slots")}</div>`);
  if(item.firearm){
    rows.push(`<div class="detail-row"><strong>Caliber</strong>${item.firearm.caliber?valueHTML(item.firearm.caliber,"item",item.id,"firearm.caliber"):marker("item",item.id,"firearm.caliber",true)}</div>`);
    rows.push(`<div class="detail-row"><strong>Compatible magazines</strong>${item.firearm.validMagazines?.length?`<div class="related-list">${item.firearm.validMagazines.map(relatedButton).join("")}</div>`:marker("item",item.id,"firearm.validMagazines",true)}</div>`);
  }
  if(item.magazine){
    rows.push(`<div class="detail-row"><strong>Magazine capacity</strong>${item.magazine.capacity!==undefined?valueHTML(item.magazine.capacity,"item",item.id,"magazine.capacity"):marker("item",item.id,"magazine.capacity",true)}</div>`);
    rows.push(`<div class="detail-row"><strong>Compatible ammunition</strong>${item.magazine.validAmmo?.length?`<div class="related-list">${item.magazine.validAmmo.map(relatedButton).join("")}</div>`:marker("item",item.id,"magazine.validAmmo",true)}</div>`);
  }
  if(item.category==='Ammunition'&&item.subcategory==='Loose'){
    rows.push(`<div class="detail-row detail-row-wide"><strong>Ballistics</strong><div class="detail-grid ballistics-grid">${buildBallisticsDetail(item)}</div></div>`);
  }
  if(item.category==='Ammunition'&&item.subcategory==='Boxed'){
    rows.push(`<div class="detail-row"><strong>Opens to</strong>${item.ammoBox?.opensTo?relatedButton(item.ammoBox.opensTo):marker("item",item.id,"ammoBox.opensTo",true)}</div>`);
    rows.push(`<div class="detail-row"><strong>Box quantity</strong>${item.ammoBox?.quantity!==undefined?valueHTML(item.ammoBox.quantity,"item",item.id,"ammoBox.quantity"):marker("item",item.id,"ammoBox.quantity",true)}</div>`);
  }
  return`<section class="detail-section"><h3>Core information</h3><div class="detail-grid">${rows.join("")}</div></section>`
}
function buildTraderDetail(item,listings){if(!listings.length)return"";return`<section class="detail-section"><h3>Trader Listings</h3><div class="detail-grid">${listings.map(l=>`<div class="detail-row clickable-value" data-trader-listing="${escapeHtml(l.id)}"><strong>${escapeHtml(listingLabel(l))}</strong><div>${l.buy!==undefined?`Buy: ${Number(l.buy).toLocaleString()}`: `Buy: ${unavailableIcon("buy")}`}${l.sell!==undefined?` • Sell: ${Number(l.sell).toLocaleString()}`:` • Sell: ${unavailableIcon("sell")}`}</div></div>`).join("")}</div><p class="meta">Click a trader listing to open the Trader Browser with this item already selected.</p></section>`}
function buildAttachmentDetail(item,focusAttachment=null){if(!item.attachmentPoints?.length)return"";return`<section class="detail-section"><h3>Attachment / storage points</h3>${item.attachmentPoints.map(p=>`<details class="group" ${focusAttachment===p.id?"open":""}><summary>${escapeHtml(p.name)} <span class="meta">${(p.accepts?.itemIds||[]).length} recorded examples</span></summary><div class="group-body">${p.accepts?.rule?`<p class="meta">Acceptance rule: ${escapeHtml(p.accepts.rule)}</p>`:""}<div class="related-list">${(p.accepts?.itemIds||[]).map(relatedButton).join("")||`<span class="meta">No current example recorded.</span>`}</div>${p.notes?.length?`<p class="meta">${escapeHtml(p.notes.join(" "))}</p>`:""}</div></details>`).join("")}</section>`}
function buildRelationshipDetail(item){const rels=[];(item.firearm?.validMagazines||[]).forEach(id=>rels.push(["Uses magazine",id]));(item.magazine?.validAmmo||[]).forEach(id=>rels.push(["Accepts ammunition",id]));if(!rels.length)return"";return`<section class="detail-section"><h3>Relationships</h3><div class="related-list">${rels.map(([label,id])=>`<span class="meta">${escapeHtml(label)}:</span>${relatedButton(id)}`).join("")}</div></section>`}
function buildNotesDetail(item){if(!item.notes?.length)return"";return`<section class="detail-section"><h3>Notes / warnings</h3><ul>${item.notes.map(n=>`<li>${escapeHtml(n)}</li>`).join("")}</ul></section>`}
function relatedButton(id){const x=findItem(id);return x?`<button class="link-button" data-detail-id="${escapeHtml(x.id)}">${escapeHtml(x.name)}</button>`:`<span class="meta">${escapeHtml(id)}</span>`}

/* ---------- Trader browser ---------- */
function initializeTraderBrowser(){
  traderBrowse.location=db.traders.locations[0]?.id||"";
  traderBrowse.vendor=db.traders.vendors.find(v=>(v.locations||[]).includes(traderBrowse.location))?.id||"";
  traderBrowse.category="";
  renderTraderTree();renderTraderBrowser();
}
function getVendorsForLocation(locationId){return db.traders.vendors.filter(v=>(v.locations||[]).includes(locationId))}
function getListingsForTraderState(){
  let rows=db.traders.listings;
  if(traderBrowse.location){const vendorIds=new Set(getVendorsForLocation(traderBrowse.location).map(v=>v.id));rows=rows.filter(l=>vendorIds.has(l.vendorId))}
  if(traderBrowse.vendor)rows=rows.filter(l=>l.vendorId===traderBrowse.vendor);
  if(traderBrowse.category)rows=rows.filter(l=>l.menuCategory===traderBrowse.category);
  return rows;
}
function traderCategories(vendorId){return[...new Set(db.traders.listings.filter(l=>l.vendorId===vendorId).map(l=>l.menuCategory).filter(Boolean))].sort((a,b)=>a.localeCompare(b))}
function renderTraderTree(){
  const root=$("traderExplorer");if(!root)return;
  const markup=db.traders.locations.map(loc=>{
    const vendors=getVendorsForLocation(loc.id);
    if(!vendors.length)return"";
    const locOpen=traderBrowse.location===loc.id;
    const vendorMarkup=vendors.map(v=>{
      const cats=traderCategories(v.id),vendorOpen=traderBrowse.vendor===v.id&&locOpen;
      const catMarkup=cats.map(cat=>`<button class="tree-leaf trader-leaf ${traderBrowse.category===cat&&vendorOpen?"selected":""}" data-trader-node="category" data-location-id="${escapeHtml(loc.id)}" data-vendor-id="${escapeHtml(v.id)}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join("");
      return `<details class="browse-node trader-node" ${vendorOpen?"open":""}><summary class="${vendorOpen&&!traderBrowse.category?"selected":""}" data-trader-node="vendor" data-location-id="${escapeHtml(loc.id)}" data-vendor-id="${escapeHtml(v.id)}">${escapeHtml(v.name)}</summary><div class="browse-children">${catMarkup}</div></details>`;
    }).join("");
    return `<details class="browse-node trader-node" ${locOpen?"open":""}><summary class="${locOpen?"selected":""}" data-trader-node="location" data-location-id="${escapeHtml(loc.id)}">${escapeHtml(loc.name)}</summary><div class="browse-children">${vendorMarkup}</div></details>`;
  }).join("");
  root.innerHTML=markup;
}
function setTraderBrowse(location="",vendor="",category="",focusItemId=null,focusListingId=null){
  traderBrowse={location,vendor,category};
  renderTraderTree();renderTraderBrowser(focusItemId,focusListingId);
}
function groupTraderListings(rows){const map=new Map();rows.forEach(l=>{const item=findItem(l.itemId);const name=l.displayName||item?.name||"Unknown";if(!map.has(name))map.set(name,[]);map.get(name).push(l)});return[...map.values()]}
function renderTraderBrowser(focusItemId=null,focusListingId=null){
  const rows=getListingsForTraderState(),groups=groupTraderListings(rows),body=$("traderRows");if(!body)return;
  body.innerHTML=groups.map(group=>{
    const first=group[0],item=findItem(first.itemId),display=first.displayName||item?.name||"Unknown",focused=group.some(l=>(focusListingId&&l.id===focusListingId)||(focusItemId&&l.itemId===focusItemId)),buy=getListingPriceSummary(group,"buy"),sell=getListingPriceSummary(group,"sell"),tip="This trader page has multiple records with the same displayed name. Any ranges shown denote differences between entries. The individual trader entries can be seen once expanded.";
    return `<details class="item-row trader-row ${focused?"current":""}" ${focused?"open":""}><summary><span class="item-name-wrap"><span class="item-name">${escapeHtml(display)}</span></span><span class="item-classification">${escapeHtml(first.menuCategory||"")}</span><span class="item-facts">${item?primaryFactsHTML(item).map(f=>`<span>${f}</span>`).join(""):""}</span><span class="trader-inline">${priceInfo(buy,"Buy","buy")} ${priceInfo(sell,"Sell","sell")}</span>${group.length>1?infoIcon(tip):""}<span class="row-expander" aria-hidden="true">›</span></summary><div class="item-row-body">${buildTraderRowGroup(group,item)}</div></details>`;
  }).join("")||`<div class="empty-state">No trader listings in this selection.</div>`;
  $("traderResultCount").textContent=`${groups.length} displayed item${groups.length===1?"":"s"} • ${rows.length} listings`;
  if(focusListingId||focusItemId){const el=body.querySelector(".trader-row.current");if(el)requestAnimationFrame(()=>el.scrollIntoView({block:"center",behavior:"smooth"}))}
}
function buildTraderRowGroup(group,item){
  const first=group[0],buy=getListingPriceSummary(group,"buy"),sell=getListingPriceSummary(group,"sell");
  let html=`<div class="detail-grid"><div class="detail-row"><strong>Item</strong>${item?`<button class="link-button" data-detail-id="${escapeHtml(item.id)}">${escapeHtml(item.name)}</button>`:escapeHtml(first.displayName||"Unknown")}</div><div class="detail-row"><strong>Location</strong>${escapeHtml(listingLocationNames(first).join(", "))}</div></div>`;
  html+=`<section class="detail-section"><h3>Trader prices</h3><div class="detail-grid"><div class="detail-row"><strong>Buy</strong>${buy?priceInfo(buy,"","buy"):unavailableIcon("buy")}</div><div class="detail-row"><strong>Sell</strong>${sell?priceInfo(sell,"","sell"):unavailableIcon("sell")}</div></div></section>`;
  if(group.length>1)html+=`<section class="detail-section"><h3>Individual trader records</h3>${group.map((l,i)=>`<details class="group"><summary>Record ${i+1}</summary><div class="group-body"><div class="detail-grid"><div class="detail-row"><strong>Buy</strong>${l.buy!==undefined?Number(l.buy).toLocaleString():unavailableIcon("buy")}</div><div class="detail-row"><strong>Sell</strong>${l.sell!==undefined?Number(l.sell).toLocaleString():unavailableIcon("sell")}</div><div class="detail-row"><strong>Trader page</strong>${escapeHtml(listingLabel(l))}</div></div><button class="link-button" data-trader-listing="${escapeHtml(l.id)}">Open trader record</button></div></details>`).join("")}</section>`;
  html+=`<div class="row-links">${item?`<button class="link-button" data-detail-id="${escapeHtml(item.id)}">Open item details</button>`:""}<button class="text-button back-top-link" data-scroll-top="1">Back to top ↑</button></div>`;
  return html;
}
function showTraderForItem(itemId){
  const item=findItem(itemId),listings=item?getItemListings(item):[];const target=listings[0];
  if(!target){showView("trader");return}
  const vendor=db.traders.vendors.find(v=>v.id===target.vendorId),location=(vendor?.locations||[])[0]||traderBrowse.location;
  setTraderBrowse(location,target.vendorId,target.menuCategory,itemId,target.id);showView("trader");pushHistory({view:"trader",location,vendor:target.vendorId,category:target.menuCategory||"",focusItemId:itemId,focusListingId:target.id});window.scrollTo({top:0,behavior:"smooth"});
}
function showTraderForListing(listing){
  const vendor=db.traders.vendors.find(v=>v.id===listing.vendorId),location=(vendor?.locations||[])[0]||traderBrowse.location;
  setTraderBrowse(location,listing.vendorId,listing.menuCategory||"",listing.itemId,listing.id);showView("trader");pushHistory({view:"trader",location,vendor:listing.vendorId,category:listing.menuCategory||"",focusItemId:listing.itemId,focusListingId:listing.id});window.scrollTo({top:0,behavior:"smooth"});
}

/* ---------- Global hover tooltips ---------- */
function hideAppTooltip(){clearTimeout(tooltipTimer);tooltipTimer=null;activeTooltipTarget=null;appTooltip.classList.remove("visible");appTooltip.setAttribute("aria-hidden","true")}
function showAppTooltip(target){clearTimeout(tooltipTimer);tooltipTimer=setTimeout(()=>{const text=target.dataset.tooltip;if(!text)return;activeTooltipTarget=target;appTooltip.textContent=text;appTooltip.classList.add("visible");appTooltip.setAttribute("aria-hidden","false");const r=target.getBoundingClientRect();const pad=10;const tr=appTooltip.getBoundingClientRect();let left=r.left+r.width/2-tr.width/2;let top=r.top-tr.height-8;if(top<pad)top=r.bottom+8;left=Math.max(pad,Math.min(left,window.innerWidth-tr.width-pad));appTooltip.style.left=`${left}px`;appTooltip.style.top=`${top}px`},120)}
document.addEventListener("mouseover",e=>{const t=e.target.closest?.("[data-tooltip]");if(t)showAppTooltip(t)});
document.addEventListener("mouseout",e=>{const t=e.target.closest?.("[data-tooltip]");if(t&&(!e.relatedTarget||!t.contains(e.relatedTarget)))hideAppTooltip()});
document.addEventListener("focusin",e=>{const t=e.target.closest?.("[data-tooltip]");if(t)showAppTooltip(t)});
document.addEventListener("focusout",e=>{if(e.target.closest?.("[data-tooltip]"))hideAppTooltip()});
window.addEventListener("scroll",hideAppTooltip,{passive:true});
window.addEventListener("resize",hideAppTooltip);

/* ---------- Click handling / reports ---------- */
function handleGlobalClick(e){
  const scrollTop=e.target.closest("[data-scroll-top]");if(scrollTop){e.preventDefault();e.stopPropagation();window.scrollTo({top:0,behavior:"smooth"});return}
  const browse=e.target.closest("[data-browse-node]");if(browse){e.preventDefault();e.stopPropagation();setCategoryFilter(browse.dataset.browseNode||"");return}
  const traderNode=e.target.closest("[data-trader-node]");if(traderNode){e.preventDefault();e.stopPropagation();const kind=traderNode.dataset.traderNode;if(kind==="all")setTraderBrowse("","","");else if(kind==="location")setTraderBrowse(traderNode.dataset.locationId,"","");else if(kind==="vendor")setTraderBrowse(traderNode.dataset.locationId,traderNode.dataset.vendorId,"");else if(kind==="category")setTraderBrowse(traderNode.dataset.locationId,traderNode.dataset.vendorId,traderNode.dataset.category);return}
  const report=e.target.closest("[data-report]");if(report){e.preventDefault();e.stopPropagation();openReport(report.dataset);return}
  const trader=e.target.closest("[data-trader-item]");if(trader){e.preventDefault();e.stopPropagation();showTraderForItem(trader.dataset.traderItem);return}
  const listing=e.target.closest("[data-trader-listing]");if(listing){e.preventDefault();e.stopPropagation();const l=db.traders.listings.find(x=>x.id===listing.dataset.traderListing);if(l)showTraderForListing(l);return}
  const detail=e.target.closest("[data-detail-id]");if(detail){e.preventDefault();e.stopPropagation();openItemDetail(detail.dataset.detailId,currentView==="trader"?"trader":"database",detail.dataset.attachmentPoint||null);return}
}
function openReport(target){const item=target.entityType==="item"?findItem(target.entityId):null;const field=target.path;const message=`Report for ${item?.name||target.entityId}\nField: ${field}\nCurrent value: ${getPath(item,field)??"Missing"}`;if(db.reporting.formUrl){window.open(db.reporting.formUrl+"?item="+encodeURIComponent(item?.name||target.entityId)+"&field="+encodeURIComponent(field),"_blank","noopener");return}alert(message+"\n\nReporting is ready architecturally; the Google Form URL has not been connected yet.")}
function getPath(obj,path){if(!obj)return undefined;return path.split(".").reduce((a,k)=>a?.[k],obj)}
