<script>
  import { onMount, tick } from 'svelte';
  import { playPageFlipSound } from '$lib/utils/audioRustle.js';

  let bookContainer = $state(null);
  let stageWrapper = $state(null);
  let pageFlip = null;

  let isSoundEnabled = $state(true);
  let currentPage = $state(1);
  let totalPages = $state(0);
  let isLoading = $state(false);
  let loadingStatus = $state('');
  let currentDocTitle = $state('Duaa Book');

  async function loadPdfDocument(source = '/duaa.pdf', docName = 'duaa.pdf') {
    if (!bookContainer) return;
    isLoading = true;
    loadingStatus = 'Opening PDF document...';
    currentDocTitle = docName.replace(/\.pdf$/i, '');

    try {
      if (pageFlip) {
        try { pageFlip.destroy(); } catch (e) {}
        pageFlip = null;
      }
      bookContainer.innerHTML = '';

      const pdfjsLib = await import('pdfjs-dist');
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const loadingTask = pdfjsLib.getDocument(source);
      const pdf = await loadingTask.promise;
      totalPages = pdf.numPages;

      loadingStatus = `Rendering ${totalPages} pages for 3D flipbook...`;

      // Render first 20 pages or all if smaller
      const maxPagesToRender = Math.min(totalPages, 30);
      const isMobile = window.innerWidth <= 768;
      const targetWidth = isMobile ? Math.min(380, window.innerWidth - 30) : 460;
      const targetHeight = Math.round(targetWidth * 1.38);

      for (let i = 1; i <= maxPagesToRender; i++) {
        loadingStatus = `Rendering page ${i} / ${maxPagesToRender}...`;
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const scale = targetWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const pageDiv = document.createElement('div');
        pageDiv.className = 'reading-flip-page';
        pageDiv.style.width = targetWidth + 'px';
        pageDiv.style.height = targetHeight + 'px';
        pageDiv.style.background = '#ffffff';

        const canvas = document.createElement('canvas');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.objectFit = 'contain';

        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport: scaledViewport }).promise;

        pageDiv.appendChild(canvas);
        bookContainer.appendChild(pageDiv);
      }

      // If odd number of pages, append blank page for spread balance
      if (maxPagesToRender % 2 !== 0) {
        const blank = document.createElement('div');
        blank.className = 'reading-flip-page';
        blank.style.background = '#f8fafc';
        bookContainer.appendChild(blank);
      }

      // Mount PageFlip
      const { PageFlip } = await import('page-flip');
      const flip = new PageFlip(bookContainer, {
        width: targetWidth,
        height: targetHeight,
        size: isMobile ? 'fixed' : 'stretch',
        minWidth: 260,
        maxWidth: 960,
        minHeight: 380,
        maxHeight: 1200,
        showCover: true,
        usePortrait: isMobile,
        flippingTime: 450,
        startPage: 0
      });

      flip.loadFromHTML(bookContainer.querySelectorAll('.reading-flip-page'));
      flip.on('flip', (e) => {
        currentPage = e.data + 1;
        playPageFlipSound(isSoundEnabled);
      });

      pageFlip = flip;
    } catch (err) {
      console.error('PDF flipbook render error:', err);
      loadingStatus = 'Failed to load PDF. You can select another file above.';
    } finally {
      isLoading = false;
    }
  }

  function handleFileChange(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      loadPdfDocument(url, file.name);
    }
  }

  function flipPrev() {
    if (pageFlip) pageFlip.flipPrev();
  }

  function flipNext() {
    if (pageFlip) pageFlip.flipNext();
  }

  function jumpToPage(val) {
    const p = Number(val);
    if (pageFlip && p >= 1 && p <= totalPages) {
      pageFlip.flip(p - 1);
    }
  }

  function toggleFullscreen() {
    if (!stageWrapper) return;
    if (!document.fullscreenElement) {
      if (stageWrapper.requestFullscreen) stageWrapper.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  onMount(() => {
    loadPdfDocument('/duaa.pdf', 'duaa.pdf');

    return () => {
      if (pageFlip) {
        try { pageFlip.destroy(); } catch (e) {}
      }
    };
  });
</script>

<div class="tab-content active" id="tab-pdf" style="display: block;">
  <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
    <span><span>📖</span> 3D PDF FLIPBOOK READER</span>
    <label class="reading-tool-btn active" style="cursor: pointer; font-size: 11.5px; padding: 4px 10px;">
      📂 Open Local PDF
      <input type="file" accept="application/pdf" onchange={handleFileChange} style="display: none;" />
    </label>
  </div>

  <div class="reading-stage-wrapper" bind:this={stageWrapper}>
    <!-- Top Controls -->
    <div class="reading-stage-top-controls">
      <div class="reading-stage-page-info">
        <span>📄</span> {currentDocTitle} • Page {currentPage} of {totalPages || '--'}
      </div>

      <div class="reading-top-tool-group">
        <button
          type="button"
          class="reading-tool-btn {isSoundEnabled ? 'active' : ''}"
          onclick={() => (isSoundEnabled = !isSoundEnabled)}
        >
          {isSoundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
        <button type="button" class="reading-tool-btn" onclick={toggleFullscreen}>
          ⛶ Fullscreen
        </button>
      </div>
    </div>

    {#if isLoading}
      <div style="background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 32px; text-align: center; margin: 20px 0;">
        <div style="font-size: 28px; margin-bottom: 8px;">⏳</div>
        <div style="font-size: 14px; font-weight: 800; color: var(--ink);">{loadingStatus}</div>
      </div>
    {/if}

    <!-- Flipbook Stage -->
    <div class="reading-flipbook-container" style="min-height: 520px; display: flex; align-items: center; justify-content: center; position: relative;">
      <button
        type="button"
        class="reading-flip-arrow-btn reading-flip-arrow-prev"
        disabled={currentPage <= 1}
        onclick={flipPrev}
        title="Previous Page"
      >
        ◀
      </button>

      <div id="pdfFlipContainer" bind:this={bookContainer}></div>

      <button
        type="button"
        class="reading-flip-arrow-btn reading-flip-arrow-next"
        disabled={currentPage >= totalPages}
        onclick={flipNext}
        title="Next Page"
      >
        ▶
      </button>
    </div>

    <!-- Bottom Slider Jump -->
    {#if totalPages > 1}
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 14px; padding: 10px; background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px;">
        <span style="font-size: 12px; font-weight: 800; color: #64748b;">Page 1</span>
        <input
          type="range"
          min="1"
          max={totalPages}
          value={currentPage}
          oninput={(e) => jumpToPage(e.currentTarget.value)}
          style="flex: 1; max-width: 320px; accent-color: var(--teal); cursor: pointer;"
        />
        <span style="font-size: 12px; font-weight: 800; color: #64748b;">Page {totalPages}</span>
      </div>
    {/if}
  </div>
</div>
