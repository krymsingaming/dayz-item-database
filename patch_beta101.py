import json, copy
from pathlib import Path
root=Path('/mnt/data/beta_work')

def load(rel): return json.loads((root/rel).read_text(encoding='utf-8'))
def dump(rel,obj): (root/rel).write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

items=load('data/items.json')
traders=load('data/traders.json')
ver=load('data/verification.json')
defs=load('data/definitions.json')

# Remove records explicitly identified by the user as invalid/unusable.
remove_item_ids={'altar-5-67-30053c93','altar-5-69-81091c7b','30rd-ka-ma-mag'}
items=[x for x in items if x.get('id') not in remove_item_ids]
traders['listings']=[x for x in traders['listings'] if x.get('itemId') not in remove_item_ids]
ver=[x for x in ver if x.get('entityId') not in remove_item_ids]

# Explicit source-backed display correction already visible in the current item record.
# The imported magazine is already correctly named 5rd Pioneer Mag; no duplicate/extra record is created.

byid={x['id']:x for x in items}

def add_or_replace(item):
    global items,byid
    if item['id'] in byid:
        items=[x for x in items if x['id']!=item['id']]
    items.append(item); byid[item['id']]=item

# User-confirmed spreadsheet records with unresolved display-name reliability.
add_or_replace({
  'id':'kimber-custom',
  'name':'Kimber Custom',
  'category':'Firearm',
  'source':{'modId':'mortys'},
  'firearm':{'caliber':'.45acp','validMagazines':['kimber-custom-mag']},
  'evidence':{'status':'partially_confirmed','source':'GunsMags spreadsheet row 57','note':'User confirmed the gun name can be added, but the display name may be incorrect.'}
})
add_or_replace({
  'id':'kimber-custom-mag',
  'name':'Kimber Custom Mag',
  'category':'Magazine',
  'source':{'modId':'mortys'},
  'evidence':{'status':'partially_confirmed','source':'GunsMags spreadsheet row 57','note':'User confirmed the magazine can be added, but the display name may be incorrect.'},
  'magazine':{}
})

# User-confirmed ArexZero row: firearm is safe to add as a rifle, caliber is safe, names remain warning-marked.
add_or_replace({
  'id':'arexzero',
  'name':'ArexZero',
  'category':'Firearm',
  'subcategory':'Rifles',
  'source':{'modId':'twp'},
  'firearm':{'caliber':'9x19mm','validMagazines':['arexzero-mag-18rnd']},
  'evidence':{'status':'partially_confirmed','source':'GunsMags spreadsheet row 13','note':'User confirmed this can be added as a rifle and the 9x19mm caliber is safe. Display name remains subject to verification.'}
})
add_or_replace({
  'id':'arexzero-mag-18rnd',
  'name':'ArexZero Mag 18Rnd',
  'category':'Magazine',
  'source':{'modId':'twp'},
  'magazine':{'capacity':18},
  'evidence':{'status':'partially_confirmed','source':'GunsMags spreadsheet F13','rawIdentifier':'ArexZero_mag_18Rnd','note':'Display name remains subject to verification.'}
})

# User-confirmed Marlin source information. The malformed second .45-70 spreadsheet row is not imported as an item.
add_or_replace({
  'id':'marlin-1895',
  'name':'Marlin 1895',
  'category':'Firearm',
  'subcategory':'Rifles',
  'source':{'modId':'mortys'},
  'firearm':{'caliber':'.45-70'},
  'evidence':{'status':'confirmed','source':'User verification via Morty\'s mod-author Discord','note':'Lever-action rifle; verified to shoot .45-70 rounds.'}
})

# Verification states requested by the user. Name warnings are actionable; missing fields are explicitly surfaced in detail view.
def addv(entityType,entityId,dataPath,state,source,note=None):
    ver[:] = [x for x in ver if not (x.get('entityType')==entityType and x.get('entityId')==entityId and x.get('dataPath')==dataPath)]
    x={'entityType':entityType,'entityId':entityId,'dataPath':dataPath,'state':state,'source':source}
    if note: x['note']=note
    ver.append(x)

