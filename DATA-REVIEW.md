# Beta 1.0.1 Data Review Notes

This file records the Alpha 9 review points and the user's follow-up corrections. Source-backed or user-confirmed changes are applied; unresolved text is deliberately not guessed.

## Confirmed Trader-Altar corrections applied
- `Boxed 129a OO Buckshats` -> `Boxed 12ga 00 Buckshots`
- `Boxed 1298 Rifled Slugs` -> `Boxed 12ga Rifled Slugs`
- `Boxed 7.62x3` -> `Boxed 7.62x39mm Rounds`
- `Boxed 9x1` -> `Boxed 9x19mm Rounds`
- `Boxed .` -> removed as garbage OCR
- `$.45x39mm` / `$.56x4Smm` ammo OCR -> corrected to `5.45x39mm` / `5.56x45mm` forms
- duplicate pagination records in Weapon Supplies ammunition/magazines were merged when the same item and prices were repeated
- Flare pagination duplicates were reduced to the four actual trader entries visible on the first ammunition page
- `Srd Pioneer Mag` -> `5rd Pioneer Mag` (the current database record is already `5rd Pioneer Mag`)
- `30rd KA-MA Mag` -> removed; user confirmed there is no such magazine listing in that trader category
- `$c` -> removed; user confirmed no meaningful item identity can be established and the 550 buy / 1400 sell values are economically impossible as a normal listing
- `BK-18 s e B0` -> removed; user found no matching ammunition entry and identified the separate legitimate `Sawed-off BK-18` listing in Weapons Trader / Shotguns

## Spreadsheet review points resolved / clarified
### Bullet Damage
The listed bullet-damage values were direct spreadsheet data used for loose ammunition and are not review concerns. Rows without display names were explained by the user as artifacts from adding the display-name column; if relationships cannot be safely established, they can be ignored.

### GunsMags
- `GunsMags!C57`: user confirmed `Kimber Custom` can safely be added as a gun name, but the display name may be incorrect. The database now includes it with `.45acp`; missing fields are marked.
- `GunsMags!C57`: user also confirmed `Kimber Custom Mag` can be added in magazines; its name remains warning-marked and capacity/ammunition compatibility are missing.
- `GunsMags!D59`: user confirmed the malformed second `.45-70` row is an error and can be deleted from the spreadsheet. Morty's mod-author Discord confirmed: `Marlin 1895 (TTC_Winchester1873)` is a lever-action rifle using `.45-70` rounds (`TTC_AmmoBox_4570_20Rnd`, `TTC_Ammo_4570`). The database now includes `Marlin 1895` with `.45-70`.
- `GunsMags!A13`: user confirmed `ArexZero` can safely be added as a rifle, `9x19mm` is safe, and `ArexZero_mag_18Rnd` is an available magazine attachment. Both display names remain warning-marked; missing fields remain marked.

## Vehicle OCR items still requiring confirmation
User checked the vehicle trader data and confirmed that no vehicle trader entry should literally contain `$`. The exact replacement character (`5` vs `S`, or another OCR correction) was not supplied for these individual names, so they remain unresolved rather than guessed:

- `Jeep_GladiatorF$_Cargo_Door1 Black`
- `Jeep_CladiatorF$_Cargo_Door1 Brown`
- `Jeep_GladiatorF$_Trunk_DarkBlue`
- `Jeep_GladiatorF$_Trunk CamoBlack`
- `Jeep_GladiatorF$_Trunk CamoBlue`
-- Strangely, all the $ in the previous 5 Jeep entries is a 9. They should all be 'Jeep_GladiatorF9_
- `Bronco_Driverdoor $`
-- This might be an artifact from overlap between the 2 pages. I seem to have forgotten to highlight the last entry on the first page. The correct entry is 'Bronco_Driverdoor' If this already exists, then this one with the $ can be safely removed. 
- `2014 Chevy Tahoe Hea 20 $`
-- I think this one was my fault... You will notice some pink and cyan artifacts on some of the screen shots. These are because i had forgotton to hide my map markers in game. So they are showing through the translucent trader window. It is especially noticable at night. These are the only 2014 Chevy Tahoe variants. 2014 Chevy Tahoe variants LightBlue, 2014 Chevy Tahoe variants Black, 2014 Chevy Tahoe variants Blue, 2014 Chevy Tahoe variants Brown, 2014 Chevy Tahoe variants DarkBlue, 2014 Chevy Tahoe variants Green, 2014 Chevy Tahoe variants Pink, and 2014 Chevy Tahoe variants Red. If all of these exist, then this one with 'Hea 20 $' can be safely removed. Otherwise it should be replaced by the previous colors listed. 
- `Tahoe_cargot $`
- `Tahoe_cargo2 $`
-- These 2 should be Tahoe_cargo1 and Tahoe_cargo2. If these already exist, then these 2 can be safely deleted.
- `Tahoe_hood $`
- `Tahoe_trunk $`
- `Tahoe_wheel $`
-- These 3 are all correct if the last space and $ is removed. That would make them Tahoe_hood, Tahoe_trunk, and Tahoe_wheel. If these are duplicates, they can safely be removed.
- `Tahoe DriverDoor LightBlue $`
- `Tahoe CoDriverDoor LightBlue $`
-- These 2 remove the " $", leaving the names Tahoe DriverDoor LightBlue, and Tahoe CoDriverDoor LightBlue
- `Tahoe CargoDoor’ LightBlue $`
-- This one should be Tahoe CargoDoor1 LightBlue, or Tahoe CargoDoor2 LightBlue, whichever one is missing. If neither are missing, then this can safely be removed.
- `Tahoe DriverDoor Sreen a $`
--This should be Tahoe DriverDoor Green. (this is another that my map markers may have caused)
- `Tahoe CargoDoor2 Green $`
- `Tahoe Hood Green $`
- `Tahoe Trunk Green $`
-- These 3 should be Tahoe CargoDoor2 Green, Tahoe Hood Green, and Tahoe Trunk Green. 
- `Tahge DriverDoor Pink $`
- `Tahge CoDriverDoor Pink $`
- `Tahge CargoDoor1 Pink $`
-- These 3 should be Tahoe DriverDoor Pink, Tahoe CoDriverDoor Pink, and Tahoe CargoDoor1 Pink
- `Tahoe CargoDoor2 Pink $`
-- This should be Tahoe CargoDoor2 Pink
- `Tahge Hood Pink $`
- `Tahge Trunk Pink $`
- `Tahge DriverDoor Red $`
--These 3 are Tahoe Hood Pink, Tahoe Trunk Pink, and Tahoe DriverDoor Red.
- `Tahoe CoDriverDoor Red $`
- `Tahoe CargoDoor1 Red $`
- `Tahoe CargoDoor2 Red $`
--These 3 are all corrected by removing the " $" at the end, this would leave them Tahoe CoDriverDoor Red, Tahoe  CargoDoor1 Red, and Tahoe CargoDoor2 Red
- `Toyota4Runner CoDriverDoor Pink $`
-- This one should be Toyota4Runner CoDriverDoor Pink

## Review policy
- Confirmed information: no reliability icon.
- Inferred information: `ⓘ`.
- Confirmed unavailable / not applicable: `❌`.
- Information not found yet, or reported incorrect: `⚠`.
- Previously missing information that has since been corrected: `ⓘ` via the `corrected` state.
- No suspicious entry is silently converted into a guessed name or relationship.
