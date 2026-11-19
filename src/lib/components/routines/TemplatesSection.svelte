<script>
  import { notesState } from '$lib/stores/notesState.svelte.js';
  import { navigationState } from '$lib/stores/navigationState.svelte.js';

  function useTemplate(tmpl) {
    notesState.applyTemplate(tmpl.content || tmpl.text || tmpl.title);
    navigationState.setTab('notes');
  }
</script>

<div class="tab-content active" id="tab-templates" style="display: block;">
  <div class="section-title">
    <span>📋</span> TEMPLATE BOOK &amp; PROMPTS
  </div>

  <div style="display: flex; flex-direction: column; gap: 14px;">
    {#each notesState.templates as tmpl}
      <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 16px; box-shadow: 0 3px 0 var(--ink);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-size: 15px; font-weight: 800; color: var(--ink);">
            {tmpl.title || 'Journal Template'}
          </div>
          <button
            type="button"
            class="reading-tool-btn active"
            onclick={() => useTemplate(tmpl)}
            style="font-size: 11px; padding: 4px 10px;"
          >
            Use in Journal ➔
          </button>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-bottom: 10px; line-height: 1.4;">
          {tmpl.description || 'Pre-formatted reflection template.'}
        </p>
        <pre style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 12px; line-height: 1.5; color: #334155; white-space: pre-wrap; font-family: inherit;">{tmpl.content || tmpl.text}</pre>
      </div>
    {/each}
  </div>
</div>