# Name reliability warnings.
addv('item','kimber-custom','name','warning','user_review','User confirmed the record can be added but display name may be incorrect.')
addv('item','kimber-custom-mag','name','warning','user_review','User confirmed the record can be added but display name may be incorrect.')
addv('item','arexzero','name','warning','user_review','User confirmed the record can be added but display name may be incorrect.')
addv('item','arexzero-mag-18rnd','name','warning','user_review','Display name derived from the spreadsheet identifier and remains subject to verification.')
# Missing fields the user explicitly asked to mark.
for eid,path in [
 ('kimber-custom','inventory.dimensions'),('kimber-custom','firearm.validMagazines'),
 ('kimber-custom-mag','magazine.capacity'),('kimber-custom-mag','magazine.validAmmo'),
 ('arexzero','inventory.dimensions'),('arexzero','equipment.slots'),
 ('arexzero-mag-18rnd','inventory.dimensions'),('arexzero-mag-18rnd','magazine.validAmmo')]:
    addv('item',eid,path,'missing','user_review','Information has not yet been established.')
# The Kimber magazine relationship is inferred from the spreadsheet row/name association.
addv('item','kimber-custom','firearm.validMagazines','inferred','spreadsheet_association','Associated with the Kimber Custom row; direct compatibility not yet verified.')
# ArexZero magazine relationship is user-confirmed as an available magazine attachment.
addv('item','arexzero','firearm.validMagazines','confirmed','user_review','User confirmed this magazine is an available attachment for ArexZero.')
# Caliber is explicitly safe per user.
addv('item','arexzero','firearm.caliber','confirmed','user_review')

# Add a corrected-information state to the schema for future report/correction workflow.
defs['reliabilityStates']['corrected']={
  'display':'Previously missing; now corrected',
  'icon':'ⓘ',
  'description':'This information was previously missing or unresolved and has since been corrected from new evidence. It remains marked informational so the change is visible.'
}
dump('data/items.json',items)
dump('data/traders.json',traders)
dump('data/verification.json',ver)
dump('data/definitions.json',defs)

# Patch marker mapping so the new corrected state is yellow-info rather than a warning.
app=(root/'app.js').read_text(encoding='utf-8')
old='state==="inferred"||state==="informational"||state==="underReview"'
new='state==="inferred"||state==="informational"||state==="underReview"||state==="corrected"'
app=app.replace(old,new)
# Show missing fields in detail when a verification record exists, not only when the underlying object happens to exist.
old='''  if(item.inventory){\n    if(item.inventory.dimensions)rows.push(`<div class="detail-row"><strong>Inventory dimensions</strong>${valueHTML(item.inventory.dimensions,"item",item.id,"inventory.dimensions")}</div>`);\n    if(item.inventory.size)rows.push(`<div class="detail-row"><strong>Storage space</strong>${valueHTML(item.inventory.size,"item",item.id,"inventory.size")}</div>`);\n    if(item.inventory.maxStack!==undefined)rows.push(`<div class="detail-row"><strong>Max stack</strong>${valueHTML(item.inventory.maxStack,"item",item.id,"inventory.maxStack")}</div>`);\n  }'''
new='''  if(item.inventory||stateFor("item",item.id,"inventory.dimensions")||stateFor("item",item.id,"inventory.size")||stateFor("item",item.id,"inventory.maxStack")){\n    if(item.inventory?.dimensions!==undefined||stateFor("item",item.id,"inventory.dimensions"))rows.push(`<div class="detail-row"><strong>Inventory dimensions</strong>${valueHTML(item.inventory?.dimensions,"item",item.id,"inventory.dimensions")}</div>`);\n    if(item.inventory?.size!==undefined||stateFor("item",item.id,"inventory.size"))rows.push(`<div class="detail-row"><strong>Storage space</strong>${valueHTML(item.inventory?.size,"item",item.id,"inventory.size")}</div>`);\n    if(item.inventory?.maxStack!==undefined||stateFor("item",item.id,"inventory.maxStack"))rows.push(`<div class="detail-row"><strong>Max stack</strong>${valueHTML(item.inventory?.maxStack,"item",item.id,"inventory.maxStack")}</div>`);\n  }'''
if old not in app:
    raise SystemExit('expected inventory block not found')
