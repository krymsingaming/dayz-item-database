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
- `Bronco_Driverdoor $`
- `2014 Chevy Tahoe Hea 20 $`
- `Tahoe_cargot $`
- `Tahoe_cargo2 $`
- `Tahoe_hood $`
- `Tahoe_trunk $`
- `Tahoe_wheel $`
- `Tahoe DriverDoor LightBlue $`
- `Tahoe CoDriverDoor LightBlue $`
- `Tahoe CargoDoor’ LightBlue $`
- `Tahoe DriverDoor Sreen a $`
- `Tahoe CargoDoor2 Green $`
- `Tahoe Hood Green $`
- `Tahoe Trunk Green $`
- `Tahge DriverDoor Pink $`
- `Tahge CoDriverDoor Pink $`
- `Tahge CargoDoor1 Pink $`
- `Tahoe CargoDoor2 Pink $`
- `Tahge Hood Pink $`
- `Tahge Trunk Pink $`
- `Tahge DriverDoor Red $`
- `Tahoe CoDriverDoor Red $`
- `Tahoe CargoDoor1 Red $`
- `Tahoe CargoDoor2 Red $`
- `Toyota4Runner CoDriverDoor Pink $`

## Review policy
- Confirmed information: no reliability icon.
- Inferred information: `ⓘ`.
- Confirmed unavailable / not applicable: `❌`.
- Information not found yet, or reported incorrect: `⚠`.
- Previously missing information that has since been corrected: `ⓘ` via the `corrected` state.
- No suspicious entry is silently converted into a guessed name or relationship.
