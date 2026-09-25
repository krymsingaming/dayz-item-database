// ============================================
// DayZ Item Database
// Main Application
// ============================================


let items = [];


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


// ---------- Load Database ----------

async function loadItems() {

    try {

        const response =
            await fetch("data/items.json");

        if (!response.ok) {
            throw new Error(
                "Unable to load item database."
            );
        }

        items =
            await response.json();

        initializeFilters();

        displayItems();

    } catch (error) {

        console.error(error);

        itemResults.innerHTML = `
            <p>
                Unable to load the item database.
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
                .map(item => {

                    if (!item.source) {
                        return null;
                    }

                    if (item.source.vanilla) {
                        return "Vanilla DayZ";
                    }

                    return item.source.mod;
                })
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


// ---------- Get Source Name ----------

function getSourceName(item) {

    if (!item.source) {
        return "Unknown";
    }

    if (item.source.vanilla) {
        return "Vanilla DayZ";
    }

    return item.source.mod || "Unknown";
}


// ---------- Search / Filtering ----------

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


        // ---------- Basic Card ----------

        const sourceName =
            getSourceName(item);


        const subcategory =
            item.subcategory
                ? ` → ${item.subcategory}`
                : "";


        // ---------- Hover Preview ----------

        let previewRows = "";


        if (item.inventory?.size) {

            previewRows += `
                <div class="item-preview-row">
                    Inventory:
                    ${item.inventory.size}
                </div>
            `;
        }


        if (item.storage?.capacity) {

            previewRows += `
                <div class="item-preview-row">
                    Storage:
                    ${item.storage.capacity} slots
                </div>
            `;
        }


        if (item.economy?.traders?.length) {

            previewRows += `
                <div class="item-preview-row">
                    Trader:
                    ${item.economy.traders.length}
                    available
                </div>
            `;
        }


        card.innerHTML = `

            <h3>
                ${escapeHtml(item.name)}
            </h3>

            <p>
                ${escapeHtml(
                    item.category || "Uncategorized"
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


        // ---------- Click ----------

        card.addEventListener(
            "click",
            () => openItemModal(item)
        );


        itemResults.appendChild(card);

    });
}


// ---------- Open Item Modal ----------

function openItemModal(item) {

    const sourceName =
        getSourceName(item);


    let html = `

        <div class="item-detail-header">

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
                    ${escapeHtml(sourceName)}
                </span>

            </div>

            <div class="detail-row">

                <span class="detail-label">
                    Database ID
                </span>

                <span class="detail-value">
                    ${escapeHtml(item.id || "—")}
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


    // ---------- Deployable ----------

    if (item.deployable) {

        html += `

            <section class="detail-section">

                <h3>
                    Deployment
                </h3>

        `;


        if (item.deployable.creates) {

            html += `

                <div class="detail-row">

                    <span class="detail-label">
                        Creates
                    </span>

                    <span class="detail-value">
                        ${escapeHtml(
                            item.deployable.creates
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


    modalBody.innerHTML =
        html;


    itemModal.classList.add(
        "visible"
    );

    itemModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


// ---------- Close Modal ----------

function closeItemModal() {

    itemModal.classList.remove(
        "visible"
    );

    itemModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
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

        if (
            event.key === "Escape" &&
            itemModal.classList.contains(
                "visible"
            )
        ) {
            closeItemModal();
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


// ---------- Start Application ----------

loadItems();// ============================================
// DayZ Item Database
// Main Application
// ============================================


// --------------------------------------------
// Application State
// --------------------------------------------

let items = [];


// --------------------------------------------
// Page Elements
// --------------------------------------------

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sourceFilter = document.getElementById("sourceFilter");
const itemResults = document.getElementById("itemResults");
const resultCount = document.getElementById("resultCount");


// --------------------------------------------
// Load Database
// --------------------------------------------

async function loadItems() {

    try {

        const response = await fetch("data/items.json");

        if (!response.ok) {
            throw new Error("Unable to load item database.");
        }

        items = await response.json();

        initializeFilters();
        displayItems();

    } catch (error) {

        console.error(error);

        itemResults.innerHTML = `
            <p>
                Unable to load the item database.
            </p>
        `;

        resultCount.textContent = "Database error";
    }
}


// --------------------------------------------
// Initialize Filters
// --------------------------------------------

function initializeFilters() {

    // Categories

    const categories = [
        ...new Set(
            items
                .map(item => item.category)
                .filter(Boolean)
        )
    ];

    categories.sort();

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);

    });


    // Sources

    const sources = [
        ...new Set(
            items
                .map(item => {

                    if (!item.source) {
                        return null;
                    }

                    if (item.source.vanilla) {
                        return "Vanilla DayZ";
                    }

                    return item.source.mod;

                })
                .filter(Boolean)
        )
    ];

    sources.sort();

    sources.forEach(source => {

        const option = document.createElement("option");

        option.value = source;
        option.textContent = source;

        sourceFilter.appendChild(option);

    });

}


// --------------------------------------------
// Filter Items
// --------------------------------------------

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

        // Search

        const searchableText = [

            item.name,
            item.category,
            item.subcategory,
            item.description,

            ...(item.tags || [])

        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


        const matchesSearch =
            !searchTerm ||
            searchableText.includes(searchTerm);


        // Category

        const matchesCategory =
            !selectedCategory ||
            item.category === selectedCategory;


        // Source

        let itemSource = "";

        if (item.source) {

            if (item.source.vanilla) {
                itemSource = "Vanilla DayZ";
            } else {
                itemSource = item.source.mod || "";
            }

        }

        const matchesSource =
            !selectedSource ||
            itemSource === selectedSource;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesSource
        );

    });

}


// --------------------------------------------
// Display Items
// --------------------------------------------

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

        card.className = "item-card";


        const sourceName =
            item.source?.vanilla
                ? "Vanilla DayZ"
                : item.source?.mod || "Unknown";


        card.innerHTML = `

            <h3>${item.name}</h3>

            <p>
                ${item.category || "Uncategorized"}
            </p>

            <p>
                ${sourceName}
            </p>

        `;


        itemResults.appendChild(card);

    });

}


// --------------------------------------------
// Event Listeners
// --------------------------------------------

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


// --------------------------------------------
// Start Application
// --------------------------------------------

loadItems();