app=app.replace(old,new)
# Surface name reliability on the detailed title and main row.
old='''return `<details class="item-row" data-group-name="${escapeHtml(first.name)}"><summary><span class="item-name-wrap"><span class="item-name">${escapeHtml(first.name)}</span></span>'''
new='''return `<details class="item-row" data-group-name="${escapeHtml(first.name)}"><summary><span class="item-name-wrap"><span class="item-name">${escapeHtml(first.name)}</span>${marker("item",first.id,"name")}</span>'''
if old not in app:
    raise SystemExit('expected item row block not found')
app=app.replace(old,new)
old='''function renderDetailPage(item,focusAttachment=null){const listings=getItemListings(item);$("detailHeader").innerHTML=`<div class="detail-title"><div><h2>${escapeHtml(item.name)}</h2>'''
new='''function renderDetailPage(item,focusAttachment=null){const listings=getItemListings(item);$("detailHeader").innerHTML=`<div class="detail-title"><div><h2>${escapeHtml(item.name)} ${marker("item",item.id,"name")}</h2>'''
if old not in app:
    raise SystemExit('expected detail title block not found')
app=app.replace(old,new)
(root/'app.js').write_text(app,encoding='utf-8')

# Documentation
(root/'README.md').write_text('''# Noobs Only — DayZ Item Database Beta 1.0.1\n\nBeta 1.0.1 is a data-correction and verification refinement release following Beta 1.0.0. The major UI architecture remains unchanged.\n\n## Beta 1.0.1 data changes\n\n- Applied user-reviewed corrections from `DATA-REVIEW.md`.\n- Removed the unusable `$c`, `BK-18 s e B0`, and `30rd KA-MA Mag` records/listings rather than guessing at their identities.\n- Added user-confirmed GunsMags records for Kimber Custom, Kimber Custom Mag, ArexZero, ArexZero Mag 18Rnd, and Marlin 1895, with reliability markers where names or fields remain uncertain.\n- Added explicit missing-field display support so a verified missing field can still be shown with its appropriate marker in item details.\n- Added the `corrected` reliability state for future report-driven corrections.\n- Preserved unresolved vehicle OCR characters for user confirmation rather than guessing `5` vs `S`.\n\nSee `CHANGELOG.md` for the complete project history and `DATA-REVIEW.md` for the current data-review state.\n''',encoding='utf-8')

