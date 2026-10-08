User attachment

So i loaded up the alpha 7 build and found a few things. Rather then try to explain it in words, i thought an annotated image would be easier. Here is an explaination of the image, along what each item represents.

First the image. I have a screen capture of the item database page, and then below that the trader page. Each Item i have concerns with is circled, or square outlined and numbered to use as a referance. Below is what each number represents. 

    There is a decent amount of unused relistate on either side of the database in both item database, and trader database. It might be worth expanding the database area (not the category tree) to give more room for information on the entry bars.
    The "3 Records" is not needed on the left side. Only the Info marker on the right. And when moused over it should explain everything in one tooltip. Something like "This item has multple records with the same displayed name. Any ranges shown denote differences between entries. The individual entries can be seen once expanded.". The delay between mouse over of the info icon and the tooltip should also be much shorter. Maybe less then a second. The red "?" when mousing over the info icon is also not needed imo, but that isn't a priority and can be left if needed.
    The expand ">" is still on a second line. It should be on the right side of the same line as the item name like how i drew it in green, marked on the right side with a circle and 3.
    The attachment information is more then what fits in this section. Some items can have a ton of attachment points (think munghards backpack). Resolving issue "1" may allow enough room to keep attachments listed there. If something like Munghards still doesn't fit after making the changes in issue 1, then attachments might need to only be listed in details (first expansion), where clicking on each attachment point reveals the attachments available along with the attachment, single line information (just like if the attachment was what was being searched for) and when that attachment single line is expanded, then it lists the rest details for that attachment. 
    In my opinion the "Back to top" clickable should have a home on the bottom right of the details so the location is standardized. It also doesn't need to be a button like the attachment points, and could even be closer to the "back" that you get on the final details window, kind of in the style of a hyperlink. And this standardized location should probably be located near where i have the circle marked 5 on the right hand side.
    In the trader browser like the item database, it is still using 2 lines, Some of that seems to be the massive amount of space wasted by what noted as a green box marked 6. I also feel that most of the upgrades recommended for the item database should apply to the trader database to bring them more inline with each other visually. Including adding a categories style tree on the left side. Because this is for the trader database you can have each trader location, when expanded it shows the names of the traders, and when expanded again, shows the pages in the traders UI so the user can flip through the entire trader database to find a page they want with just a couple clicks. This also would remove the need for the location, trader, and category dropdowns if we wanted to get rid of them, again bringing both pages inline to standardize the look to make it easier to navigate. An example might be something like

Altar v
    Weapons Trader v
      Rifles
      SMG
      LMG
      etc.
    Weapons Supplies >
    Building Supplies >
    Clothing >
    etc.
Green Mountain >
Black Market >

I am using > to show an un-expanded category, and v to show an expanded one. Anywhere i put etc. is to just show that the rest of that level of category would be here. I may have gotten some of the category names incorrect, but this is just an example of the architecture for the category tree for traders. And of course any other observations i made about the category system and the bugs with it, should be looked at when implementing it in the trader database as well. We don't want to duplicate issues that should already be getting fixed on the item database side, into the trader side.

    Category should be the full category route as it displays in the Category Browser marked as 7a as an example: You end up with the MAK-54 Item on display. It says something like

MAK-54     Weapons/Firearms/Rifle     7.62x54mmR     Trader Info: ⚠

