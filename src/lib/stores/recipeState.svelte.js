import recipesDataset from '$lib/data/recipes.json';
import { storageBridge } from './storageBridge.js';

class RecipeStore {
  recipes = $state(
    (recipesDataset.recipes || []).map((r, i) => ({
      id: r.id || `recipe_${i}`,
      title: r.title || 'Untitled Recipe',
      url: r.url || '',
      ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
      veg: Boolean(r.veg),
      favorite: Boolean(r.favorite),
      mustTry: Boolean(r.mustTry),
      quick: Boolean(r.quick),
      okay: Boolean(r.okay),
      addedItems: r.addedItems || '',
      changes: r.changes || ''
    }))
  );

  missingIngredients = $state([]);
  searchQuery = $state('');
  activeTab = $state('all'); // 'all' | 'veg' | 'favorites' | 'musttry' | 'quick' | 'ingredients'
  isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load full saved recipe book if exists
    const stored = await storageBridge.getItem('recipe_book_data_v1');
    if (stored && Array.isArray(stored.recipes) && stored.recipes.length > 0) {
      this.recipes = stored.recipes.map((r, i) => {
        let url = r.url || '';
        if (url.includes('sample-veg-paneer')) url = 'https://www.youtube.com/shorts/Sl310lormQo';
        if (url.includes('sample-veg-gobi')) url = 'https://www.youtube.com/shorts/MhYtkFhNVgI';
        return {
          id: r.id || `r_${i}`,
          title: r.title || 'Untitled Recipe',
          url,
          ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
          veg: Boolean(r.veg),
          favorite: Boolean(r.favorite),
          mustTry: Boolean(r.mustTry),
          quick: Boolean(r.quick),
          okay: Boolean(r.okay),
          addedItems: r.addedItems || '',
          changes: r.changes || ''
        };
      });
    }

    const isGarbage = (text) => {
      const lower = (text || '').toLowerCase();
      return (
        lower.includes('air fry') ||
        lower.includes('bake at') ||
        lower.includes('170°c') ||
        lower.includes('180°c') ||
        lower.includes('minutes') ||
        lower.includes('mins')
      );
    };

    if (stored && Array.isArray(stored.missingIngredients)) {
      this.missingIngredients = stored.missingIngredients.filter((i) => !isGarbage(i));
    } else {
      const savedMissing = await storageBridge.getItem('missing_ingredients_v1');
      if (Array.isArray(savedMissing)) {
        this.missingIngredients = savedMissing.filter((i) => !isGarbage(i));
      }
    }
  }

  async save() {
    const data = {
      recipes: $state.snapshot(this.recipes),
      missingIngredients: $state.snapshot(this.missingIngredients)
    };
    await storageBridge.setItem('recipe_book_data_v1', data);
  }

  toggleVeg(index) {
    if (!this.recipes[index]) return;
    this.recipes[index].veg = !this.recipes[index].veg;
    this.save();
  }

  toggleFavorite(index) {
    if (!this.recipes[index]) return;
    this.recipes[index].favorite = !this.recipes[index].favorite;
    this.save();
  }

  toggleMustTry(index) {
    if (!this.recipes[index]) return;
    this.recipes[index].mustTry = !this.recipes[index].mustTry;
    this.save();
  }

  toggleQuick(index) {
    if (!this.recipes[index]) return;
    this.recipes[index].quick = !this.recipes[index].quick;
    this.save();
  }

  toggleOkay(index) {
    if (!this.recipes[index]) return;
    this.recipes[index].okay = !this.recipes[index].okay;
    this.save();
  }

  async addRecipe(recipe) {
    const newRecipe = {
      id: `recipe_${Date.now()}`,
      title: recipe.title || 'Untitled Recipe',
      url: recipe.url || '',
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      veg: Boolean(recipe.veg),
      favorite: Boolean(recipe.favorite),
      mustTry: Boolean(recipe.mustTry),
      quick: Boolean(recipe.quick),
      okay: Boolean(recipe.okay),
      addedItems: recipe.addedItems || '',
      changes: recipe.changes || ''
    };
    this.recipes = [newRecipe, ...this.recipes];
    await this.save();
  }

  async updateRecipe(index, updated) {
    if (!this.recipes[index]) return;
    this.recipes[index] = { ...this.recipes[index], ...updated };
    await this.save();
  }

  async deleteRecipe(index) {
    if (!this.recipes[index]) return;
    this.recipes.splice(index, 1);
    await this.save();
  }

  async toggleMissingIngredient(item) {
    const clean = (item || '').trim();
    if (!clean) return;
    if (this.missingIngredients.includes(clean)) {
      this.missingIngredients = this.missingIngredients.filter((i) => i !== clean);
    } else {
      this.missingIngredients = [...this.missingIngredients, clean];
    }
    await this.save();
  }

  async removeMissingIngredient(index) {
    this.missingIngredients.splice(index, 1);
    await this.save();
  }

  async clearMissingIngredients() {
    this.missingIngredients = [];
    await this.save();
  }

  get filteredRecipes() {
    let list = this.recipes.map((recipe, index) => ({ recipe, index }));

    // Tab filter
    if (this.activeTab === 'veg') {
      list = list.filter((item) => item.recipe.veg);
    } else if (this.activeTab === 'favorites') {
      list = list.filter((item) => item.recipe.favorite);
    } else if (this.activeTab === 'musttry') {
      list = list.filter((item) => item.recipe.mustTry);
    } else if (this.activeTab === 'quick') {
      list = list.filter((item) => item.recipe.quick);
    }

    // Search query filter (search titles and ingredients)
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      const tokens = q.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      list = list.filter(({ recipe }) => {
        const titleLower = (recipe.title || '').toLowerCase();
        const ingredientsText = (recipe.ingredients || []).join(' ').toLowerCase();
        return tokens.every((tok) => titleLower.includes(tok) || ingredientsText.includes(tok));
      });
    }

    return list;
  }
}

export const recipeState = new RecipeStore();