# Data review, preserving user terminology and explicitly recording what was resolved.
(root/'DATA-REVIEW.md').write_text('''# Beta 1.0.1 Data Review Notes\n\nThis file records the Alpha 9 review points and the user's follow-up corrections. Source-backed or user-confirmed changes are applied; unresolved text is deliberately not guessed.\n\n## Confirmed Trader-Altar corrections applied\n- `Boxed 129a OO Buckshats` -> `Boxed 12ga 00 Buckshots`\n- `Boxed 1298 Rifled Slugs` -> `Boxed 12ga Rifled Slugs`\n- `Boxed 7.62x3` -> `Boxed 7.62x39mm Rounds`\n- `Boxed 9x1` -> `Boxed 9x19mm Rounds`\n- `Boxed .` -> removed as garbage OCR\n- `$.45x39mm` / `$.56x4Smm` ammo OCR -> corrected to `5.45x39mm` / `5.56x45mm` forms\n- duplicate pagination records in Weapon Supplies ammunition/magazines were merged when the same item and prices were repeated\n- Flare pagination duplicates were reduced to the four actual trader entries visible on the first ammunition page\n- `Srd Pioneer Mag` -> `5rd Pioneer Mag` (the current database record is already `5rd Pioneer Mag`)\n- `30rd KA-MA Mag` -> removed; user confirmed there is no such magazine listing in that trader category, with the actual KA-M variants being `30rd KA-M Mag`, `30rd KA-M Polymer Mag`, `75rd KA-M Drum Mag`, `30rd KA-101 Mag`, `30rd KA-74 Mag`, and `45rd KA-74 Mag`\n- `$c` -> removed; user confirmed no meaningful item identity can be established and the 550 buy / 1400 sell values are economically impossible as a normal listing\n- `BK-18 s e B0` -> removed; user found no matching ammunition entry and identified the separate legitimate `Sawed-off BK-18` listing in Weapons Trader / Shotguns\n\n## User-confirmed spreadsheet corrections / additions\n\n### Bullet Damage\nThe following values were direct spreadsheet data used for loose ammunition and are **not review concerns**:\n- Row 6 `Bullet_9x39AP`: Damage 75, Diesel Override 1215, Armor 3, Diesel Armor 115\n- Row 24 `Bullet_762x54`: Damage 150\n- Row 25 `Bullet_762x54Tracer`: Damage 150\n- Row 33 `Bullet_545x39`: Damage 115\n- Row 34 `Bullet_545x39Tracer`: Damage 115\n- Row 35 `Bullet_556x45`: Damage 110, Diesel Override 125\n- Row 37 `Bullet_556x45Tracer`: Damage 110\n- Row 38 `Bullet_762x39`: Damage 110\n- Row 39 `Bullet_762x39Tracer`: Damage 110\n- Row 43 `Bullet_9x39`: Damage 75, Diesel Override 150\n- Row 45 `Bullet_357`: Damage 65\n- Row 51 `Bullet_45ACP`: Damage 40, Diesel Override 95.5\n- Row 52 `Ammo_9x19`: Damage 40\n- Row 53 `Bullet_9x19`: Damage 40\n- Row 55 `Bullet_12GaugePellets`: Damage 35\n- Row 58 `Bullet_22`: Damage 20, Diesel Override 100\n- Row 59 `Bullet_Flare`: Damage 10\n\nRows 2, 3, 5, 9–21, 26, 30–32, 40–42, 44, 46–50, 54, 56–57 contain numeric values but no Display Name in column A. User explained these are artifacts from adding the display-name column; if relationships cannot be safely established, they can be ignored.\n\n### GunsMags\n- `GunsMags!C57`: `Kimber Custom` is incorrectly positioned under Buy. User confirmed `Kimber Custom` can safely be added as a gun name, but the display name should carry a warning because it may be incorrect. The database now includes the firearm with `.45acp`; missing fields are marked.\n- `GunsMags!C57` also supports adding `Kimber Custom Mag` in the magazine list. Its display name is warning-marked and capacity/ammunition compatibility remain missing.\n- `GunsMags!D59`: the malformed sell value is an error. User verified through Morty's mod-author Discord that the relevant weapon is `Marlin 1895 (TTC_Winchester1873)`, a lever-action rifle using `.45-70` rounds (`TTC_AmmoBox_4570_20Rnd`, `TTC_Ammo_4570`). The malformed second row should be deleted from the user's spreadsheet. The database now contains `Marlin 1895` with `.45-70` and a confirmed user-verification source.\n- `GunsMags!A13` is blank while F13 contains `ArexZero_mag_18Rnd`. User confirmed `ArexZero` can safely be added as a rifle, the caliber is safely `9x19mm`, and the magazine is an available attachment. Both display names remain warning-marked; missing fields remain marked.\n\n## Vehicle OCR items still requiring confirmation\nUser checked the vehicle trader data and confirmed that **no vehicle trader entry should literally contain `$`**. However, the exact replacement character (`5` vs `S`, or another OCR correction) was not provided for the individual names below, so Beta 1.0.1 deliberately leaves them unresolved rather than guessing:\n\n- `Jeep_GladiatorF$_Cargo_Door1 Black`\n- `Jeep_CladiatorF$_Cargo_Door1 Brown`\n- `Jeep_GladiatorF$_Trunk_DarkBlue`\n- `Jeep_CladiatorF$_Trunk CamoBlack`\n- `Jeep_GladiatorF$_Trunk CamoBlue`\n- `Bronco_Driverdoor $`\n- `2014 Chevy Tahoe Hea 20 $`\n- `Tahoe_cargot $`\n- `Tahoe_cargo2 $`\n- `Tahoe_hood $`\n- `Tahoe_trunk $`\n- `Tahoe_wheel $`\n- `Tahoe DriverDoor LightBlue $`\n- `Tahoe CoDriverDoor LightBlue $`\n- `Tahoe CargoDoor’ LightBlue $`\n- `Tahoe DriverDoor Sreen a $`\n- `Tahoe CargoDoor2 Green $`\n- `Tahoe Hood Green $`\n- `Tahoe Trunk Green $`\n- `Tahge DriverDoor Pink $`\n- `Tahge CoDriverDoor Pink $`\n- `Tahge CargoDoor1 Pink $`\n- `Tahoe CargoDoor2 Pink $`\n- `Tahge Hood Pink $`\n- `Tahoe Trunk Pink $`\n- `Tahge DriverDoor Red $`\n- `Tahoe CoDriverDoor Red $`\n- `Tahoe CargoDoor1 Red $`\n- `Tahoe CargoDoor2 Red $`\n- `Toyota4Runner CoDriverDoor Pink $`\n\nThese are now a focused verification list. A screenshot or exact intended text from the user can safely resolve them.\n\n## Review policy\n- Confirmed information is shown without a reliability icon.\n- Inferred information uses `ⓘ`.\n- Confirmed unavailable / not applicable information uses `❌`.\n- Information not found yet, or information reported as incorrect, uses `⚠`.\n- Previously missing information that has since been corrected is represented by the new `corrected` state and uses `ⓘ` so the correction history remains visible.\n- No suspicious entry is silently converted into a guessed name or relationship.\n''',encoding='utf-8')

