// ============================================
// DayZ Item Database
// Main Application
// ============================================

let items = [];

let mods = [];

let currentItemId = null;

let navigationStack = [];


// ---------- Page Elements ----------

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sourceFilter =
    document.getElementById("sourceFilter");

const itemResults =
    document.getElementById("itemResults");

const resultCount =
    document.getElementById("resultCount");

const itemModal =
    document.getElementById("itemModal");

const modalBody =
    document.getElementById("modalBody");

const modalClose =
    document.getElementById("modalClose");

const modalBackground =
    document.getElementById("modalBackground");

const reportLink =
    document.getElementById("reportLink");


// ---------- Quick Preview ----------

const quickPreview =
    document.createElement("div");

quickPreview.className =
    "relationship-preview";

document.body.appendChild(
    quickPreview
);


// ---------- Load Database ----------

async function loadItems() {

    try {

        const [
            itemsResponse,
            modsResponse
        ] = await Promise.all([

            fetch("data/items.json"),

            fetch("data/mods.json")

        ]);


        if (!itemsResponse.ok) {

            throw new Error(
                "Unable to load item database."
            );

        }


        if (!modsResponse.ok) {

            throw new Error(
                "Unable to load mod database."
            );

        }


        items =
            await itemsResponse.json();

        mods =
            await modsResponse.json();


        initializeFilters();

        displayItems();


    } catch (error) {

        console.error(error);


        itemResults.innerHTML = `

            <p>
                Unable to load the database.
            </p>

        `;


        resultCount.textContent =
            "Database error";

    }
}


// ---------- Filters ----------

function initializeFilters() {

    const categories = [
        ...new Set(
            items
                .map(item => item.category)
                .filter(Boolean)
        )
    ];

    categories.sort();

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value =
            category;

        option.textContent =
            category;

        categoryFilter.appendChild(option);
    });


    const sources = [
        ...new Set(
            items
                .map(item => getSourceName(item))
                .filter(Boolean)
        )
    ];

    sources.sort();

    sources.forEach(source => {

        const option =
            document.createElement("option");

        option.value =
            source;

        option.textContent =
            source;

        sourceFilter.appendChild(option);
    });
}


// ---------- Source ----------

function getSourceName(item) {

    if (!item.source) {
        return "Unknown";
    }


    if (item.source.vanilla) {
        return "Vanilla DayZ";
    }


    if (item.source.modId) {

        const mod =
            mods.find(
                mod =>
                    mod.id ===
                    item.source.modId
            );


        if (mod) {
            return mod.name;
        }

    }


    return "Unknown";
}

// ---------- Find Item ----------

function findItem(id) {

    return items.find(
        item => item.id === id
    );
}


// ---------- Search ----------

function getFilteredItems() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const selectedSource =
        sourceFilter.value;


    return items.filter(item => {

        const searchableText = [

            item.name,

            item.category,

            item.subcategory,

            getSourceName(item),

            item.description,

            ...(item.tags || [])

        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


        const matchesSearch =
            !searchTerm ||
            searchableText.includes(
                searchTerm
            );


        const matchesCategory =
            !selectedCategory ||
            item.category ===
                selectedCategory;


        const matchesSource =
            !selectedSource ||
            getSourceName(item) ===
                selectedSource;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesSource
        );
    });
}


// ---------- Display Items ----------