This provides the most important info up front. The item name, what it is (This should be the same as the category list on the left. If an item appears in multiple categories, we could probably just display the first one, and add a ⓘ icon, that when moused over just states that "This item falls into multiple categories and can also be found in:" With a list of other trees that the item is in. As an example take the MAK-54 Drum magazine. It might have "Weapons/Magazines ⓘ" on the main item display. But when moused over, It displays something like 
This item appears in multiple categories.
 You will also find it under:
Attachment/Magazines
**Anywhere else it occurs**

In this example i put "Anywhere else it occurs" to denote if there are more then 2 Categories that the item falls in. 

2a. In this example you will notice that i put a warning icon "⚠" (Although when i copy past it it shows as yellow here...). I think this is important. As indicated by the mark 2a. in the image, putting n/a in buy or sell price should only be used for confirmed data. If the trader entry shows no buy price but a sell price of 1000. Then the item database entry should show "Trader Info: Buy: n/a (or -, or No, or another symbol like 🚫 or ❌, Denoting that we aren't missing this info, the trader just doesn't do this action. We can even add a tooltip popup that states that, "❌Trader does not buy this item". Keeping the symbol that the user mouses over in the tooltip helps the user connect the symbol to the meaning. This should really be the standard anywhere a symbol with a popup is used.)

   7a. Also when clicking in the categories to expand through them, once you get to the final level and click, rather then displaying the items that fall into that category, it just closes all the categories and displays nothing. Unless  we end up with a laggy mess of a database, each level of category clicked should display the items listed. So as an example. If the player clicks weapons, it displays all weapons, so Firearms, Magazines, Melee Weapons, Throwables, and Firearm Components, on the right. If the player then clicks Throwables, the right filters to only display throwables. Later on if throwables is further refined into things like grenades, flares, etc, then they can refine it more. The idea behind the category tree is merely to allow players to visualize the the relationships and organization of the items in the database. It gives another way for a player to filter all the items down to the type of item they are looking for. A new player might not know what kind of tags they can type in the search box, so having everything laid out in a navigable tree helps.

Over all i think Alpha 7 is a big improvement, but also introduced some bugs to be squashed. If possible, on the next build, are you able to check for obvious bugs like how the category tree in the item database expands, but doesn't actually filter/navigate to the correct category, before providing a download for alpha 8. 

Thanks.
Worked for 5m 9s

Absolutely — the annotated image was much easier to work from. And yes, I treated this as a real Alpha 8 revision rather than just making the specific cosmetic changes you pointed out.

I also checked the obvious logic problems you called out before packaging it.
Alpha 8 changes

1. More usable horizontal space

    Increased the main content width substantially.
    Category tree keeps its own fixed-width area.
    The item/trader results get the extra space.
    This should make the primary information line considerably more comfortable.

2. Item rows are now genuinely one-line
The intended structure is now essentially:
SG 550 | Weapon/Firearms/Rifles | Caliber 7.62x39mm | Trader Info: Buy 🚫 Sell 1,400–3,000 | ⓘ | >

The > is on the far right of the same line.

The old 3 records text beside the name is gone.

3. One consolidated group-information tooltip
The right-side ⓘ explains:

    This item has multiple records with the same displayed name. Any ranges shown denote differences between entries. The individual entries can be seen once expanded.

I also removed the second price-range tooltip so we don't end up with a row covered in little ⓘ symbols.

4. Trader availability is now represented properly
This is an important correction.

If the database knows:
Buy: [nothing]
Sell: 1000

the item now displays:
Buy: 🚫  Sell: 1,000

Hovering 🚫 tells the user:

    Trader does not buy this item.

So 🚫 means confirmed unavailable, while a warning ⚠ can continue to mean something needs attention. We aren't using n/a to blur those two concepts anymore.

5. Category paths are now hierarchical
The category browser now supports things such as:
Weapon
  Firearms
    Rifles
    Sidearms
    Submachine Guns
    Shotguns
    Sniper Rifles
    Other Firearms

So the main line can show:
Weapon/Firearms/Rifles

rather than merely:
Firearm/Rifle

And, importantly, 190 of the current item records legitimately occur in multiple browse paths. Those paths are preserved rather than forcing each item into one arbitrary location.

For example, a magazine can be reachable through both:
Weapon/Magazines
Attachment/Magazines

and a backpack can eventually be reachable through both:
Storage/Backpacks
Back/Backpacks

The ⓘ on a multiply-classified item can tell the user where else to find it.

6. Category clicking was fixed
I specifically checked the taxonomy logic that was causing the problem you described.

Now clicking:
Weapon

shows all weapons.

Clicking:
Weapon → Throwables

filters down to throwables.

And clicking deeper categories continues narrowing the results rather than collapsing the tree and leaving you with an empty result set.

The tree also keeps the relevant parent levels open after selection.

I ran a taxonomy integrity check against all 2,519 item records:

    2,519/2,519 reachable through at least one category path
    0 orphaned records

So I didn't just fix the UI appearance; I checked the actual filtering logic against the dataset.
7. Trader Browser now uses the same navigation philosophy

This is probably the biggest structural change in Alpha 8.

The dropdowns are gone.

The Trader Browser now has its own left-side tree:
All traders

Altar ▼
    Weapon Trader ▼
        Rifles
        Sidearms
        Melee
        Grenades
        Sniper Rifles
        Shotguns
        Submachine Guns

    Weapon Supplies >
    Clothing >
    Base Building Supplies >
    Misc Trader >
    Cannabis/Drugs Trader >
    Hunting and Fishing >
    Event/Seasonal Item >
    Vehicles Trader >

Green Mountain >

Black Market >

Clicking:

    Altar → shows everything at Altar
    Weapon Trader → shows everything from that trader
    Rifles → shows only that trader's Rifles page

That means the Item Database and Trader Browser now use the same basic navigation language, which should make the whole site feel considerably less like two unrelated interfaces.

The actual trader data is still preserved underneath; this is only changing how it is browsed.
8. Trader rows got the same compact treatment

Trader entries now use the same basic horizontal structure as item entries.

They have:

    item name
    trader menu category
    useful item facts when the corresponding item record exists
    Buy/Sell
    right-side expansion arrow

So we're no longer maintaining two visually different database systems.
9. Back-to-top placement

I moved Back to top out of the attachment-button group.

It's now a small text-style link at the bottom-right of the expanded row, so its position is consistent instead of looking like another attachment.

Same treatment is used in trader rows.
10. Browser Back navigation

I also tightened up the history handling.

The app no longer needs to fetch the JSON again when navigating backward through the browser history. That was one of the things that could contribute to the NetworkError when attempting to fetch resource behavior you saw.

The intended navigation now behaves more like:
Database
   ↓
Item
   ↓
Related Item
   ↓
Trader
   ↓
Back
   ↓
Related Item

without treating each step like a new webpage load.

And, as before, clicking:

Noobs Only — Item Database

takes you home.
One thing I deliberately did not overcomplicate yet

Your idea for a Munghards-style item with a huge number of attachment points is good. I left the attachment-point count in the compact row and the actual attachment-point list in the first expansion.

That means the collapsed row might say:
Backpack   Storage/Backpacks   Storage 10x8   14 attachment points   ...

rather than trying to cram fourteen attachment names into the one-line summary.

If the first expanded level eventually becomes unwieldy for something like Munghards, that's where I'd introduce the nested attachment-point → compatible-item rows you described, rather than making the primary item bar any more crowded.

I think that's the cleaner breakpoint.
Alpha 8

Download DayZ Item Database Alpha 8

I also ran:

    JavaScript syntax validation
    JSON validation on all data files
    category-tree integrity check across all 2,519 records
    packaged the complete Alpha 8 build rather than just the modified files.

And I agree with your larger point here: the category tree isn't merely a filter control. It's part of the database's information architecture. That's why I made the tree itself authoritative for the displayed category path rather than maintaining a second, slightly different classification system in the item rows. That should save us a lot of weirdness later when the database gets much larger.
This might also interest you.
Ad

Awesome!. I think we might be getting close to a publishable build. A few refinements. 

First off navigation is much smoother, and over all there is a lot more space for the items over all. I also like your critique on the attachment points being keep out of the first layer of item info.

Now for a bug. It seems that none of the icons (🚫  , ⚠  or ⓘ) seem to explain anything anymore (no tooltip on mouseover, but the red ? still shows near the mouse cursor on mouseover. Could this have happened when trying to reduce the time before tooltip appears on mouse over?). Also since i am discussing the icons. Looking at the   🚫, compared to the other icons. I think ❌ would look better. I know i gave you the choice between the two, but the more i see the 2 next to each other, The more the red X meaning "not used" vs the stop/no symbol, makes sense to me.

A couple UI/Interface suggestions. The category box on the left does not need "All Items", as all items are displayed when clear is clicked, or the page banner is clicked. We also don't need Browse at the top of the category panel, as search already tells the user what the box is for, and "Category" at the top of the Category Hierarchy explains what that section does. So in the end all we need is at the top section, Search, Clear, and the actual search box. And the section below just Category, and the dropdowns (minus "All Items", you could technically make clicking "Category" accomplish the same function as clicking "Clear" if you wanted to, collapsing all categories, and giving you a blank slate).

Most of the item cards still do not display the full category pathing. As an example, the MAK-54 drum mag would be "Weapons/Firearms/Magazines" It is currently just Firearms/Magazines".

Another slight UI change. When expanding the categories, the next level should be indented so you can clearly see what group is part of what group. That way the user will have some way to see the grouping hierarchy. 

The trader info isn't using the updated changes to buy and sell price with the icons (again i like the red X over the No symbol). It should be clear between text, icon, and tooltip on mouse over, what information is reliable and what information is missing. 

While we don't want to fill the database with icons. I feel that it is going to be needed, at least until we have less missing information. Every field that is lacking information purely due to us not having it, should be marked with an icon that denotes it. There is most likely a way to do this cleanly, when info is missing from the database, as we have discussed before, it falls into a couple categories. I don't remember the exact ones you chose, but they basically end up being.

Information Missing:

     "The information is deliberately missing", for example a trader not having a buy price. This is information that is confirmed as missing it is the correct state
    "The information is missing because we have not found it yet", These would be drop only items that we haven't come across, A trader I haven't documented, the mod for an item not being confirmed. 
    "The information has been reported as incorrect", the info was missing or unconfirmed, and someone reported it as wrong, they provided a correction. 
    "The information WAS missing, but now has been corrected", This is through reports with screen shots, my personal observations, or files i may have access to in the future. Once corrected, this field would no longer have an icon unless reported as incorrect again (Like the server owner changed a trader price).

And of course this is purely for missing information. If the information isn't missing, then it falls into 2 categories. 

Information Exists:

    "Confirmed information", This would be information confirmed by me either through observation, Or extrapolated by you via proof (like the trader entries). This would be the only information that doesn't get an icon.
    "Inferred Information", this is information that was extrapolated or inferred by entries in the spreadsheet, trader listings, and possibly the wiki/workshop pages for the mods.

With these information states in mine. We have our 3 icons currently.

    Red X - This is reserved for Missing Information number 1. And a tooltip explains it (As we already discussed)
    Yellow i Circle - This is used with a toolip on mouse over explaining the situation with the information. It would be used for Missing Information 4, and Information Exists 2.
    Red ! Triangle - This is reserved for things we know are wrong, and we are basically asking users to help fix the issue. These would be for Missing information 2 or 3.

I hope this helps explain my idea for the symbols and tooltips. They exist purely to make users aware of things they can help with, or pointing out changes in the information, or possibly reliability issues with info.

I would also like to take a moment at this point and point out that there is a large amount of information we can add and infer based on the spreadsheet i submitted. 

loose ammunition information such as damage (I would put the diesel override where needed either in addition to the vanilla damage, or in a tool tip with the info icon. There is also a few unique cases that do 0 damage, but have a shock value. Wile i have never used these rounds and don't know what shock does, i assume it is similar to stun in most games, possibly knocking someone over, unconscious, or something similar. Of course none of that information should be added beyond the damage and shock value should be included as it is just my best guess as to the effect of shock. I will give an example of different bullet listings in a moment. And of course the information should be the same between the item db and trader db, with a link allowing you to switch between item db view and trader db view. (the only difference would be the Item db view would show the item and other items based on category, while the trader view would show the item and other items based on trader page. Of course already expanded to the first level. 

So yes, loose ammo. You can get the values from the spreadsheet and add them to the loose ammo based on the name in the trader for the boxed ammo, and the name in the bullet damage spreadsheet page. So for example:

There is a trader entry for "Boxed 9x19mm Rounds"

There is an entry under the "Name" column for Ammo_9x19 and Bullet_9x19. There are 2 entries, but they have the same data, so that doesn't matter.

Now, you can't shoot boxed ammunition, so the data from the Bullet Damage page of the spreadsheet would be applied to the loose 9x19mm ammo. 

Loose 9x19mm Rounds can now have Damage: 40, Mod: Vanilla

We can take that one step further and know what rounds a magazine uses as well.

We take a magazine entry from the trader pages. 

They basically come in 2 flavors. They tell you what gun they go too, or what platform they are used in. And they usually tell you the capacity as well. Lets take for example like  "75rd KA-M Drum Mag"

This tells us 3 things.

The capacity is 75 (75rd = 75 rounds)

It goes to the gun KA-M

And if you want to add it, the type of magazine is Drum.

If we then check for a KA-M entry, while it doesn't give us more information for the round. It does tell us that the KA-M Rifle, has a magazine slot, And it takes this drum mag.

This gives us a known attachment point for the KA-M, and a Magazine relationship that the KA-M takes "75rd KA-M Drum Mag"

While this doesn't work for the KA-M, where possible we might be able to compare the magazine or weapon name to the Guns/Mags and Bullet Damage Tabs of the spreadsheet, and possibly get the Caliber for a some of the weapons, along with some of the magazines that the weapon uses based on the name (See KA-M example above). If the spreadsheet says a gun takes a class of mags instead, like Stanag, NATO, Or AK Platform) then we might be able to get info from that too, although most of this type of info will be Black Market, and not usable yet.

This means if we can find the ammo to the weapon, and the magazine to the weapon between the trader entries and the spreadsheet, then that gives the relationship between the 3. So now we have the Caliber to the weapon, ammo to the magazine, etc. Unfortunately most of the guns/mags entries in the spreadsheet are modded weapons, (And just for information purposes, TWP is Teddies Weapon Pack, and TTC/TWC(I think one is a typo), is Morty's)

I should also point out that under most circumstances, the name of the item should have the most space. There are quite a few item names that are cut off by the category. Category should probably be shifted over a good bit to make room for some of the longer item names (Once again Drippy Sneakers, I'm looking at you...). That and possibly add the ability to adjust the individual columns. Even though the columns will have different kinds of information, if there are a set number of said columns (maybe 4 or 5) then they can be resized together, even if the individual entries are different fields. Take for example, if the player is somehow looking at a gun, magazine, backpack, and gloves at once. The Displayed fields might be as follows

Gun:  Name, Category path, Caliber, -Something-, and Trader info, (Not sure what would go in -Something-, maybe whatever is the highest bullet damage type and amount between Damage, Diesel override, and Shock.)

Magazine: Name, Category Path, Caliber, Capacity, and Trader info.

Backpack: Name, Category Path, Storage Space, Equipment Slot, Trader Info

Gloves: Name, Category Path, Insulation Level, Equipment Slot, Trader Info

The important thing is that even if the fields are different, there are still the same number of them (In this case 5). That way if column widths are adjusted, it will adjust cleanly the whole way down the line of items. 

Magazines should be in Magazines, not ammunition. If i had suggested it before, now that i see it, It doesn't work. Besides. Once caliber and ammo relationships are available, the user will be able to check magazines that take a specific caliber, and see what ammo fits in the selected magazine.

I also noticed some typos in the traders listings. Most likely this is from pulling the data from the trader images. 5 becoming S or $, things like that. You might be able to cross reference some of the trader entries with the spreadsheet and compare for spelling (Although this won't fix everything. Here are some i can call out. 

First in the ammo, both boxed and loose. Anywhere you have a dollar sign ($), should most likely be a 5. The caliber is 5.56 or 5.45xSomething. Not $.56 or 5.45xSomething.

Also some of the ammo's that have the number 45 is incorrectly transcribed as 4S. Like for example $.56x4Smm has both errors and should be 5.56x45mm. 

There is a 7.62x3 that should be 7.62x39mm Rounds (boxed and loose)

Anything 12ga (12 Gauge) is a shotgun ammunition, and has been misspelled in multiple places as 129a and1298. These need to be corrected. 

There is also "Buckshats", which should be Buckshots (per the trader) These 2 entries should be merged.

There is a "9x1" that can be removed, or merged as it is most likely 9x19mm Rounds (boxed and loose).

And a "boxed ." that can be removed. 

Just as a heads up, if you show me the image you extracted the data from, i can provide confirmation of what it should be. This would be the case for anything that doesn't look right based on the ammo names listed in bullet damage.

There are also more then the 4 Flare ammo listed in the Trader screen shots. Remember, if there is 2 pages, then both the first page and second page will have the same item highlighted, this is specifically done to prevent duplicates like we see with Flares. The 2 Flare at the top of the second screen shot, are the same as the 2 at the bottom of the 4x Flare on the first screen shot.

Speaking of the flares example. The entries on the trader page are not collapsed when same name. Flare should show one set of prices and that they are 4 entries. (info icon)

Since the guns list there ammo type in their description (which i couldn't include in the screen captures, i will add them when the database is live. If  you would like to make it easier for me, you could give me a list of suspicious item entries where you have partial information, or what was extracted from an image isn't very reliable, I can fill in just the missing information and paste it back. The easiest way would be to do something like 

You can do the same thing with the spreadsheet. There may have been times where i was editing the spreadsheet and bumped a key and it caused a cell to be cleared out or replaced with something wrong. I could also have been working on a modification to the database, and been unable to finish it before i started this project with you. Just give the same info, source (like the tab name and cell info (Eg. Bullet damage C:12), and i will either tell you what the information is supposed to be. Or if it is an error and safely be deleted. of course i will make the correction on my end as well, that way if i send the spreadsheet for evidence again, the new version has the corrections.

Basically if you give me the context, i can tell you what is missing. 

There are probably a lot more errors in the data extracted from the trader screen shots. So if you are able to go over them in more detail, then great. If not. Then we can systematically make corrections as i suggested above.
…
Worked for 10m 52s

Absolutely. I think this one is getting into the “this could actually be published” territory now.

I built Alpha 9 and made the changes as a combined UI + data cleanup pass rather than treating each issue independently.
Alpha 9 highlights

    Tooltips fixed properly. I replaced the CSS-only hover tooltips with a small global tooltip system. They appear after about 120 ms, so they're quick without being twitchy.
    The Firefox red ? cursor is gone; the icons use a normal pointer.
    🚫 has been changed to ❌.
    Icon meanings are now:
        ❌ = confirmed unavailable / does not apply
        ⓘ = inferred, under review, or important context
        ⚠ = missing information, unresolved issue, or action needed
        no icon = confirmed information
    The category panel is now just Category + Clear + Search, with no redundant “Browse” or “All Items.”
    Clicking Category itself resets to the complete database.
    Category levels are now visibly indented.
    The displayed classification now includes the entire category path, e.g.:
    Weapon/Firearms/Rifles
    Multiple category paths get one ⓘ explaining the alternate locations.
    Trader Browser follows the same navigation philosophy.
    Trader Browser now groups identical trader entries, so Flare is one row with 4 trader records, rather than four separate rows.
    Trader and item rows use the same compact layout.
    Trader prices now use the ❌ distinction for a confirmed unavailable buy/sell action.
    If a trader hasn't been documented at all, the trader information gets a ⚠ rather than pretending that means “not sold.”
    Primary item information now favors the useful stuff: caliber, magazine capacity, damage, storage, slot, etc.
    Missing key information can now be represented directly by an actionable marker rather than silently disappearing.
    Details now expose the more complete ballistics information.

I also went into the actual data

This wasn't just a UI pass.

I used the spreadsheet evidence you described and the actual Altar screenshots to add 21 loose-ammunition records with spreadsheet-backed ballistic data, including:

    Damage
    Shock where present
    Diesel Override
    Armor / Diesel Armor where the spreadsheet contains them
    Caliber

So, for example, 9x39 AP now has the recorded:

75 damage / 1215 Diesel Override / Armor 3 / Diesel Armor 115

without adding any guess about what “shock” actually does.

I also added magazine capacities from the trader names and direct weapon → magazine relationships where the trader listing itself establishes the relationship.

For example:

75rd KA-M Drum Mag → KA-M

and:

15rd Sporter 22 Mag → Sporter 22

Those inferred relationships are marked ⓘ, rather than pretending we personally verified them.
Trader cleanup

I also corrected the specific OCR problems you identified:

    129a → 12ga
    1298 → 12ga
    Buckshats → Buckshots
    7.62x3 → 7.62x39mm
    9x1 → removed rather than merging its obviously corrupted prices
    Boxed . → removed
    $/4S caliber OCR errors → corrected where the screenshot evidence makes the intended value unambiguous
    repeated pagination entries were merged where they were clearly the same ammunition/magazine record
    Flare now has exactly four trader entries, matching the actual first ammunition page rather than counting the two repeated transition entries from the next screenshot
    Magazine entries are now actually classified as Magazines, rather than accidentally sitting under Ammunition

I was deliberately conservative with things like the $ characters appearing in vehicle-part names. I don't want to turn a potentially meaningful vehicle identifier into 5 just because OCR often confuses those characters.
I also created a review file

There's now a DATA-REVIEW.md inside the build containing the remaining suspicious entries that I think you should resolve rather than me guessing.

It includes things like:
Trader-Altar / Weapon Supplies / Ammunition
BK-18 s e B0       B: —   S: 400
$c                  B: 550 S: 1400

and spreadsheet issues such as:
GunsMags!C57
Kimber Custom

appearing under the Buy column, and:
GunsMags!D59
`

under Sell.

That gives us a nice workflow now: I clean what the evidence establishes, and anything genuinely ambiguous gets handed back to you with enough context to correct it.
One important distinction I kept

I did not give corrected information a permanent ⓘ.

Once something is corrected and supported, it becomes normal confirmed information. The ⓘ is for things that are currently inferred or still under review, which keeps the published database from eventually becoming a Christmas tree of yellow icons.
Alpha 9

Download DayZ Item Database Alpha 9

Current build contains 2,495 item records, 2,484 trader listings, and 360 field-verification records after the pagination/OCR cleanup and the new ammunition/magazine enrichment.

I ran the JavaScript syntax check and validated every JSON file, including checks for dangling trader → item references.

One limitation on my end: I attempted a headless browser render check as well, but Chromium wouldn't complete in this environment, so I don't want to pretend I visually verified the rendered page when I couldn't. The code/data checks did pass.

And honestly, I think we're at the point where the next useful step is probably not another giant UI redesign. We can start concentrating on the remaining data-quality holes and the handful of UI behaviors that you actually encounter while using it.
This might also interest you.
Ad
I will slowly look over the data, and the checklist included over the next few days. 
So after this string of updates/changes, i would like to switch to a live model that is visible online. I don't plan on posting links anywhere. I will just have close friends go over the data and help report things as needed. So the next revision should probably be a "beta" Since i think we have hammered out pretty much all the major UI issues, and we really only need to hash out the data itself. I would also like to include a changelog if you could include one in the next build with each named stage, with the changes made. This is based on every prompt and reply. Anything before the Alpha builds would be listed as Pre-Alpha (use whatever format you want. But i would recommend using "0.0.1 pre-alpha" for the very first prompt, and minor changes would increase the number after the second decimal by 1. So using 0.0.1 as an example the first minor change would make it 0.0.2. If there is a major change then we increase the number after the first decimal, and the number after the second decimal goes to 0. So using 0.0.2 as an example, if we have a major update, it would change to 0.1.0. This is not a decimal number. So each section can go over 9 without increasing the number before it. Using 0.1.0 as an example, and we have 15 minor changes in a row. We would now be at 0.1.15, NOT 0.2.5. And of course all these example numbers would be followed by pre-alpha. Then whatever version number we are at when we go to the first alpha build and each build after would retain its alpha number. But any minor or major changes between the alpha builds would have there own minor/major number changes. So alpha 1 becomes Alpha 1.0.0. And the same minor/major change rules apply until we get to Alpha 2.0.0. And then once we get to the build you are about to make that would no longer be Alpha. and become beta from 1.0.0 on just like we did with pre-alpha and alpha. So this next build will be Beta 1.0.0. And the same minor and major update rules will apply. Whenever there is a new database build, please include the the changelog up to and including the version being worked on. If there is a better way to do version control with github, then you can walk me through putting all the unpublished pre-alpha and alpha builds in that. And how to make adjustments on each version after.

There is a major issue with vehicle keys in vehicle. It only lists like 4 in either trader or item database. and none of them by name or price seem to match the vehicle keys trader information. Basically i can fill in some info. Vehicle keys the trader sells (anything that ends in the word Key on the vehicle keys pages) Are functionally identical, you use the key on an unlocked vehicle, and it assigns the key to it. But other then the key showing that it has been assigned, no additional information will show on the key. So for example if you buy "Pink Vehicle Key" and assign it to a dodge ram. When you look at the key, it will still be called "Pink Vehicle Key" but it will say it was assigned. But not to what. So the number of keys and tags are so the player can keep track of what key goes to what vehicle. Next all vehicle keys have 1 attachment slot which is for key tags (Anything listed in the trader menus that end in the word "tag" by buying different keys and adding different tags, it gives a visual difference to the keys. So you can say something like, " The pink key is for the dodge ram, and the black one is for the ford bronco." Or maybe you had 2 yellow keys on hand and you assign one to a red ford raptor and the other to a black tahoe. You can then go and buy a red key tag and a black key tag, and put the red tag on the raptor key, and the black tag on the tahoe key. Then when you look at the 2 identical yellow keys in your inventory (with the tags attached) you can see the difference in the tags (the tag attachment changes the visual icon from just the key, to the key with the tag attached), and remember that the red tag is the red raptor, and the black tag is the black tahoe (or at least that is how i use keys and tags).
…
Worked for 5m 31s

I agree. Beta 1.0.0 is the right next step. At this point I don't think we need another “let's redesign the whole thing” cycle. The UI architecture is mature enough that real users poking at it will be more valuable than me continuing to theorize about how people might use it.

I built the Beta accordingly.
Beta 1.0.0

Download DayZ Item Database Beta 1.0.0
The big data fix: Vehicle Keys

I went back to the actual Vehicle Keys screenshots in the workbook rather than trying to repair the bad imported records.

The Beta now contains:

8 vehicle keys

    Vehicle Key
    Blue Vehicle Key
    Green Vehicle Key
    White Vehicle Key
    Yellow Vehicle Key
    Red Vehicle Key
    Purple Vehicle Key
    Pink Vehicle Key

All are Buy: 5,000.

And 20 key-tag records, all Buy: 1,500:

    Vehicle Key Tag
    Olga 24 Black Tag
    Olga 24 White Tag
    Olga 24 Wine Tag
    Ada 4x4 Blue Tag
    Ada 4x4 White Tag
    Ada 4x4 Green Tag
    Gunter 2 Blue Tag
    Gunter 2 Black Tag
    Gunter 2 Red Tag
    Sarka 120 Grey Tag
    Sarka 120 Red Tag
    Sarka 120 Yellow Tag
    Black Tag
    Blue Tag
    Green Tag
    Grey Tag
    Red Tag
    White Tag
    Yellow Tag

I removed the previous 24 corrupted Vehicle Keys listings and replaced them with the 28 records actually represented by the two screenshot pages. The second screenshot's repeated items are treated as pagination overlap rather than additional purchases.

I also corrected something important: none of these listings has a sell price. The previous imported data had Sell: 1500, which was wrong.
Key relationships

Every vehicle key now has:
Key Tag
Quantity: 1
Accepts: Vehicle Key Tags

And the tags have reverse Fits Into relationships to the vehicle keys.

I also documented the behavior you just explained:

    assigning a key to an unlocked vehicle does not identify the vehicle on the key
    the key continues to be identified by its color/name
    the key shows that it has been assigned
    a tag provides a visual distinction
    multiple otherwise identical keys can therefore be tracked by their tags

That's actually a very useful piece of database information because it explains why the apparently redundant colored keys and tags exist rather than merely listing them as miscellaneous items.
Changelog

I added:

CHANGELOG.md

and also:

VERSION.json

The site itself now says:

    Beta 1.0.0

The changelog contains the progression through:
Pre-Alpha
  0.0.1 ...
  ...
Alpha
  Alpha 1.0.0
  Alpha 2.0.0
  ...
  Alpha 9.0.0
Beta
  Beta 1.0.0

I made one deliberate distinction in the historical section: the Pre-Alpha history is marked as reconstructed. I don't have a complete machine-readable transcript of every single early conversational turn available to me, so I don't want to invent fake precision and claim that 0.0.7 corresponds to exactly one particular prompt when I can't prove that.

From Beta onward, we'll have a proper exact changelog.
I think GitHub Releases are the better version-control solution

I checked the current GitHub documentation, and your instinct here is good: don't dump every old ZIP into the live repository.

The cleaner setup is:
Repository
│
├── current live Beta files
│
├── CHANGELOG.md
├── VERSION.json
│
└── Git history
     │
     ├── v0.0.1-pre-alpha
     ├── v0.0.2-pre-alpha
     ├── ...
     ├── v1.0.0-alpha
     ├── v2.0.0-alpha
     ├── ...
     ├── v9.0.0-alpha
     └── v1.0.0-beta

Git tags point to a specific commit, so they preserve exactly what the project looked like at that point. GitHub Releases can then attach the corresponding ZIP and release notes. That's exactly what GitHub recommends releases/tags for.
One wrinkle

We cannot reconstruct the actual old Git commits for Alpha 1–9 unless those builds/commits are already in your GitHub repository.

So I would not pretend that uploading an Alpha 3 ZIP today somehow creates its historical Git history.

Instead:

    preserve the historical build information in CHANGELOG.md
    keep the old ZIPs locally for reference
    start real Git version control now
    make Beta 1.0.0 the first properly tagged release

Then every future build is easy.

For example:
Beta 1.0.0
    ↓ small correction
Beta 1.0.1
    ↓ another correction
Beta 1.0.2
    ↓ substantial new feature
Beta 1.1.0
    ↓ 15 small changes
Beta 1.1.15
    ↓ major structural change
Beta 2.0.0

Exactly the numbering system you described.

GitHub Desktop can create and push tags directly from a commit, and GitHub Releases can then be created from those tags.
Getting Beta 1.0.0 live

Since your repository already exists, the simplest route is:

    Open your DayZ Item Database GitHub repository.
    Replace the existing website files with the contents of the Beta ZIP.
    Do not upload the ZIP itself into the website's file structure.
    Make sure these remain at the repository root:

index.html
app.js
style.css
CHANGELOG.md
VERSION.json
data/

    Commit the changes with something like:

Release Beta 1.0.0

    GitHub Pages should then publish the new main branch contents if your existing Pages configuration is still active.

If Pages needs to be re-enabled, GitHub's current path is:

Repository → Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save.

GitHub Pages is available on public repositories under GitHub Free, and branch/root publishing is specifically supported for this kind of static site.
Then make the first real tag

After the Beta commit exists:

Releases → Draft a new release

Create:
Tag: v1.0.0-beta
Title: Beta 1.0.0

and attach the Beta ZIP if you want the exact build downloadable later.

GitHub specifically supports attaching binary files such as ZIPs to releases.
One thing I want to change about our workflow from here

I think we've earned ourselves a much nicer process now.

You don't need to send me a giant list of every tiny UI thought anymore.

Going forward:

    Beta = data correction, data enrichment, testing, and small UI fixes.

If you or a friend find something like:

    “This says 5000 but the trader actually says 7500.”

That's a Beta patch.

If we discover:

    “The database needs an entirely new relationship system.”

That's a Beta minor/major architectural change, and we'll bump appropriately.

And if you eventually reach the point where your friends have beaten the database with sticks for a while and you're satisfied with the data, that's when we can talk about a 1.0.0 production release.

For now, I'd consider Beta 1.0.0 the first genuinely useful public-testing build, even though it's intentionally not being advertised publicly. That's a much better place to be than continuing to call it Alpha while we spend the next several weeks filling in data.

I looked through DATA-REVIEW.md

anything  lead by -- is a response by me to a concern posted.

Here is a copy of the contents of this file with my corrections. Also, There were a decent amount of notes on changes made by you without any question or concern about the data validity. 

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
-- No entry found that is similar in Weapon Supplies / Ammunition. I did however see a BK-18 in Weapons Trader / Shotguns. The Entry is 'Sawed-off BK-18 - Buy: 1500 / Sell: 400
- `$c` — Buy: 550 / Sell: 1400
-- No item should have a higher sell price then buy price or the economy would crash lol. Endlessly buy items and then sell them back for more then bought for. I would recommend comparing the entries in the database to the where this entry was pulled from. If you are able to find the record that is missing and is represented by this then a correction can be made. Otherwise I recommend removing this database entry as there is no meaningful data that can be used to find out what the item is.
- `Boxed 5.45x39mm Rounds` and other corrected ammo entries are now normalized where the screenshot itself confirms the text.

-- This is not a review concern, i'm unsure why it is in this file.

### Weapon Supplies / Magazines
- `Srd Pioneer Mag` appears in the extracted data. The screenshot shows a `5rd Pioneer Mag`; this can be safely corrected if desired, but is recorded here as an OCR review point.
- `30rd KA-MA Mag` does not have an obvious exact counterpart in the current item records; it was not silently mapped to KA-M.
-- Looking through the trader screen captures, for similar mags, there is 30rd KA-M Mag, 30rd KA-M Polymer Mag, 75rd KA-M Drum Mag, 30rd KA-101 Mag, 30rd KA-74 Mag, 45rd KA-74 Mag. If all these entries exist. Then i would recommend removing the 30rd KA-MA Mag as it is not a magazine listing in the trader data for this category.

### Vehicle / other OCR candidates
Several `$` characters occur in vehicle-part names. These were NOT globally replaced with `5` because some are part of model/variant text and require the source screenshot for confirmation.
-- I looked through every vehicle trader entry, and not a single one had a $ in the name. There are however quite a few entries that have a 5 or S in them. If you provide context on what entry is concerning, i can verify whether the character is a 5 or S. 

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

-- Once again. This is just info of changes made. I see no concern here.

Rows 2, 3, 5, 9–21, 26, 30–32, 40–42, 44, 46–50, 54, 56–57 contain values but no Display Name in column A. They were not assigned to current database items solely from numeric values.

-- This is an artifact from me trying to add display names to some of the spreadsheets. I didn't get started on the bullet damage tab beyond adding the display name column and i think maybe one entry. If there isn't enough data to extrapolate relationships then safely ignore them.

### GunsMags
Two obvious spreadsheet anomalies worth checking manually:
- `GunsMags!C57`: value `Kimber Custom` appears under the Buy column; this looks like a shifted/mis-entered value rather than a price.

-- I checked the cell history for this and it looks like the error has been there since before i took over the spreadsheet. "Kimber Custom" can safely be added as a gun name, and "Kimber Custom Mag" added in mags, However both should have a warning icon saying that the display name may be incorrect, and also icons to mark missing fields.
- `GunsMags!D59`: value `` ` `` appears under Sell for a `.45-70` row.

-- The only gun i am aware of that shoots the 45-70 is the Marlin. I believe the second entry is in error. I went to Morty's (the mod author) discord and verified that this is the case. The second entry can safely be deleted, This is the entry for the weapon:
Marlin 1895 (TTC_Winchester1873) is a lever action rifle that shoots .45-70 rounds(TTC_AmmoBox_4570_20Rnd,TTC_Ammo_4570)


- `GunsMags!A13` is blank while a magazine identifier is present in F13 (`ArexZero_mag_18Rnd`).

-- ArexZero is safe to add as a rifle with this mag as it's available mag attachment. Make sure to place the icons to show that the weapon and magazine names may be incorrect, and any icons to show missing information. The caliber can safely be kept as 9x19mm. I will check the discussion boards for this weapon on the mod authors page, or possibly get more info when i check black market.


These were not silently repaired.


