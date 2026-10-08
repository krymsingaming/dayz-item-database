# Alpha 9 Data Review Notes

This file records source-backed cleanup and remaining suspicious entries that were intentionally NOT guessed.

## Confirmed Trader-Altar OCR corrections applied
- `Boxed 129a OO Buckshats` -> `Boxed 12ga 00 Buckshots`
- `Boxed 1298 Rifled Slugs` -> `Boxed 12ga Rifled Slugs`
- `Boxed 7.62x3` -> `Boxed 7.62x39mm Rounds`
- `Boxed 9x1` -> `Boxed 9x19mm Rounds`
- `Boxed .` -> removed as garbage OCR
- `$.45x39mm` / `$.56x4Smm` ammo OCR -> corrected to 5.45x39mm / 5.56x45mm forms
- duplicate pagination records in Weapon Supplies ammunition/magazines were merged when the same item and prices were repeated
- Flare pagination duplicates were reduced to the four actual trader entries visible on the first ammunition page

## Remaining suspicious Trader-Altar entries
These were left alone because the screenshots/data do not provide enough evidence to safely guess the intended text.

### Weapon Supplies / Ammunition
- `BK-18 s e B0` — Buy: — / Sell: 400
- `$c` — Buy: 550 / Sell: 1400
- `Boxed 5.45x39mm Rounds` and other corrected ammo entries are now normalized where the screenshot itself confirms the text.

### Weapon Supplies / Magazines
- `Srd Pioneer Mag` appears in the extracted data. The screenshot shows a `5rd Pioneer Mag`; this can be safely corrected if desired, but is recorded here as an OCR review point.
- `30rd KA-MA Mag` does not have an obvious exact counterpart in the current item records; it was not silently mapped to KA-M.

### Vehicle / other OCR candidates
Several `$` characters occur in vehicle-part names. These were NOT globally replaced with `5` because some are part of model/variant text and require the source screenshot for confirmation.

## Spreadsheet review points
### Bullet Damage
The rows used for the new loose-ammunition ballistics are direct spreadsheet values:
- Row 6 `Bullet_9x39AP`: Damage 75, Diesel Override 1215, Armor 3, Diesel Armor 115
- Row 24 `Bullet_762x54`: Damage 150
- Row 25 `Bullet_762x54Tracer`: Damage 150
- Row 33 `Bullet_545x39`: Damage 115
- Row 34 `Bullet_545x39Tracer`: Damage 115
- Row 35 `Bullet_556x45`: Damage 110, Diesel Override 125
- Row 37 `Bullet_556x45Tracer`: Damage 110
- Row 38 `Bullet_762x39`: Damage 110
- Row 39 `Bullet_762x39Tracer`: Damage 110
- Row 43 `Bullet_9x39`: Damage 75, Diesel Override 150
- Row 45 `Bullet_357`: Damage 65
- Row 51 `Bullet_45ACP`: Damage 40, Diesel Override 95.5
- Row 52 `Ammo_9x19`: Damage 40
- Row 53 `Bullet_9x19`: Damage 40
- Row 55 `Bullet_12GaugePellets`: Damage 35
- Row 58 `Bullet_22`: Damage 20, Diesel Override 100
- Row 59 `Bullet_Flare`: Damage 10

Rows 2, 3, 5, 9–21, 26, 30–32, 40–42, 44, 46–50, 54, 56–57 contain values but no Display Name in column A. They were not assigned to current database items solely from numeric values.

### GunsMags
Two obvious spreadsheet anomalies worth checking manually:
- `GunsMags!C57`: value `Kimber Custom` appears under the Buy column; this looks like a shifted/mis-entered value rather than a price.
- `GunsMags!D59`: value `` ` `` appears under Sell for a `.45-70` row.
- `GunsMags!A13` is blank while a magazine identifier is present in F13 (`ArexZero_mag_18Rnd`).

These were not silently repaired.