function displayItems() {

    const filteredItems =
        getFilteredItems();


    itemResults.innerHTML = "";


    resultCount.textContent =
        `${filteredItems.length} ${
            filteredItems.length === 1
                ? "item"
                : "items"
        }`;


    if (filteredItems.length === 0) {

        itemResults.innerHTML = `
            <p>
                No items found.
            </p>
        `;

        return;
    }


    filteredItems.forEach(item => {

        const card =
            document.createElement("div");

        card.className =
            "item-card";


        const sourceName =
            getSourceName(item);


        const subcategory =
            item.subcategory
                ? ` → ${item.subcategory}`
                : "";


        let previewRows = "";


        if (item.inventory?.size) {

            previewRows += `
                <div class="item-preview-row">
                    Inventory:
                    ${escapeHtml(
                        item.inventory.size
                    )}
                </div>
            `;
        }


        if (item.storage?.capacity) {

            previewRows += `
                <div class="item-preview-row">
                    Storage:
                    ${item.storage.capacity}
                    slots
                </div>
            `;
        }


        if (item.economy?.traders?.length) {

            previewRows += `
                <div class="item-preview-row">
                    Traders:
                    ${item.economy.traders.length}
                </div>
            `;
        }


        card.innerHTML = `

            <h3>
                ${escapeHtml(item.name)}
            </h3>

            <p>
                ${escapeHtml(
                    item.category ||
                    "Uncategorized"
                )}
                ${escapeHtml(subcategory)}
            </p>

            <p>
                ${escapeHtml(sourceName)}
            </p>

            <div class="item-preview">

                <div class="item-preview-title">
                    ${escapeHtml(item.name)}
                </div>

                ${previewRows}

                <div class="item-preview-hint">
                    Click for full details
                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            () => openItemModal(item)
        );


        itemResults.appendChild(card);

    });
}


// ---------- Relationship Labels ----------

const relationshipLabels = {

    ammo: "Ammunition",

    magazines: "Magazines",

    attachments: "Attachments",

    compatibleWeapons: "Compatible Weapons",

    compatibleMagazines: "Compatible Magazines",

    vehicles: "Vehicles",

    parts: "Parts",

    unlocks: "Unlocks",

    creates: "Creates",

    requiredFor: "Required For"

};


// ---------- Get Reverse Relationships ----------

function getReverseRelationships(
    targetId
) {

    const results = [];


    items.forEach(item => {

        if (!item.relationships) {
            return;
        }


        Object.entries(
            item.relationships
        ).forEach(
            ([relationshipType, ids]) => {

                if (!Array.isArray(ids)) {
                    return;
                }


                if (
                    ids.includes(targetId)
                ) {

                    results.push({

                        type:
                            relationshipType,

                        item:
                            item

                    });

                }

            }
        );

    });


    return results;
}


// ---------- Relationship Display ----------

function createRelatedItemLink(
    item
) {

    const wrapper =
        document.createElement("span");

    wrapper.className =
        "related-item-wrapper";


    const link =
        document.createElement("button");

    link.className =
        "related-item";

    link.type =
        "button";

    link.textContent =
        item.name;


    link.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            hideQuickPreview();

            openItemModal(
                item,
                true
            );

        }
    );


    link.addEventListener(
        "mouseenter",
        event => {

            showQuickPreview(
                item,
                event
            );

        }
    );


    link.addEventListener(
        "mouseleave",
        hideQuickPreview
    );


    wrapper.appendChild(link);

    return wrapper;
}


// ---------- Show Quick Preview ----------

function showQuickPreview(
    item,
    event
) {

    let html = `

        <div class="relationship-preview-title">
            ${escapeHtml(item.name)}
        </div>

        <div class="relationship-preview-row">
            ${escapeHtml(
                item.category ||
                "Uncategorized"
            )}
        </div>

        <div class="relationship-preview-row">
            ${escapeHtml(
                getSourceName(item)
            )}
        </div>

    `;


    if (item.inventory?.stackSize) {

        html += `
            <div class="relationship-preview-row">
                Stack:
                ${item.inventory.stackSize}
            </div>
        `;
    }


    if (item.storage?.capacity) {

        html += `
            <div class="relationship-preview-row">
                Storage:
                ${item.storage.capacity}
                slots
            </div>
        `;
    }


    if (item.ammo?.boxQuantity) {

        html += `
            <div class="relationship-preview-row">
                Box:
                ${item.ammo.boxQuantity}
                rounds
            </div>
        `;
    }


    if (item.magazine?.capacity) {

        html += `
            <div class="relationship-preview-row">
                Capacity:
                ${item.magazine.capacity}
                rounds
            </div>
        `;
    }


    if (
        item.economy?.traders?.length
    ) {

        const trader =
            item.economy.traders[0];


        html += `
            <div class="relationship-preview-row">
                Buy:
                ${formatPrice(trader.buy)}
                &nbsp; / &nbsp;
                Sell:
                ${formatPrice(trader.sell)}
            </div>
        `;
    }


    html += `
        <div class="relationship-preview-hint">
            Click for full details
        </div>
    `;


    quickPreview.innerHTML =
        html;


    quickPreview.classList.add(
        "visible"
    );


    positionQuickPreview(
        event
    );
}


// ---------- Position Preview ----------

function positionQuickPreview(
    event
) {

    const padding = 12;

    const rect =
        quickPreview.getBoundingClientRect();


    let left =
        event.clientX + 15;

    let top =
        event.clientY + 15;


    if (
        left + rect.width >
        window.innerWidth - padding
    ) {

        left =
            event.clientX -
            rect.width -
            15;
    }


    if (
        top + rect.height >
        window.innerHeight - padding
    ) {

        top =
            event.clientY -
            rect.height -
            15;
    }


    quickPreview.style.left =
        `${Math.max(
            padding,
            left
        )}px`;

    quickPreview.style.top =
        `${Math.max(
            padding,
            top
        )}px`;
}


// ---------- Hide Preview ----------

function hideQuickPreview() {

    quickPreview.classList.remove(
        "visible"
    );
}


// ---------- Open Item ----------

function openItemModal(
    item,
    addToHistory = false
) {

    hideQuickPreview();


    if (
        addToHistory &&
        currentItemId
    ) {

        navigationStack.push(
            currentItemId
        );
    }


    currentItemId =
        item.id;


    modalBody.innerHTML =
        buildItemDetails(item);


    itemModal.classList.add(
        "visible"
    );

    itemModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";


    const backButton =
        document.getElementById(
            "modalBack"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );
    }
}


// ---------- Build Details ----------

function buildItemDetails(
    item
) {

    let html = `

        <div class="item-detail-header">

            <div class="modal-navigation">

                <button
                    id="modalBack"
                    class="modal-back"
                    ${
                        navigationStack.length === 0
                            ? "disabled"
                            : ""
                    }
                >
                    ← Back
                </button>

            </div>

            <h2 id="modalItemName">
                ${escapeHtml(item.name)}
            </h2>

            <div class="item-detail-subtitle">

                ${escapeHtml(
                    item.category ||
                    "Uncategorized"
                )}

                ${
                    item.subcategory
                        ? " → " +
                          escapeHtml(
                              item.subcategory
                          )
                        : ""
                }

            </div>

        </div>

    `;


    // ---------- Basic Information ----------

html += `

        <section class="detail-section">

            <h3>
                Basic Information
            </h3>

            <div class="detail-row">

                <span class="detail-label">
                    Source
                </span>

                <span class="detail-value">
                    ${escapeHtml(
                        getSourceName(item)
                    )}
                </span>

            </div>

            ${buildModInformation(item)}

            <div class="detail-row">

                <span class="detail-label">
                    Database ID
                </span>

                <span class="detail-value">
                    ${escapeHtml(
                        item.id || "—"
                    )}
                </span>

            </div>

        </section>

    `;


    // ---------- Inventory ----------

    if (item.inventory) {

        html += `

            <section class="detail-section">

                <h3>
                    Inventory
                </h3>

        `;


        if (item.inventory.size) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Inventory Size
                    </span>

                    <span class="detail-value">
                        ${escapeHtml(
                            item.inventory.size
                        )}
                    </span>

                </div>

            `;
        }


        if (
            item.inventory.stackSize !==
            undefined
        ) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Stack Size
                    </span>

                    <span class="detail-value">
                        ${item.inventory.stackSize}
                    </span>

                </div>

            `;
        }


        html += `
            </section>
        `;
    }


    // ---------- Storage ----------

    if (item.storage) {

        html += `

            <section class="detail-section">

                <h3>
                    Storage
                </h3>

                <div class="detail-row">

                    <span class="detail-label">
                        Capacity
                    </span>

                    <span class="detail-value">
                        ${item.storage.capacity}
                        slots
                    </span>

                </div>

            </section>

        `;
    }


    // ---------- Weapon ----------

    if (item.weapon) {

        html += `

            <section class="detail-section">

                <h3>
                    Weapon
                </h3>

        `;


        if (item.weapon.caliber) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Caliber
                    </span>

                    <span class="detail-value">
                        ${escapeHtml(
                            item.weapon.caliber
                        )}
                    </span>

                </div>

            `;
        }


        html += `
            </section>
        `;
    }


    // ---------- Ammo ----------

    if (item.ammo) {

        html += `

            <section class="detail-section">

                <h3>
                    Ammunition
                </h3>

        `;


        if (item.ammo.caliber) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Caliber
                    </span>

                    <span class="detail-value">
                        ${escapeHtml(
                            item.ammo.caliber
                        )}
                    </span>

                </div>

            `;
        }


        if (item.ammo.boxQuantity) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Box Quantity
                    </span>

                    <span class="detail-value">
                        ${item.ammo.boxQuantity}
                        rounds
                    </span>

                </div>

            `;
        }


        html += `
            </section>
        `;
    }


    // ---------- Magazine ----------

    if (item.magazine) {

        html += `

            <section class="detail-section">

                <h3>
                    Magazine
                </h3>

        `;


        if (item.magazine.capacity) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Capacity
                    </span>

                    <span class="detail-value">
                        ${item.magazine.capacity}
                        rounds
                    </span>

                </div>

            `;
        }


        if (item.magazine.caliber) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Caliber
                    </span>

                    <span class="detail-value">
                        ${escapeHtml(
                            item.magazine.caliber
                        )}
                    </span>

                </div>

            `;
        }


        html += `
            </section>
        `;
    }


    // ---------- Gear ----------

    if (item.gear) {

        html += `

            <section class="detail-section">

                <h3>
                    Equipment
                </h3>

        `;


        if (item.gear.equipmentSlot) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Equipment Slot
                    </span>

                    <span class="detail-value">
                        ${escapeHtml(
                            item.gear.equipmentSlot
                        )}
                    </span>

                </div>

            `;
        }


        html += `
            </section>
        `;
    }


    // ---------- Traders ----------

    if (
        item.economy?.traders?.length
    ) {

        html += `

            <section class="detail-section">

                <h3>
                    Trader Information
                </h3>

        `;


        item.economy.traders.forEach(
            trader => {

                html += `

                    <div class="detail-row">

                        <span class="detail-label">
                            ${escapeHtml(
                                trader.name
                            )}
                        </span>

                        <span class="detail-value">

                            Buy:
                            ${formatPrice(
                                trader.buy
                            )}

                            &nbsp;&nbsp;

                            Sell:
                            ${formatPrice(
                                trader.sell
                            )}

                        </span>

                    </div>

                `;
            }
        );


        html += `
            </section>
        `;
    }


    // ---------- Acquisition ----------

    if (
        item.acquisition?.length
    ) {

        html += `

            <section class="detail-section">

                <h3>
                    Acquisition
                </h3>

                <div class="tag-list">
        `;


        item.acquisition.forEach(
            method => {

                html += `
                    <span class="tag">
                        ${escapeHtml(
                            formatLabel(method)
                        )}
                    </span>
                `;

            }
        );


        html += `

                </div>

            </section>

        `;
    }


    // ---------- Relationships ----------

    html +=
        buildRelationshipSection(
            item
        );


    // ---------- Reverse Relationships ----------

    html +=
        buildReverseRelationshipSection(
            item
        );


    // ---------- Tags ----------

    if (item.tags?.length) {

        html += `

            <section class="detail-section">

                <h3>
                    Tags
                </h3>

                <div class="tag-list">
        `;


        item.tags.forEach(tag => {

            html += `
                <span class="tag">
                    ${escapeHtml(tag)}
                </span>
            `;

        });


        html += `

                </div>

            </section>

        `;
    }


    // ---------- Description ----------

    if (item.description) {

        html += `

            <section class="detail-section">

                <h3>
                    Description
                </h3>

                <div class="description">
                    ${escapeHtml(
                        item.description
                    )}
                </div>

            </section>

        `;
    }


    return html;
}

function buildModInformation(item) {

    if (
        !item.source ||
        item.source.vanilla ||
        !item.source.modId
    ) {

        return "";

    }


    const mod =
        mods.find(
            mod =>
                mod.id ===
                item.source.modId
        );


    if (!mod) {
        return "";
    }


    return `

        <div class="detail-row">

            <span class="detail-label">
                Mod Type
            </span>

            <span class="detail-value">
                ${escapeHtml(
                    mod.type
                )}
            </span>

        </div>

    `;
}

// ---------- Forward Relationships ----------

function buildRelationshipSection(
    item
) {

    if (!item.relationships) {
        return "";
    }


    let html = "";


    Object.entries(
        item.relationships
    ).forEach(
        ([type, ids]) => {

            if (!Array.isArray(ids)) {
                return;
            }


            const relatedItems =
                ids
                    .map(id =>
                        findItem(id)
                    )
                    .filter(Boolean);


            if (
                relatedItems.length === 0
            ) {
                return;
            }


            html += `

                <section class="detail-section">

                    <h3>
                        ${escapeHtml(
                            relationshipLabels[type] ||
                            formatLabel(type)
                        )}
                    </h3>

                    <div class="related-item-list">

            `;


            relatedItems.forEach(
                relatedItem => {

                    const link =
                        createRelatedItemLink(
                            relatedItem
                        );


                    html +=
                        link.outerHTML;

                }
            );


            html += `

                    </div>

                </section>

            `;
        }
    );


    return html;
}


// ---------- Reverse Relationships ----------

function buildReverseRelationshipSection(
    item
) {

    const reverse =
        getReverseRelationships(
            item.id
        );


    if (reverse.length === 0) {
        return "";
    }


    let html = `

        <section class="detail-section">

            <h3>
                Related Items
            </h3>

            <div class="related-item-list">

    `;


    reverse.forEach(
        relationship => {

            const label =
                getReverseLabel(
                    relationship.type
                );


            const link =
                createRelatedItemLink(
                    relationship.item
                );


            html += `

                <div class="reverse-relationship">

                    <span class="relationship-label">
                        ${escapeHtml(label)}:
                    </span>

                    ${link.outerHTML}

                </div>

            `;
        }
    );


    html += `

            </div>

        </section>

    `;


    return html;
}


// ---------- Reverse Relationship Labels ----------

function getReverseLabel(
    type
) {

    const labels = {

        ammo:
            "Used By",

        magazines:
            "Used By",

        attachments:
            "Compatible With",

        compatibleWeapons:
            "Used By",

        compatibleMagazines:
            "Used By",

        vehicles:
            "Used By",

        parts:
            "Required By",

        unlocks:
            "Unlocked By",

        creates:
            "Created By",

        requiredFor:
            "Required By"

    };


    return (
        labels[type] ||
        "Related From"
    );
}


// ---------- Back Navigation ----------

function goBack() {

    if (
        navigationStack.length === 0
    ) {
        return;
    }


    const previousId =
        navigationStack.pop();


    const previousItem =
        findItem(previousId);


    if (!previousItem) {
        return;
    }


    openItemModal(
        previousItem,
        false
    );
}


// ---------- Close Modal ----------

function closeItemModal() {

    hideQuickPreview();


    itemModal.classList.remove(
        "visible"
    );

    itemModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    currentItemId =
        null;

    navigationStack =
        [];
}


modalClose.addEventListener(
    "click",
    closeItemModal
);


modalBackground.addEventListener(
    "click",
    closeItemModal
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            if (
                itemModal.classList.contains(
                    "visible"
                )
            ) {

                closeItemModal();

            }
        }

    }
);


// ---------- Search Events ----------

searchInput.addEventListener(
    "input",
    displayItems
);


categoryFilter.addEventListener(
    "change",
    displayItems
);


sourceFilter.addEventListener(
    "change",
    displayItems
);


// ---------- Report Link ----------

reportLink.addEventListener(
    "click",
    event => {

        event.preventDefault();

        alert(
            "The error reporting form will be connected here once the database is ready."
        );

    }
);


// ---------- Utility Functions ----------

function formatPrice(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "—";
    }

    return value.toLocaleString();
}


function formatLabel(value) {

    return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


function escapeHtml(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ---------- Start ----------

loadItems();