# Changelog prepend Beta 1.0.1 section and update current marker.
ch=(root/'CHANGELOG.md').read_text(encoding='utf-8')
ch=ch.replace('## Beta 1.0.0 — Current','## Beta 1.0.1 — Current\n\n### Data review corrections\n- Applied the user's follow-up review of `DATA-REVIEW.md` instead of treating the earlier review notes as unresolved when they had already been answered.\n- Removed the unusable `$c`, `BK-18 s e B0`, and `30rd KA-MA Mag` item/listing records rather than guessing their identities.\n- Confirmed the Pioneer magazine spelling as `5rd Pioneer Mag`.\n- Added user-confirmed `Kimber Custom`, `Kimber Custom Mag`, `ArexZero`, `ArexZero Mag 18Rnd`, and `Marlin 1895` records with explicit reliability markers for uncertain names/missing fields.\n- Added the user-confirmed `.45-70` Marlin information from Morty's mod-author Discord as the source for the new Marlin record.\n- Added a `corrected` reliability state for future report-driven corrections.\n- Updated item detail rendering so fields explicitly marked missing by verification records are visible with their marker instead of disappearing simply because the value is absent.\n- Preserved unresolved vehicle `$` OCR strings for targeted user confirmation rather than replacing them with guessed `5`/`S` characters.\n\n## Beta 1.0.0')
(root/'CHANGELOG.md').write_text(ch,encoding='utf-8')

v=load('VERSION.json'); v.update({'version':'1.0.1','displayVersion':'Beta 1.0.1','previousBuild':'Beta 1.0.0','status':'public beta candidate','date':'2026-10-08'}); dump('VERSION.json',v)
