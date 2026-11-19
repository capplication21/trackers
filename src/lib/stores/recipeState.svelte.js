import recipesDataset from '$lib/data/recipes.json';
import { storageBridge } from './storageBridge.js';

class RecipeStore {
  recipes = $state(recipesDataset.recipes);
  canonicalMap = $state(recipesDataset.canonicalMap || {});
  searchQuery = $state('');
  activeCategory = $state('all');
  selectedRecipe = $state(null);
  missingIngredients = $state([]);
  isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const savedRecipes = await storageBridge.getItem('recipe_book_custom_v1');
    if (Array.isArray(savedRecipes) && savedRecipes.length > 0) {
      this.recipes = [...recipesDataset.recipes, ...savedRecipes];
    }

    const savedMissing = await storageBridge.getItem('missing_ingredients_v1');
    if (Array.isArray(savedMissing)) {
      this.missingIngredients = savedMissing;
    }
  }

  get filteredRecipes() {
    let list = this.recipes;
    if (this.activeCategory !== 'all') {
      list = list.filter(r => (r.category || '').toLowerCase() === this.activeCategory.toLowerCase());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(r =>
        (r.title || '').toLowerCase().includes(q) ||
        (r.ingredients || []).some(ing => (typeof ing === 'string' ? ing : ing.name || '').toLowerCase().includes(q))
      );
    }
    return list;
  }

  get categories() {
    const set = new Set(['all']);
    this.recipes.forEach(r => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  }

  async addRecipe(recipe) {
    this.recipes = [recipe, ...this.recipes];
    const customOnly = this.recipes.filter(r => r.id && String(r.id).startsWith('custom_'));
    await storageBridge.setItem('recipe_book_custom_v1', customOnly);
  }

  async toggleMissingIngredient(item) {
    if (this.missingIngredients.includes(item)) {
      this.missingIngredients = this.missingIngredients.filter(i => i !== item);
    } else {
      this.missingIngredients = [...this.missingIngredients, item];
    }
    await storageBridge.setItem('missing_ingredients_v1', this.missingIngredients);
  }

  async clearMissingIngredients() {
    this.missingIngredients = [];
    await storageBridge.setItem('missing_ingredients_v1', []);
  }
}

export const recipeState = new RecipeStore();
