// ============================================
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
