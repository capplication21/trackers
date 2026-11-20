<script>
  import { onMount } from 'svelte';
  import { recipeState } from '$lib/stores/recipeState.svelte.js';
  import { getYouTubeEmbedUrl } from '$lib/utils/youtubeParser.js';

  let isAccordionOpen = $state(true);
  let expandedRecipeIds = $state({});

  // Modals
  let showEditModal = $state(false);
  let modalIndex = $state(-1);
  let modalTitle = $state('');
  let modalUrl = $state('');
  let modalIngredients = $state('');
  let modalAddedItems = $state('');
  let modalChanges = $state('');
  let modalVeg = $state(false);
  let modalFavorite = $state(false);
  let modalMustTry = $state(false);
  let modalQuick = $state(false);
  let modalOkay = $state(false);

  // Recipe Viewer Modal (YouTube player, note down ingredients, share notes)
  let showViewerModal = $state(false);
  let viewerRecipe = $state(null);
  let viewerIndex = $state(-1);
  let viewerEmbedUrl = $derived(viewerRecipe?.url ? getYouTubeEmbedUrl(viewerRecipe.url) : '');
  let viewerNewItem = $state('');

  function openRecipeViewer(recipe, index) {
    viewerRecipe = recipe;
    viewerIndex = index;
    viewerNewItem = '';
    showViewerModal = true;
  }

  function shareRecipeNotes(recipe) {
    if (!recipe || typeof window === 'undefined') return;
    const missing = (recipe.ingredients || []).filter((ing) =>
      recipeState.missingIngredients.includes(ingredientName(ing).trim())
    );
    const text = encodeURIComponent(
      `🍲 *Recipe:* ${recipe.title}\n` +
      (recipe.url ? `▶ *YouTube Video:* ${recipe.url}\n\n` : '\n') +
      `🛒 *Ingredients to buy:*\n` +
      (missing.length > 0
        ? missing.map((m, i) => `${i + 1}. ${ingredientName(m)}`).join('\n')
        : (recipe.ingredients || []).map((m, i) => `${i + 1}. ${ingredientName(m)}`).join('\n')) +
      (recipe.changes ? `\n\n📝 *Notes:* ${recipe.changes}` : '') +
      (recipe.addedItems ? `\n🧂 *Added items:* ${recipe.addedItems}` : '')
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  function copyRecipeNotes(recipe) {
    if (!recipe || typeof navigator === 'undefined' || !navigator.clipboard) return;
    const missing = (recipe.ingredients || []).filter((ing) =>
      recipeState.missingIngredients.includes(ingredientName(ing).trim())
    );
    const text =
      `🍲 Recipe: ${recipe.title}\n` +
      (recipe.url ? `▶ YouTube Video: ${recipe.url}\n\n` : '\n') +
      `🛒 Ingredients to buy:\n` +
      (missing.length > 0
        ? missing.map((m, i) => `${i + 1}. ${ingredientName(m)}`).join('\n')
        : (recipe.ingredients || []).map((m, i) => `${i + 1}. ${ingredientName(m)}`).join('\n')) +
      (recipe.changes ? `\n\n📝 Notes: ${recipe.changes}` : '') +
      (recipe.addedItems ? `\n🧂 Added items: ${recipe.addedItems}` : '');

    navigator.clipboard.writeText(text);
    if (typeof window !== 'undefined') window.alert('Recipe notes & ingredients copied! 📋');
  }

  // New Shopping Item input
  let newShoppingItem = $state('');

  const subTabs = [
    { id: 'all', icon: '📋', label: 'All' },
    { id: 'veg', icon: '🥗', label: 'Veg' },
    { id: 'favorites', icon: '⭐', label: 'Favorites' },
    { id: 'musttry', icon: '🔥', label: 'Must Try' },
    { id: 'quick', icon: '⚡', label: 'Quick' },
    { id: 'ingredients', icon: '📜', label: 'Ingredients' }
  ];

  const COMMON_INGREDIENT_KEYWORDS = [
    'salt',
    'sugar',
    'brown sugar',
    'chicken',
    'oil',
    'sesame oil',
    'water',
    'garlic',
    'ginger',
    'onion',
    'spring onion',
    'pepper',
    'black pepper',
    'soy sauce',
    'dark soy sauce',
    'light soy sauce',
    'vinegar',
    'rice vinegar',
    'butter',
    'flour',
    'cornstarch',
    'corn starch',
    'corn flour',
    'rice flour',
    'honey'
  ];

  function ingredientName(ing) {
    return typeof ing === 'string' ? ing : ing?.name || '';
  }

  function isInstructionText(name) {
    const normalized = name.toLowerCase();
    return (
      /degree/.test(normalized) ||
      /marinate/.test(normalized) ||
      /\d+\s*mint\b/.test(normalized) ||
      /^add\b/.test(normalized) ||
      /^fry\b/.test(normalized) ||
      /\btill\b/.test(normalized) ||
      /\buntil\b/.test(normalized) ||
      /^sauce:?$/.test(normalized.trim())
    );
  }

  function isCommonIngredient(name) {
    const normalized = name.toLowerCase();
    return COMMON_INGREDIENT_KEYWORDS.some((keyword) => normalized.includes(keyword));
  }

  const INGREDIENT_ROOT_WORDS = ['beef'];

  function normalizeIngredientKey(name) {
    const key = name
      .toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[^a-z\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const tokens = key.split(' ');
    const root = INGREDIENT_ROOT_WORDS.find((word) => tokens.includes(word));
    return root || key;
  }

  let uncommonSearchQuery = $state('');
  let isShoppingOpen = $state(true);
  let isUncommonOpen = $state(true);
  let isCommonOpen = $state(true);

  let commonNames = $derived.by(() => {
    const commonMap = new Map();
    recipeState.recipes.forEach((recipe) => {
      (recipe.ingredients || []).forEach((ing) => {
        const name = ingredientName(ing).trim();
        if (!name || isInstructionText(name)) return;
        const key = normalizeIngredientKey(name);
        if (!key) return;
        if (isCommonIngredient(name)) {
          const existing = commonMap.get(key);
          if (!existing || name.length < existing.length) {
            commonMap.set(key, name);
          }
        }
      });
    });
    return [...commonMap.values()].sort((a, b) => a.localeCompare(b));
  });

  let uncommonIngredientEntries = $derived.by(() => {
    const uncommonMap = new Map();
    recipeState.recipes.forEach((recipe, recipeIndex) => {
      (recipe.ingredients || []).forEach((ing) => {
        const name = ingredientName(ing).trim();
        if (!name || isInstructionText(name)) return;
        const key = normalizeIngredientKey(name);
        if (!key) return;
        if (!isCommonIngredient(name)) {
          if (!uncommonMap.has(key)) {
            uncommonMap.set(key, { name, recipes: [] });
          }
          const entry = uncommonMap.get(key);
          if (name.length < entry.name.length) {
            entry.name = name;
          }
          if (!entry.recipes.some((r) => r.recipeIndex === recipeIndex)) {
            entry.recipes.push({
              recipe,
              recipeIndex,
              title: recipe.title || 'Untitled Recipe',
              url: recipe.url || ''
            });
          }
        }
      });
    });
    return [...uncommonMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  let filteredUncommonEntries = $derived.by(() => {
    const q = uncommonSearchQuery.trim().toLowerCase();
    if (!q) return uncommonIngredientEntries;
    return uncommonIngredientEntries.filter((e) => e.name.toLowerCase().includes(q));
  });

  onMount(async () => {
    await recipeState.init();
  });

  function toggleAccordion() {
    isAccordionOpen = !isAccordionOpen;
  }

  function toggleRecipeDetails(id) {
    expandedRecipeIds[id] = !expandedRecipeIds[id];
  }

  function openAddModal() {
    modalIndex = -1;
    modalTitle = '';
    modalUrl = '';
    modalIngredients = '';
    modalAddedItems = '';
    modalChanges = '';
    modalVeg = false;
    modalFavorite = false;
    modalMustTry = false;
    modalQuick = false;
    modalOkay = false;
    showEditModal = true;
  }

  function openEditModal(recipe, index) {
    modalIndex = index;
    modalTitle = recipe.title || '';
    modalUrl = recipe.url || '';
    modalIngredients = (recipe.ingredients || [])
      .map((i) => (typeof i === 'string' ? i : i?.name || ''))
      .join('\n');
    modalAddedItems = recipe.addedItems || '';
    modalChanges = recipe.changes || '';
    modalVeg = Boolean(recipe.veg);
    modalFavorite = Boolean(recipe.favorite);
    modalMustTry = Boolean(recipe.mustTry);
    modalQuick = Boolean(recipe.quick);
    modalOkay = Boolean(recipe.okay);
    showEditModal = true;
  }

  async function handleSaveRecipeModal() {
    if (!modalTitle.trim()) return;

    const ingList = modalIngredients
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const recipeData = {
      title: modalTitle.trim(),
      url: modalUrl.trim(),
      ingredients: ingList,
      addedItems: modalAddedItems.trim(),
      changes: modalChanges.trim(),
      veg: modalVeg,
      favorite: modalFavorite,
      mustTry: modalMustTry,
      quick: modalQuick,
      okay: modalOkay
    };

    if (modalIndex >= 0) {
      await recipeState.updateRecipe(modalIndex, recipeData);
    } else {
      await recipeState.addRecipe(recipeData);
    }
    showEditModal = false;
  }

  async function handleDeleteRecipe(index, title) {
    if (typeof window !== 'undefined' && !window.confirm(`Delete recipe "${title}"?`)) {
      return;
    }
    await recipeState.deleteRecipe(index);
  }

  async function addCustomShoppingItem() {
    if (!newShoppingItem.trim()) return;
    await recipeState.toggleMissingIngredient(newShoppingItem.trim());
    newShoppingItem = '';
  }

  function shareWhatsAppShopping() {
    if (typeof window === 'undefined') return;
    const text = encodeURIComponent(
      `🛒 Shopping Checklist:\n` +
      recipeState.missingIngredients.map((item, i) => `${i + 1}. ${item}`).join('\n')
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  function copyShoppingList() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const text = recipeState.missingIngredients.join('\n');
      navigator.clipboard.writeText(text);
      if (typeof window !== 'undefined') window.alert('Copied to clipboard! 📋');
    }
  }

  const currentTabLabel = $derived(() => {
    switch (recipeState.activeTab) {
      case 'veg':
        return 'Veg Recipes';
      case 'favorites':
        return 'Favorites (Tried Dishes)';
      case 'musttry':
        return 'Must Try (Have To Try)';
      case 'quick':
        return 'Quick Recipes (Less Time)';
      case 'ingredients':
        return 'Ingredients & Shopping';
      default:
        return 'All Recipes';
    }
  });

  const currentTabIcon = $derived(() => {
    const found = subTabs.find((t) => t.id === recipeState.activeTab);
    return found ? found.icon : '📋';
  });
</script>

<div class="tab-content active" id="tab-recipe" style="display: block;">
  <!-- Pill Title Badge -->
  <div style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 2.5px solid var(--ink); border-radius: 999px; padding: 6px 16px; font-weight: 800; font-size: 13px; margin-bottom: 14px; box-shadow: 0 2px 0 var(--ink);">
    <span style="font-size: 15px;">🔍</span> RECIPE BOOK
  </div>

  <!-- Search Input Row -->
  <div class="recipe-search-row" style="display: flex; gap: 8px; margin-bottom: 12px;">
    <input
      type="text"
      class="input-field"
      id="recipeSearchInput"
      placeholder="Search ingredients, comma separated..."
      bind:value={recipeState.searchQuery}
      style="flex: 1; padding: 10px 14px; border: 2.5px solid var(--ink); border-radius: 14px; font-size: 13.5px; font-weight: 600; box-shadow: 0 2.5px 0 var(--ink); background: #ffffff; box-sizing: border-box;"
    />
    <button
      type="button"
      class="recipe-search-btn"
      title="Search Recipes"
      style="width: 46px; height: 46px; background: #eab308; border: 2.5px solid var(--ink); border-radius: 14px; box-shadow: 0 2.5px 0 var(--ink); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;"
    >
      🔍
    </button>
  </div>

  <!-- Add New Recipe Button -->
  <button
    type="button"
    class="add-period-btn"
    onclick={openAddModal}
    style="width: 100%; margin-bottom: 14px; background: #eab308; color: #141413; border: 2.5px solid var(--ink); border-radius: 14px; padding: 12px; font-size: 14.5px; font-weight: 800; cursor: pointer; box-shadow: 0 3px 0 var(--ink); display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s ease;"
  >
    <span style="font-size: 16px;">➕</span> Add New Recipe
  </button>

  <!-- Recipe Sub-Navigation Bar -->
  <div
    class="recipe-sub-tabs"
    style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 2.5px solid var(--ink); border-radius: 16px; padding: 6px; box-shadow: 0 3.5px 0 var(--ink); margin-bottom: 16px; gap: 4px; overflow-x: auto;"
  >
    {#each subTabs as tab (tab.id)}
      {@const isActive = recipeState.activeTab === tab.id}
      <button
        type="button"
        class="recipe-sub-tab-btn {isActive ? 'active' : ''}"
        onclick={() => (recipeState.activeTab = tab.id)}
        style="flex: 1; min-width: 52px; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 8px; border-radius: 10px; border: {isActive ? '2px solid var(--ink)' : '2px solid transparent'}; background: {isActive ? '#0d9488' : 'transparent'}; color: {isActive ? '#ffffff' : '#64748b'}; cursor: pointer; font-family: inherit; font-size: 11px; font-weight: 800; transition: all 0.15s ease; box-shadow: {isActive ? '0 2px 0 var(--ink)' : 'none'};"
      >
        <span style="font-size: 18px;">{tab.icon}</span>
        <span style="white-space: nowrap;">{tab.label}</span>
      </button>
    {/each}
  </div>

  <!-- SECTION CONTENT -->
  {#if recipeState.activeTab === 'ingredients'}
    <!-- 1. Have to Buy / Shopping List Card -->
    <div
      class="ingredient-dropdown-card open"
      style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 16px; box-shadow: 0 4px 0 var(--ink); overflow: hidden; margin-bottom: 16px;"
    >
      <div
        class="ingredient-dropdown-header"
        onclick={() => (isShoppingOpen = !isShoppingOpen)}
        onkeydown={(e) => { if (e.key === 'Enter') isShoppingOpen = !isShoppingOpen; }}
        role="button"
        tabindex="0"
        style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fefce8; border-bottom: {isShoppingOpen ? '2.5px solid var(--ink)' : 'none'}; cursor: pointer; user-select: none;"
      >
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #ffffff; border: 2px solid var(--ink); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 0 var(--ink);">
            🛒
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="font-size: 14.5px; font-weight: 800; color: var(--ink);">Have to Buy</div>
            <span style="background: #ffffff; border: 1.5px solid var(--ink); padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 800;">
              {recipeState.missingIngredients.length}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="ingredient-dropdown-chevron-box"
          style="width: 28px; height: 28px; background: #ffffff; border: 1.5px solid var(--ink); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; box-shadow: 0 1.5px 0 var(--ink);"
        >
          {isShoppingOpen ? '▲' : '▼'}
        </button>
      </div>

      {#if isShoppingOpen}
        <div style="padding: 14px 16px;">
          <!-- Add Item Row -->
          <div style="display: flex; gap: 8px; margin-bottom: 14px;">
            <input
              type="text"
              placeholder="Add ingredient to buy..."
              bind:value={newShoppingItem}
              onkeydown={(e) => { if (e.key === 'Enter') addCustomShoppingItem(); }}
              style="flex: 1; padding: 8px 12px; border: 1.5px solid var(--ink); border-radius: 10px; font-size: 13px; font-weight: 600;"
            />
            <button
              type="button"
              onclick={addCustomShoppingItem}
              style="padding: 8px 14px; background: #0284c7; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 10px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 2px 0 var(--ink);"
            >
              ➕
            </button>
          </div>

          <!-- Action bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 12px; font-weight: 700; color: #475569;">
              Shopping Checklist
            </span>
            <div style="display: flex; gap: 6px;">
              <button
                type="button"
                onclick={shareWhatsAppShopping}
                title="Share to WhatsApp"
                style="background: #25d366; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 8px; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink); font-size: 14px;"
              >
                💬
              </button>
              <button
                type="button"
                onclick={copyShoppingList}
                title="Copy checklist"
                style="background: #f8fafc; border: 1.5px solid var(--ink); border-radius: 8px; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink); font-size: 13px;"
              >
                📋
              </button>
              <button
                type="button"
                onclick={() => recipeState.clearMissingIngredients()}
                title="Clear all"
                style="background: #fee2e2; color: #dc2626; border: 1.5px solid var(--ink); border-radius: 8px; padding: 0 8px; height: 30px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: 0 1.5px 0 var(--ink);"
              >
                🗑️
              </button>
            </div>
          </div>

          {#if recipeState.missingIngredients.length === 0}
            <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; font-style: italic;">
              No missing ingredients noted yet. Type above to add!
            </div>
          {:else}
            <div style="display: flex; flex-direction: column; gap: 6px; max-height: 300px; overflow-y: auto;">
              {#each recipeState.missingIngredients as item, idx}
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 8px 12px;">
                  <span style="font-size: 13px; font-weight: 700; color: var(--ink);">• {item}</span>
                  <button
                    type="button"
                    onclick={() => recipeState.removeMissingIngredient(idx)}
                    style="background: transparent; border: none; cursor: pointer; font-size: 13px;"
                  >
                    🗑️
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- 2. Uncommon Ingredients Card -->
    <div
      class="ingredient-dropdown-card open"
      id="uncommonIngredientsCard"
      style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 16px; box-shadow: 0 4px 0 var(--ink); overflow: hidden; margin-bottom: 16px; padding: 0;"
    >
      <div
        class="ingredient-dropdown-header"
        onclick={() => (isUncommonOpen = !isUncommonOpen)}
        onkeydown={(e) => { if (e.key === 'Enter') isUncommonOpen = !isUncommonOpen; }}
        role="button"
        tabindex="0"
        style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fefce8; border-bottom: {isUncommonOpen ? '2.5px solid var(--ink)' : 'none'}; cursor: pointer; user-select: none;"
      >
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #ffffff; border: 2px solid var(--ink); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 0 var(--ink);">
            📋
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="font-size: 14.5px; font-weight: 800; color: var(--ink);">Uncommon Ingredients</div>
            <span style="background: #ffffff; border: 1.5px solid var(--ink); padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 800;">
              {uncommonIngredientEntries.length}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="ingredient-dropdown-chevron-box"
          style="width: 28px; height: 28px; background: #ffffff; border: 1.5px solid var(--ink); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; box-shadow: 0 1.5px 0 var(--ink);"
        >
          {isUncommonOpen ? '▲' : '▼'}
        </button>
      </div>

      {#if isUncommonOpen}
        <div style="padding: 14px 16px;">
          <!-- Search Row -->
          <div style="margin-bottom: 14px;">
            <input
              type="text"
              placeholder="Search uncommon ingredient..."
              bind:value={uncommonSearchQuery}
              style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--ink); border-radius: 10px; font-size: 13px; font-weight: 600; box-sizing: border-box;"
            />
          </div>

          <!-- Uncommon Ingredients Chips List -->
          {#if filteredUncommonEntries.length === 0}
            <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; font-style: italic;">
              No uncommon ingredients found.
            </div>
          {:else}
            <div id="uncommonIngredientsList" class="history-list">
              {#each filteredUncommonEntries as entry (entry.name)}
                <details class="uncommon-ingredient-item">
                  <summary class="uncommon-ingredient-name">
                    <span class="uncommon-ingredient-name-text">
                      <span>🔘</span>
                      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{entry.name}</span>
                    </span>
                    <span style="display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;">
                      <span class="uncommon-recipe-count">{entry.recipes.length}</span>
                      <span class="uncommon-arrow-icon">▼</span>
                    </span>
                  </summary>

                  <div class="uncommon-recipe-links" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1.5px dashed #cbd5e1;">
                    {#each entry.recipes as r (r.recipeIndex)}
                      <div class="uncommon-recipe-item-pill">
                        <!-- Recipe Title & Video Trigger -->
                        <button
                          type="button"
                          class="uncommon-recipe-tag-text"
                          onclick={(e) => { e.preventDefault(); e.stopPropagation(); openRecipeViewer(r.recipe, r.recipeIndex); }}
                          title="Watch YouTube, Note Ingredients & Share"
                        >
                          <span style="font-size: 13px;">📖</span>
                          <span>{r.title}</span>
                          {#if r.url}
                            <span class="yt-badge">▶ Video</span>
                          {/if}
                        </button>

                        <!-- Action Icons (Edit & Delete like Qur'an) -->
                        <div class="uncommon-recipe-actions">
                          <button
                            type="button"
                            class="action-icon-btn edit-icon-btn"
                            onclick={(e) => { e.preventDefault(); e.stopPropagation(); openEditModal(r.recipe, r.recipeIndex); }}
                            title="Edit Recipe"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            class="action-icon-btn delete-icon-btn"
                            onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteRecipe(r.recipeIndex, r.title); }}
                            title="Delete Recipe"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                </details>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- 3. Common Ingredients Card -->
    <div
      class="ingredient-dropdown-card open"
      style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 16px; box-shadow: 0 4px 0 var(--ink); overflow: hidden; margin-bottom: 16px;"
    >
      <div
        class="ingredient-dropdown-header"
        onclick={() => (isCommonOpen = !isCommonOpen)}
        onkeydown={(e) => { if (e.key === 'Enter') isCommonOpen = !isCommonOpen; }}
        role="button"
        tabindex="0"
        style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fefce8; border-bottom: {isCommonOpen ? '2.5px solid var(--ink)' : 'none'}; cursor: pointer; user-select: none;"
      >
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #ffffff; border: 2px solid var(--ink); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 0 var(--ink);">
            🧂
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="font-size: 14.5px; font-weight: 800; color: var(--ink);">Common Ingredients</div>
            <span style="background: #ffffff; border: 1.5px solid var(--ink); padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 800;">
              {commonNames.length}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="ingredient-dropdown-chevron-box"
          style="width: 28px; height: 28px; background: #ffffff; border: 1.5px solid var(--ink); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; box-shadow: 0 1.5px 0 var(--ink);"
        >
          {isCommonOpen ? '▲' : '▼'}
        </button>
      </div>

      {#if isCommonOpen}
        <div style="padding: 14px 16px;">
          {#if commonNames.length === 0}
            <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; font-style: italic;">
              No common ingredients found.
            </div>
          {:else}
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              {#each commonNames as name}
                <div class="ingredient-chip">
                  <span>🌿</span> {name}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {:else}
    <!-- Regular Recipe Accordion Card -->
    <div
      class="ingredient-dropdown-card {isAccordionOpen ? 'open' : ''}"
      style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 16px; box-shadow: 0 4px 0 var(--ink); overflow: hidden; margin-bottom: 16px;"
    >
      <!-- Accordion Header -->
      <div
        class="ingredient-dropdown-header"
        onclick={toggleAccordion}
        onkeydown={(e) => { if (e.key === 'Enter') toggleAccordion(); }}
        role="button"
        tabindex="0"
        style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fefce8; border-bottom: {isAccordionOpen ? '2.5px solid var(--ink)' : 'none'}; cursor: pointer; user-select: none;"
      >
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #ffffff; border: 2px solid var(--ink); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 0 var(--ink);">
            {currentTabIcon()}
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 14.5px; font-weight: 800; color: var(--ink);">
              {currentTabLabel()}
            </span>
            <span style="background: #ffffff; border: 1.5px solid var(--ink); padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 800; color: var(--ink);">
              {recipeState.filteredRecipes.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          class="ingredient-dropdown-chevron-box"
          style="width: 28px; height: 28px; background: #ffffff; border: 1.5px solid var(--ink); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; box-shadow: 0 1.5px 0 var(--ink);"
        >
          {isAccordionOpen ? '▲' : '▼'}
        </button>
      </div>

      <!-- Accordion Body -->
      {#if isAccordionOpen}
        <div style="padding: 12px 14px; max-height: 600px; overflow-y: auto;">
          {#if recipeState.filteredRecipes.length === 0}
            <div style="text-align: center; padding: 32px 16px; color: #94a3b8; font-size: 13px; font-style: italic;">
              No recipes found for this filter.
            </div>
          {:else}
            <div style="display: flex; flex-direction: column; gap: 10px;">
              {#each recipeState.filteredRecipes as { recipe, index } (recipe.id || index)}
                {@const isExpanded = Boolean(expandedRecipeIds[recipe.id])}
                <div
                  class="recipe-index-item {recipe.veg ? 'is-veg' : ''} {recipe.favorite ? 'is-favorite' : ''} {recipe.mustTry ? 'is-must-try' : ''} {recipe.quick ? 'is-quick' : ''} {recipe.okay ? 'is-ok' : ''}"
                  style="background: #fdfbf7; border: 2px solid var(--ink); border-radius: 14px; padding: 12px; box-shadow: 0 2.5px 0 var(--ink); transition: transform 0.1s ease;"
                >
                  <!-- Recipe Title -->
                  <div
                    onclick={() => toggleRecipeDetails(recipe.id)}
                    onkeydown={(e) => { if (e.key === 'Enter') toggleRecipeDetails(recipe.id); }}
                    role="button"
                    tabindex="0"
                    style="font-size: 15px; font-weight: 800; color: var(--ink); cursor: pointer; margin-bottom: 8px; line-height: 1.3;"
                  >
                    {recipe.title}
                  </div>

                  <!-- Action Buttons Row -->
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <!-- Veg button -->
                    <button
                      type="button"
                      class="recipe-action-btn veg-btn {recipe.veg ? 'active' : ''}"
                      onclick={() => recipeState.toggleVeg(index)}
                      title={recipe.veg ? 'Vegetarian (Click to toggle)' : 'Mark as Vegetarian'}
                      style="width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--ink); background: {recipe.veg ? '#bbf7d0' : '#f8fafc'}; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink);"
                    >
                      🥗
                    </button>

                    <!-- Favorite button -->
                    <button
                      type="button"
                      class="recipe-action-btn fav-btn {recipe.favorite ? 'active' : ''}"
                      onclick={() => recipeState.toggleFavorite(index)}
                      title={recipe.favorite ? 'Favorited' : 'Add to Favorites'}
                      style="width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--ink); background: {recipe.favorite ? '#fef08a' : '#f8fafc'}; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink);"
                    >
                      {recipe.favorite ? '⭐' : '☆'}
                    </button>

                    <!-- Must Try button -->
                    <button
                      type="button"
                      class="recipe-action-btn must-try-btn {recipe.mustTry ? 'active' : ''}"
                      onclick={() => recipeState.toggleMustTry(index)}
                      title={recipe.mustTry ? 'Must Try' : 'Add to Must Try'}
                      style="width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--ink); background: {recipe.mustTry ? '#ffedd5' : '#f8fafc'}; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink);"
                    >
                      🔥
                    </button>

                    <!-- Quick button -->
                    <button
                      type="button"
                      class="recipe-action-btn quick-btn {recipe.quick ? 'active' : ''}"
                      onclick={() => recipeState.toggleQuick(index)}
                      title={recipe.quick ? 'Quick Recipe' : 'Mark as Quick Recipe'}
                      style="width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--ink); background: {recipe.quick ? '#e0f2fe' : '#f8fafc'}; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink);"
                    >
                      ⚡
                    </button>

                    <!-- Okay button -->
                    <button
                      type="button"
                      class="recipe-action-btn ok-btn {recipe.okay ? 'active' : ''}"
                      onclick={() => recipeState.toggleOkay(index)}
                      title={recipe.okay ? 'Okay / Normal' : 'Mark as Okay'}
                      style="width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--ink); background: {recipe.okay ? '#ede9fe' : '#f8fafc'}; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink);"
                    >
                      👌
                    </button>

                    <!-- Edit button -->
                    <button
                      type="button"
                      class="recipe-action-btn edit-btn"
                      onclick={() => openEditModal(recipe, index)}
                      title="Edit Recipe"
                      style="width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--ink); background: #f8fafc; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink);"
                    >
                      ✏️
                    </button>

                    <!-- Delete button -->
                    <button
                      type="button"
                      class="history-delete"
                      onclick={() => handleDeleteRecipe(index, recipe.title)}
                      title="Delete Recipe"
                      style="width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--ink); background: #fee2e2; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink);"
                    >
                      🗑️
                    </button>
                  </div>

                  <!-- Expanded Details -->
                  {#if isExpanded}
                    <div style="margin-top: 12px; padding-top: 10px; border-top: 1.5px dashed #cbd5e1;">
                      {#if recipe.url}
                        <div style="margin-bottom: 10px;">
                          <a
                            href={recipe.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style="display: inline-flex; align-items: center; gap: 6px; background: #0284c7; color: #ffffff; padding: 6px 12px; border-radius: 8px; border: 1.5px solid var(--ink); font-size: 12px; font-weight: 800; text-decoration: none; box-shadow: 0 1.5px 0 var(--ink);"
                          >
                            <span>▶ Watch Video</span>
                            <span>↗</span>
                          </a>
                        </div>
                      {/if}

                      {#if (recipe.ingredients || []).length > 0}
                        <div style="margin-bottom: 10px;">
                          <div style="font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 6px;">
                            Ingredients (tap to add to shopping list):
                          </div>
                          <div style="display: flex; flex-direction: column; gap: 4px;">
                            {#each recipe.ingredients as ing}
                              {@const isMissing = recipeState.missingIngredients.includes(ing.trim())}
                              <button
                                type="button"
                                onclick={() => recipeState.toggleMissingIngredient(ing)}
                                style="text-align: left; background: {isMissing ? '#fef3c7' : '#ffffff'}; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 8px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; color: var(--ink);"
                              >
                                <span>{isMissing ? '🛒' : '▫'}</span>
                                <span style="font-weight: {isMissing ? '700' : '500'};">{ing}</span>
                              </button>
                            {/each}
                          </div>
                        </div>
                      {/if}

                      {#if recipe.addedItems || recipe.changes}
                        <div style="background: #f1f5f9; border-radius: 8px; padding: 8px 10px; font-size: 11.5px; color: #334155; margin-top: 8px;">
                          {#if recipe.addedItems}
                            <div><strong>Added Items:</strong> {recipe.addedItems}</div>
                          {/if}
                          {#if recipe.changes}
                            <div><strong>Notes:</strong> {recipe.changes}</div>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Recipe Viewer Modal (Watch YouTube Video, Note Ingredients to Buy, Share Notes) -->
{#if showViewerModal && viewerRecipe}
  <div
    class="nav-menu-overlay"
    onclick={() => (showViewerModal = false)}
    onkeydown={(e) => { if (e.key === 'Escape') showViewerModal = false; }}
    role="button"
    tabindex="-1"
    style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(3px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 16px;"
  >
    <div
      class="nav-menu-dropdown"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="0"
      style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 18px; width: min(100%, 540px); max-height: 90vh; overflow-y: auto; padding: 18px 20px; box-shadow: 0 6px 0 var(--ink);"
    >
      <!-- Modal Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
          <span style="font-size: 18px;">🍲</span>
          <div style="font-size: 15.5px; font-weight: 800; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            {viewerRecipe.title}
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
          <button
            type="button"
            class="action-icon-btn edit-icon-btn"
            onclick={() => {
              showViewerModal = false;
              openEditModal(viewerRecipe, viewerIndex);
            }}
            title="Edit Recipe"
          >
            ✏️
          </button>
          <button
            type="button"
            class="action-icon-btn delete-icon-btn"
            onclick={async () => {
              showViewerModal = false;
              await handleDeleteRecipe(viewerIndex, viewerRecipe.title);
            }}
            title="Delete Recipe"
          >
            🗑️
          </button>
          <button
            type="button"
            onclick={() => (showViewerModal = false)}
            style="background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center;"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Embedded YouTube Video Player -->
      {#if viewerEmbedUrl}
        <div style="margin-bottom: 16px;">
          <div style="width: 100%; aspect-ratio: 16 / 9; background: #000000; border-radius: 12px; border: 2px solid var(--ink); overflow: hidden; box-shadow: 0 3px 0 var(--ink);">
            <iframe
              src={viewerEmbedUrl}
              title={viewerRecipe.title}
              style="width: 100%; height: 100%; border: none;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          {#if viewerRecipe.url}
            <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
              <a
                href={viewerRecipe.url}
                target="_blank"
                rel="noopener noreferrer"
                style="font-size: 11px; font-weight: 700; color: #0284c7; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;"
              >
                Open in YouTube ↗
              </a>
            </div>
          {/if}
        </div>
      {:else if viewerRecipe.url}
        <div style="margin-bottom: 16px; padding: 12px; background: #fef08a; border: 1.5px solid var(--ink); border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12.5px; font-weight: 700; color: var(--ink);">Recipe Link</span>
          <a
            href={viewerRecipe.url}
            target="_blank"
            rel="noopener noreferrer"
            style="background: #0284c7; color: #ffffff; padding: 5px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 800; text-decoration: none;"
          >
            Open Link ↗
          </a>
        </div>
      {/if}

      <!-- Quick Shopping Checklist Note Down -->
      <div style="background: #fdfbf7; border: 2px solid var(--ink); border-radius: 14px; padding: 14px; margin-bottom: 14px; box-shadow: 0 2px 0 var(--ink);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <div style="font-size: 13.5px; font-weight: 800; color: var(--ink);">
              🛒 Note Down Ingredients to Buy
            </div>
            <div style="font-size: 11px; color: #64748b; font-weight: 600;">
              Tap ingredient while watching to add to shopping list
            </div>
          </div>
          <span style="background: #ffffff; border: 1.5px solid var(--ink); padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 800;">
            {(viewerRecipe.ingredients || []).length} items
          </span>
        </div>

        {#if (viewerRecipe.ingredients || []).length === 0}
          <div style="color: #94a3b8; font-size: 12px; font-style: italic; padding: 8px 0;">
            No ingredients listed for this recipe yet. Add custom ingredients below!
          </div>
        {:else}
          <div style="display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; margin-bottom: 10px;">
            {#each viewerRecipe.ingredients as ing}
              {@const cleanName = ingredientName(ing).trim()}
              {@const isMarked = recipeState.missingIngredients.includes(cleanName)}
              <button
                type="button"
                onclick={() => recipeState.toggleMissingIngredient(cleanName)}
                style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; border: {isMarked ? '1.5px solid #d97706' : '1.5px solid #cbd5e1'}; background: {isMarked ? '#fef3c7' : '#ffffff'}; cursor: pointer; text-align: left; font-family: inherit; transition: all 0.15s ease;"
              >
                <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                  <span style="font-size: 13px;">{isMarked ? '✅' : '▫'}</span>
                  <span style="font-size: 12.5px; font-weight: {isMarked ? '800' : '600'}; color: var(--ink);">
                    {cleanName}
                  </span>
                </div>
                <span style="font-size: 10.5px; font-weight: 800; color: {isMarked ? '#b45309' : '#0284c7'};">
                  {isMarked ? 'Added to Buy 🛒' : '+ Add to Buy'}
                </span>
              </button>
            {/each}
          </div>
        {/if}

        <!-- Add Custom Ingredient to Buy Input -->
        <div style="display: flex; gap: 6px;">
          <input
            type="text"
            placeholder="Type extra item to buy while watching..."
            bind:value={viewerNewItem}
            onkeydown={(e) => {
              if (e.key === 'Enter' && viewerNewItem.trim()) {
                recipeState.toggleMissingIngredient(viewerNewItem.trim());
                viewerNewItem = '';
              }
            }}
            style="flex: 1; padding: 6px 10px; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 12px; font-weight: 600;"
          />
          <button
            type="button"
            onclick={() => {
              if (viewerNewItem.trim()) {
                recipeState.toggleMissingIngredient(viewerNewItem.trim());
                viewerNewItem = '';
              }
            }}
            style="padding: 6px 12px; background: #0284c7; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 800; font-size: 11px; cursor: pointer; box-shadow: 0 1.5px 0 var(--ink);"
          >
            ➕ Add
          </button>
        </div>
      </div>

      <!-- Recipe Notes & Custom Tweaks -->
      {#if viewerRecipe.changes || viewerRecipe.addedItems}
        <div style="background: #f1f5f9; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 10px 12px; margin-bottom: 14px; font-size: 12px; color: #334155;">
          <div style="font-weight: 800; color: var(--ink); margin-bottom: 4px;">📝 Notes &amp; Tweaks:</div>
          {#if viewerRecipe.changes}
            <div style="margin-bottom: 4px;"><strong>Notes:</strong> {viewerRecipe.changes}</div>
          {/if}
          {#if viewerRecipe.addedItems}
            <div><strong>Added Items:</strong> {viewerRecipe.addedItems}</div>
          {/if}
        </div>
      {/if}

      <!-- Share Notes & Actions Row -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; border-top: 2px solid #e2e8f0; padding-top: 12px;">
        <div style="display: flex; gap: 8px;">
          <button
            type="button"
            onclick={() => shareRecipeNotes(viewerRecipe)}
            style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #25d366; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 10px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 2px 0 var(--ink);"
            title="Share Recipe & Notes to WhatsApp"
          >
            <span>💬</span> Share to WhatsApp
          </button>
          <button
            type="button"
            onclick={() => copyRecipeNotes(viewerRecipe)}
            style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #f8fafc; border: 1.5px solid var(--ink); border-radius: 10px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 2px 0 var(--ink);"
            title="Copy Notes to Clipboard"
          >
            <span>📋</span> Copy Notes
          </button>
        </div>

        <button
          type="button"
          onclick={() => (showViewerModal = false)}
          style="padding: 8px 16px; background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 10px; font-weight: 800; font-size: 12px; cursor: pointer;"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Add / Edit Recipe Modal -->
{#if showEditModal}
  <div
    class="nav-menu-overlay"
    onclick={() => (showEditModal = false)}
    onkeydown={(e) => { if (e.key === 'Escape') showEditModal = false; }}
    role="button"
    tabindex="-1"
    style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 16px;"
  >
    <div
      class="nav-menu-dropdown"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="0"
      style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 16px; width: min(100%, 460px); max-height: 90vh; overflow-y: auto; padding: 20px; box-shadow: 0 6px 0 var(--ink);"
    >
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
        <div style="font-size: 15px; font-weight: 800; color: var(--ink);">
          {modalIndex >= 0 ? '✏️ Edit Recipe' : '➕ Add New Recipe'}
        </div>
        <button
          type="button"
          onclick={() => (showEditModal = false)}
          style="background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 12px; font-weight: 800;"
        >
          ✕
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label for="recipeTitle" style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 4px;">
            Recipe Title *
          </label>
          <input
            id="recipeTitle"
            type="text"
            bind:value={modalTitle}
            placeholder="e.g. Crispy Honey Chicken"
            style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 13px; font-weight: 600; box-sizing: border-box;"
          />
        </div>

        <div>
          <label for="recipeUrl" style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 4px;">
            YouTube / Video Link
          </label>
          <input
            id="recipeUrl"
            type="text"
            bind:value={modalUrl}
            placeholder="https://youtube.com/..."
            style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 13px; font-weight: 600; box-sizing: border-box;"
          />
        </div>

        <div>
          <label for="recipeIngredients" style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 4px;">
            Ingredients (1 per line)
          </label>
          <textarea
            id="recipeIngredients"
            rows="5"
            bind:value={modalIngredients}
            placeholder="Chicken&#10;Soy sauce&#10;Honey..."
            style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 12.5px; font-family: inherit; box-sizing: border-box;"
          ></textarea>
        </div>

        <!-- Checkbox Options -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px;">
          <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
            <input type="checkbox" bind:checked={modalVeg} /> 🥗 Veg
          </label>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
            <input type="checkbox" bind:checked={modalFavorite} /> ⭐ Favorite
          </label>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
            <input type="checkbox" bind:checked={modalMustTry} /> 🔥 Must Try
          </label>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
            <input type="checkbox" bind:checked={modalQuick} /> ⚡ Quick
          </label>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
            <input type="checkbox" bind:checked={modalOkay} /> 👌 Okay
          </label>
        </div>

        <div>
          <label for="recipeChanges" style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 4px;">
            Notes &amp; Custom Changes
          </label>
          <textarea
            id="recipeChanges"
            rows="2"
            bind:value={modalChanges}
            placeholder="My personal tweaks..."
            style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 12.5px; font-family: inherit; box-sizing: border-box;"
          ></textarea>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; border-top: 2px solid #e2e8f0; padding-top: 12px;">
        <button
          type="button"
          onclick={() => (showEditModal = false)}
          style="padding: 8px 14px; background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer;"
        >
          Cancel
        </button>
        <button
          type="button"
          onclick={handleSaveRecipeModal}
          style="padding: 8px 16px; background: #eab308; color: #141413; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 2px 0 var(--ink);"
        >
          Save Recipe
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .uncommon-recipe-item-pill {
    background: linear-gradient(135deg, #f5b729 0%, #e8a317 100%);
    color: #1a1a1a;
    border: 2px solid var(--ink, #141413);
    border-radius: 10px;
    box-shadow: 0 2px 0 var(--ink, #141413);
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px 6px 12px;
    max-width: 100%;
    box-sizing: border-box;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .uncommon-recipe-item-pill:hover {
    transform: translateY(-1.5px);
    box-shadow: 0 3px 0 var(--ink, #141413);
  }

  .uncommon-recipe-tag-text {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #1a1a1a;
    font-size: 12.5px;
    font-weight: 700;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
    font-family: inherit;
  }

  .uncommon-recipe-tag-text:hover {
    text-decoration: underline;
  }

  .yt-badge {
    font-size: 10px;
    background: #dc2626;
    color: #ffffff;
    padding: 1px 5px;
    border-radius: 4px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    letter-spacing: 0.3px;
  }

  .uncommon-recipe-actions {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
  }

  .action-icon-btn {
    width: 26px;
    height: 26px;
    font-size: 11px;
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    border: 1.5px solid var(--ink, #141413);
    box-shadow: 0 1px 0 var(--ink, #141413);
    padding: 0;
  }

  .action-icon-btn:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
  }

  .delete-icon-btn:hover {
    background: #fee2e2;
  }
</style>
