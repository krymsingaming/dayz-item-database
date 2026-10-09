import json, os, zipfile, hashlib, datetime
from collections import defaultdict

ROOT='/mnt/data/beta102_work'
DATA=os.path.join(ROOT,'data')

with open(os.path.join(DATA,'items.json'),encoding='utf-8') as f: items=json.load(f)
with open(os.path.join(DATA,'traders.json'),encoding='utf-8') as f: traders=json.load(f)

by_id={x['id']:x for x in items}
by_name=defaultdict(list)
for x in items: by_name[x['name']].append(x)
listings=traders['listings']

renames={
    'Jeep_GladiatorF$_Trunk_DarkBlue':'Jeep_GladiatorF9_Trunk_DarkBlue',
    'Jeep_CladiatorF$_Trunk CamoBlack':'Jeep_GladiatorF9_Trunk CamoBlack',
    'Jeep_GladiatorF$_Trunk CamoBlue':'Jeep_GladiatorF9_Trunk CamoBlue',
    'Tahoe_cargot $':'Tahoe_cargo1',
    'Tahoe_cargo2 $':'Tahoe_cargo2',
    'Tahoe_hood $':'Tahoe_hood',
    'Tahoe_trunk $':'Tahoe_trunk',
    'Tahoe_wheel $':'Tahoe_wheel',
    'Tahoe DriverDoor LightBlue $':'Tahoe DriverDoor LightBlue',
    'Tahoe CoDriverDoor LightBlue $':'Tahoe CoDriverDoor LightBlue',
    'Tahoe CargoDoor’ LightBlue $':'Tahoe CargoDoor1 LightBlue',
    'Tahoe DriverDoor Sreen a $':'Tahoe DriverDoor Green',
    'Tahoe CargoDoor2 Green $':'Tahoe CargoDoor2 Green',
    'Tahoe Hood Green $':'Tahoe Hood Green',
    'Tahge Hood Pink $':'Tahoe Hood Pink',
    'Tahge Trunk Pink $':'Tahoe Trunk Pink',
    'Tahge DriverDoor Red $':'Tahoe DriverDoor Red',
    'Tahoe CargoDoor1 Red $':'Tahoe CargoDoor1 Red',
    'Tahoe CargoDoor2 Red $':'Tahoe CargoDoor2 Red',
    'Tahoe CoDriverDoor Red $':'Tahoe CoDriverDoor Red',
    'Tahoe CargoDoor2 Pink $':'Tahoe CargoDoor2 Pink',
    'Toyota4Runner CoDriverDoor Pink $':'Toyota4Runner CoDriverDoor Pink',
    '2014 Chevy Tahoe Creen':'2014 Chevy Tahoe Green',
    '2014 Chevy Tahoe Pink a':'2014 Chevy Tahoe Pink',
}
# The user explicitly said these names are correct after removing the trailing space/$.
renames.update({
    'Tahoe Hood Green $':'Tahoe Hood Green',
    'Tahoe Trunk Green $':'Tahoe Trunk Green',
})

# Explicit duplicate removals: target clean record already exists.
duplicate_targets={
    'Jeep_GladiatorF$_Cargo_Door1 Black':'Jeep_GladiatorF9_Cargo_Door1 Black',
    'Jeep_CladiatorF$_Cargo_Door1 Brown':'Jeep_GladiatorF9_Cargo_Door1 Brown',
    'Bronco_Driverdoor $':'Bronco_Driverdoor',
    'Tahoe DriverDoor DarkBlue $':'Tahoe DriverDoor DarkBlue',
    'Tahoe CargoDoor1 DarkBlue $':'Tahoe CargoDoor1 DarkBlue',
    'Tahoe CargoDoor2 DarkBlue $':'Tahoe CargoDoor2 DarkBlue',
    'Tahoe Hood DarkBlue $':'Tahoe Hood DarkBlue',
    'Tahoe Trunk DarkBlue $':'Tahoe Trunk DarkBlue',
    'Tahoe DriverDoor Green $':'Tahoe DriverDoor Green',
    'Tahge DriverDoor Pink $':'Tahoe DriverDoor Pink',
    'Tahge CoDriverDoor Pink $':'Tahoe CoDriverDoor Pink',
    'Tahge CargoDoor1 Pink $':'Tahoe CargoDoor1 Pink',
    'Tahoe CargoDoor2 Pink $':'Tahoe CargoDoor2 Pink',
    'Tahge Hood Pink $':'Tahoe Hood Pink',
    'Tahge DriverDoor Red $':'Tahoe DriverDoor Red',
    'Tahoe CoDriverDoor Red $':'Tahoe CoDriverDoor Red',
    'Toyota4Runner CoDriverDoor Pink $':'Toyota4Runner CoDriverDoor Pink',
}
# Some names are in both maps above; deletion takes precedence when a target already exists.

# Resolve item IDs by original names, one occurrence at a time.
deleted=[]; renamed=[]; reassigned=[]
for old_name,target_name in duplicate_targets.items():
    olds=[x for x in items if x['name']==old_name]
    if not olds:
        continue
    targets=[x for x in items if x['name']==target_name and x['id'] not in {o['id'] for o in olds}]
    if not targets:
        # If no clean target exists, do not guess; leave untouched.
        continue
    target=targets[0]
    old_ids={o['id'] for o in olds}
    for l in listings:
        if l['itemId'] in old_ids:
            l['itemId']=target['id']
            reassigned.append((l['id'],old_name,target_name))
    items=[x for x in items if x['id'] not in old_ids]
    deleted.append((old_name,target_name,len(olds)))

# Rebuild name index after deletions.
by_name=defaultdict(list)
for x in items: by_name[x['name']].append(x)

# Apply direct renames only where the old record still exists.
for old_name,new_name in renames.items():
    matches=[x for x in items if x['name']==old_name]
    for x in matches:
        x['name']=new_name
        renamed.append((old_name,new_name,x['id']))

# Correct a few explicitly user-confirmed typos in 2014 Tahoe variant names only.
# No other similarly-looking OCR strings are changed here.

# Write JSON.
for path,data in [
    (os.path.join(DATA,'items.json'),items),
    (os.path.join(DATA,'traders.json'),traders),
]:
    with open(path,'w',encoding='utf-8') as f:
        json.dump(data,f,indent=2,ensure_ascii=False)
        f.write('\n')

# Sanity checks.
item_ids={x['id'] for x in items}
dangling=[l for l in listings if l['itemId'] not in item_ids]
assert not dangling, f'Dangling listings: {len(dangling)}'

# Update version metadata.
version={
    'stage':'beta','version':'1.0.2','displayVersion':'Beta 1.0.2',
    'previousBuild':'Beta 1.0.1','status':'public beta candidate','date':'2026-10-08'
}
with open(os.path.join(ROOT,'VERSION.json'),'w',encoding='utf-8') as f:
    json.dump(version,f,indent=2); f.write('\n')

print('deleted',len(deleted),deleted)
print('renamed',len(renamed))
for x in renamed: print(' R',x)
print('reassigned listings',len(reassigned))
print('items',len(items),'listings',len(listings))
