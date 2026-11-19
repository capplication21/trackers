<script>
  import { onMount } from 'svelte';
  import { recipeState } from '$lib/stores/recipeState.svelte.js';

  let showAddModal = $state(false);
  let showMissingModal = $state(false);

  // New recipe form
  let newTitle = $state('');
  let newCategory = $state('Dinner');
  let newPrep = $state('15 mins');
  let newCook = $state('30 mins');
  let newServings = $state('4');
  let newIngredients = $state('');
  let newInstructions = $state('');

  onMount(() => {
    recipeState.init();
  });

  async function handleCreateRecipe() {
    if (!newTitle.trim()) return;
    const recipe = {
      id: 'custom_' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      prepTime: newPrep.trim(),
      cookTime: newCook.trim(),
      servings: newServings.trim(),
      ingredients: newIngredients.split('\n').map(i => i.trim()).filter(Boolean),
      instructions: newInstructions.split('\n').map(i => i.trim()).filter(Boolean)
    };
    await recipeState.addRecipe(recipe);
    newTitle = '';
    newIngredients = '';
    newInstructions = '';
    showAddModal = false;
  }
</script>

<div class="tab-content active" id="tab-recipe" style="display: block;">
  <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
    <span><span>🍳</span> RECIPE BOOK &amp; KITCHEN</span>
    <div style="display: flex; gap: 8px;">
      <button
        type="button"
        class="reading-tool-btn"
        onclick={() => (showMissingModal = true)}
        style="font-size: 11.5px; padding: 4px 10px;"
      >
        🛒 Missing Ingredients ({recipeState.missingIngredients.length})
      </button>
      <button
        type="button"
        class="reading-tool-btn active"
        onclick={() => (showAddModal = true)}
        style="font-size: 11.5px; padding: 4px 10px;"
      >
        ➕ Add Recipe
      </button>
    </div>
  </div>

  <!-- Search & Category Filters -->
  <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
    <input
      type="text"
      placeholder="🔍 Search recipes or ingredients..."
      bind:value={recipeState.searchQuery}
      style="width: 100%; padding: 10px 14px; border: 2px solid var(--ink); border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 0 var(--ink); box-sizing: border-box;"
    />

    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
      {#each recipeState.categories as cat}
        <button
          type="button"
          class="reading-filter-pill {recipeState.activeCategory === cat ? 'active' : ''}"
          onclick={() => (recipeState.activeCategory = cat)}
          style="text-transform: capitalize;"
        >
          {cat}
        </button>
      {/each}
    </div>
  </div>

  <!-- Recipe Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: clamp(10px, 1.5vw, 16px);">
    {#each recipeState.filteredRecipes as recipe (recipe.id || recipe.title)}
      <div
        class="recipe-card-item"
        onclick={() => (recipeState.selectedRecipe = recipe)}
        onkeydown={(e) => { if (e.key === 'Enter') recipeState.selectedRecipe = recipe; }}
        tabindex="0"
        role="button"
        style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 14px; box-shadow: 0 3px 0 var(--ink); cursor: pointer; transition: transform 0.1s ease; display: flex; flex-direction: column; justify-content: space-between;"
      >
        <div>
          {#if recipe.image}
            <div style="width: 100%; height: 140px; border-radius: 10px; overflow: hidden; margin-bottom: 10px; border: 1px solid #cbd5e1;">
              <img src={recipe.image} alt={recipe.title} style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          {/if}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; background: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 999px;">
              {recipe.category || 'Kitchen'}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #64748b;">
              ⏱ {recipe.cookTime || recipe.prepTime || '30 mins'}
            </span>
          </div>

          <div style="font-size: 15px; font-weight: 800; color: var(--ink); line-height: 1.3; margin-bottom: 8px;">
            {recipe.title}
          </div>

          <div style="font-size: 12px; color: #64748b; line-height: 1.4;">
            {(recipe.ingredients || []).length} ingredients • Serves {recipe.servings || '4'}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
          <button
            type="button"
            class="reading-tool-btn"
            style="font-size: 11px; padding: 4px 10px; width: 100%;"
          >
            View Recipe 📖
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Recipe Detail Modal -->
{#if recipeState.selectedRecipe}
  {@const r = recipeState.selectedRecipe}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 17px; font-weight: 800; color: #fef08a;">{r.title}</div>
        <button type="button" class="reading-tool-btn" onclick={() => (recipeState.selectedRecipe = null)}>✕</button>
      </div>

      <div style="display: flex; gap: 12px; font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
        <span>🍽 Servings: <strong>{r.servings || '4'}</strong></span>
        <span>⏱ Prep: <strong>{r.prepTime || '--'}</strong></span>
        <span>🔥 Cook: <strong>{r.cookTime || '--'}</strong></span>
      </div>

      <!-- Ingredients Checklist -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
          🛒 Ingredients (Check if you have or click to add to missing list):
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          {#each r.ingredients as ing}
            {@const ingText = typeof ing === 'string' ? ing : ing.name || JSON.stringify(ing)}
            {@const isMissing = recipeState.missingIngredients.includes(ingText)}
            <div style="display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 6px 10px; border-radius: 6px; font-size: 12px; color: #e2e8f0;">
              <span>• {ingText}</span>
              <button
                type="button"
                class="reading-tool-btn {isMissing ? 'active' : ''}"
                onclick={() => recipeState.toggleMissingIngredient(ingText)}
                style="font-size: 10.5px; padding: 2px 6px;"
              >
                {isMissing ? 'Missing ❌' : 'Got it ✓'}
              </button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Instructions -->
      <div>
        <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
          👨‍🍳 Method &amp; Instructions:
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          {#each r.instructions as step, sIdx}
            <div style="font-size: 12px; line-height: 1.5; color: #cbd5e1; background: #0f172a; padding: 8px 10px; border-radius: 6px;">
              <strong style="color: #fef08a;">Step {sIdx + 1}:</strong> {step}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Missing Ingredients Modal -->
{#if showMissingModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 800; color: #fef08a;">🛒 Missing Ingredients / Shopping List</div>
        <button type="button" class="reading-tool-btn" onclick={() => (showMissingModal = false)}>✕</button>
      </div>

      {#if recipeState.missingIngredients.length === 0}
        <p style="font-size: 12px; color: #94a3b8; text-align: center; padding: 20px 0;">
          All set! No missing ingredients marked right now.
        </p>
      {:else}
        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; max-height: 250px; overflow-y: auto;">
          {#each recipeState.missingIngredients as item}
            <div style="display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 6px 10px; border-radius: 6px; font-size: 12px; color: #f87171;">
              <span>❌ {item}</span>
              <button
                type="button"
                class="reading-tool-btn"
                onclick={() => recipeState.toggleMissingIngredient(item)}
                style="font-size: 10px; padding: 2px 6px;"
              >
                Remove
              </button>
            </div>
          {/each}
        </div>
        <button
          type="button"
          class="reading-tool-btn"
          onclick={() => recipeState.clearMissingIngredients()}
          style="width: 100%; color: #f87171;"
        >
          Clear All Missing Items
        </button>
      {/if}
    </div>
  </div>
{/if}

<!-- Add Recipe Modal -->
{#if showAddModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card" style="max-width: 500px; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 800; color: #fef08a;">➕ Add Custom Recipe</div>
        <button type="button" class="reading-tool-btn" onclick={() => (showAddModal = false)}>✕</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label for="recipeTitleInput" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Recipe Title *</label>
          <input id="recipeTitleInput" type="text" bind:value={newTitle} placeholder="e.g. Grandma's Apple Pie" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label for="recipeCatInput" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Category</label>
            <select id="recipeCatInput" bind:value={newCategory} style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;">
              <option value="Dinner">Dinner</option>
              <option value="Lunch">Lunch</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Dessert">Dessert</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
          <div>
            <label for="recipeServingsInput" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Servings</label>
            <input id="recipeServingsInput" type="text" bind:value={newServings} placeholder="e.g. 4" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
          </div>
        </div>
        <div>
          <label for="recipeIngredientsInput" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Ingredients (1 per line) *</label>
          <textarea id="recipeIngredientsInput" bind:value={newIngredients} rows="4" placeholder="2 cups flour&#10;1 cup sugar&#10;3 apples..." style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; font-family: inherit; font-size: 12px; box-sizing: border-box;"></textarea>
        </div>
        <div>
          <label for="recipeInstructionsInput" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Instructions (1 step per line) *</label>
          <textarea id="recipeInstructionsInput" bind:value={newInstructions} rows="4" placeholder="Preheat oven to 350F&#10;Mix dry ingredients...&#10;Bake for 35 mins" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; font-family: inherit; font-size: 12px; box-sizing: border-box;"></textarea>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px;">
        <button type="button" class="reading-tool-btn" onclick={() => (showAddModal = false)}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleCreateRecipe}>Save Recipe</button>
      </div>
    </div>
  </div>
{/if}
