document.addEventListener('DOMContentLoaded', () => {
    const newItemInput = document.getElementById('newItemInput');
    const categorySelect = document.getElementById('categorySelect');
    const addItemBtn = document.getElementById('addItemBtn');
    const groceryCategoriesContainer = document.getElementById('groceryCategories');

    // Default categories
    const categories = [
        "Produce", "Dairy & Refrigerated", "Pantry & Dry Goods",
        "Meat & Seafood", "Frozen", "Household & Miscellaneous", "Other"
    ];

    // Define emoji mapping for categories
    const categoryEmojis = {
        "Produce": "🍎", // Apple emoji for produce
        "Dairy & Refrigerated": "🥛", // Milk glass emoji
        "Pantry & Dry Goods": "🍝", // Pasta emoji
        "Meat & Seafood": "🥩", // Meat emoji
        "Frozen": "🧊", // Ice cube emoji
        "Household & Miscellaneous": "🧼", // Soap emoji
        "Other": "🛒" // Shopping cart emoji
    };

    // Initialize items from localStorage or an empty array, grouped by category
    let itemsByCategory = JSON.parse(localStorage.getItem('categorizedGroceryItems')) ||
                          categories.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {});

    // Ensure all categories are present in itemsByCategory, even if empty
    categories.forEach(cat => {
        if (!itemsByCategory[cat]) {
            itemsByCategory[cat] = [];
        }
    });

    // Function to save items to localStorage
    const saveItems = () => {
        localStorage.setItem('categorizedGroceryItems', JSON.stringify(itemsByCategory));
    };

    // Function to render the list
    const renderList = () => {
        groceryCategoriesContainer.innerHTML = ''; // Clear current categories and items

        // Iterate through each category
        categories.forEach(categoryName => {
            const categoryItems = itemsByCategory[categoryName];

            // Only render category section if it has items, or if we want to show all categories
            // For now, let's show all categories always
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';

            const categoryHeader = document.createElement('h2');
            // Add emoji to the header text
            categoryHeader.textContent = `${categoryEmojis[categoryName] || ''} ${categoryName}`;
            categorySection.appendChild(categoryHeader);

            const ul = document.createElement('ul');
            ul.className = 'category-list';
            ul.id = `list-${categoryName.replace(/\s+/g, '-')}`;
            categorySection.appendChild(ul);

            // Render items within this category
            categoryItems.forEach((item, itemIndex) => {
                const li = document.createElement('li');
                li.className = 'grocery-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `item-${categoryName}-${itemIndex}`;
                checkbox.checked = item.checked;
                checkbox.addEventListener('change', () => {
                    item.checked = checkbox.checked;
                    saveItems();
                    renderList();
                });

                const label = document.createElement('label');
                label.htmlFor = `item-${categoryName}-${itemIndex}`;
                label.textContent = item.name;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', () => {
                    itemsByCategory[categoryName].splice(itemIndex, 1);
                    saveItems();
                    renderList();
                });

                li.appendChild(checkbox);
                li.appendChild(label);
                li.appendChild(deleteBtn);
                ul.appendChild(li);
            });

            groceryCategoriesContainer.appendChild(categorySection);
        });
    };

    // Add new item
    addItemBtn.addEventListener('click', () => {
        const itemName = newItemInput.value.trim();
        const selectedCategory = categorySelect.value;

        if (itemName && selectedCategory) {
            if (!itemsByCategory[selectedCategory]) {
                itemsByCategory[selectedCategory] = [];
            }
            itemsByCategory[selectedCategory].push({ name: itemName, checked: false });
            newItemInput.value = ''; // Clear input
            saveItems();
            renderList();
        }
    });

    // Allow adding with Enter key
    newItemInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addItemBtn.click();
        }
    });

    // Initial render when page loads
    renderList();
});
