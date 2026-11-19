<script>
  import { navigationState } from '$lib/stores/navigationState.svelte.js';
  import TopNavBar from '$lib/components/common/TopNavBar.svelte';

  // Modules
  import ReadingSection from '$lib/components/reading/ReadingSection.svelte';
  import ScheduleSection from '$lib/components/tracker/ScheduleSection.svelte';
  import WaterWalkModule from '$lib/components/tracker/WaterWalkModule.svelte';
  import WeekSection from '$lib/components/tracker/WeekSection.svelte';
  import HistorySection from '$lib/components/tracker/HistorySection.svelte';
  import PeriodSection from '$lib/components/tracker/PeriodSection.svelte';
  import SummarySection from '$lib/components/tracker/SummarySection.svelte';
  import RecipeBookSection from '$lib/components/routines/RecipeBookSection.svelte';
  import AdkarDuaSection from '$lib/components/routines/AdkarDuaSection.svelte';
  import B1EnglishRoutine from '$lib/components/routines/B1EnglishRoutine.svelte';
  import EnglishTestSection from '$lib/components/routines/EnglishTestSection.svelte';
  import DailyMathsSuite from '$lib/components/routines/DailyMathsSuite.svelte';
  import DuaaNotesSection from '$lib/components/routines/DuaaNotesSection.svelte';
  import TemplatesSection from '$lib/components/routines/TemplatesSection.svelte';
  import PdfFlipbookViewer from '$lib/components/pdf/PdfFlipbookViewer.svelte';
</script>

<div class="app-container">
  <TopNavBar />

  <div id="content-area">
    {#if navigationState.activeTab === 'schedule'}
      <ScheduleSection />
    {:else if navigationState.activeTab === 'reading'}
      <ReadingSection />
    {:else if navigationState.activeTab === 'water'}
      <WaterWalkModule />
    {:else if navigationState.activeTab === 'week'}
      <WeekSection />
    {:else if navigationState.activeTab === 'history'}
      <HistorySection />
    {:else if navigationState.activeTab === 'period'}
      <PeriodSection />
    {:else if navigationState.activeTab === 'summary'}
      <SummarySection />
    {:else if navigationState.activeTab === 'recipe'}
      <RecipeBookSection />
    {:else if navigationState.activeTab === 'adkar'}
      <AdkarDuaSection />
    {:else if navigationState.activeTab === 'english'}
      <B1EnglishRoutine />
    {:else if navigationState.activeTab === 'englishtest'}
      <EnglishTestSection />
    {:else if navigationState.activeTab === 'mathtest'}
      <DailyMathsSuite />
    {:else if navigationState.activeTab === 'notes'}
      <DuaaNotesSection />
    {:else if navigationState.activeTab === 'templates'}
      <TemplatesSection />
    {:else if navigationState.activeTab === 'pdf'}
      <PdfFlipbookViewer />
    {:else}
      <ScheduleSection />
    {/if}
  </div>
</div>
