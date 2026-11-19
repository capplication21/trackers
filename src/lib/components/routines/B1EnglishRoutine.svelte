<script>
  import { onMount, onDestroy } from 'svelte';
  import { storageBridge } from '$lib/stores/storageBridge.js';

  // Topic storage
  let grammarTopics = $state([]);
  let phonicsTopics = $state([]);

  // Grammar Timer
  let grammarMinutes = $state(10);
  let grammarRemaining = $state(10 * 60);
  let isGrammarRunning = $state(false);
  let grammarInterval = null;

  // Phonics Timer
  let phonicsMinutes = $state(10);
  let phonicsRemaining = $state(10 * 60);
  let isPhonicsRunning = $state(false);
  let phonicsInterval = null;

  // Topic Modal State
  let showTopicModal = $state(false);
  let topicModalType = $state('grammar'); // 'grammar' | 'phonics'
  let topicModalEditId = $state(null);
  let topicModalTitle = $state('');
  let topicModalUrl = $state('');

  // Deep Grammar Guide Modal State
  let showDeepGrammarModal = $state(false);
  let deepGrammarSearch = $state('');
  let deepGrammarCat = $state('all');

  function getNormalizedUrl(rawUrl) {
    if (!rawUrl) return '';
    let url = String(rawUrl).trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    return url;
  }

  function formatTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  onMount(async () => {
    // Load Grammar Topics
    try {
      const storedGrammar = await storageBridge.getItem('grammar_revision_topics_v2');
      if (storedGrammar) {
        grammarTopics = typeof storedGrammar === 'string' ? JSON.parse(storedGrammar) : storedGrammar;
      }
    } catch (e) {
      grammarTopics = [];
    }

    // Load Phonics Topics
    try {
      const storedPhonics = await storageBridge.getItem('phonics_revision_topics_v1');
      if (storedPhonics) {
        phonicsTopics = typeof storedPhonics === 'string' ? JSON.parse(storedPhonics) : storedPhonics;
      }
    } catch (e) {
      phonicsTopics = [];
    }

    // Load Grammar Timer
    try {
      const storedGm = await storageBridge.getItem('tm_grammar_minutes');
      if (storedGm) {
        const v = parseInt(storedGm);
        if (v >= 1 && v <= 60) {
          grammarMinutes = v;
          grammarRemaining = v * 60;
        }
      }
    } catch (e) {}

    // Load Phonics Timer
    try {
      const storedPm = await storageBridge.getItem('tm_phonics_minutes');
      if (storedPm) {
        const v = parseInt(storedPm);
        if (v >= 1 && v <= 60) {
          phonicsMinutes = v;
          phonicsRemaining = v * 60;
        }
      }
    } catch (e) {}
  });

  onDestroy(() => {
    if (grammarInterval) clearInterval(grammarInterval);
    if (phonicsInterval) clearInterval(phonicsInterval);
  });

  // Grammar Timer Controls
  function toggleGrammarTimer() {
    if (isGrammarRunning) {
      clearInterval(grammarInterval);
      isGrammarRunning = false;
    } else {
      if (grammarRemaining <= 0) grammarRemaining = grammarMinutes * 60;
      isGrammarRunning = true;
      grammarInterval = setInterval(() => {
        if (grammarRemaining > 0) {
          grammarRemaining--;
        } else {
          clearInterval(grammarInterval);
          isGrammarRunning = false;
        }
      }, 1000);
    }
  }

  function resetGrammarTimer() {
    clearInterval(grammarInterval);
    isGrammarRunning = false;
    grammarRemaining = grammarMinutes * 60;
  }

  async function adjustGrammarMinutes(delta) {
    if (isGrammarRunning) return;
    const next = Math.max(1, Math.min(60, grammarMinutes + delta));
    grammarMinutes = next;
    grammarRemaining = next * 60;
    await storageBridge.setItem('tm_grammar_minutes', next);
  }

  // Phonics Timer Controls
  function togglePhonicsTimer() {
    if (isPhonicsRunning) {
      clearInterval(phonicsInterval);
      isPhonicsRunning = false;
    } else {
      if (phonicsRemaining <= 0) phonicsRemaining = phonicsMinutes * 60;
      isPhonicsRunning = true;
      phonicsInterval = setInterval(() => {
        if (phonicsRemaining > 0) {
          phonicsRemaining--;
        } else {
          clearInterval(phonicsInterval);
          isPhonicsRunning = false;
        }
      }, 1000);
    }
  }

  function resetPhonicsTimer() {
    clearInterval(phonicsInterval);
    isPhonicsRunning = false;
    phonicsRemaining = phonicsMinutes * 60;
  }

  async function adjustPhonicsMinutes(delta) {
    if (isPhonicsRunning) return;
    const next = Math.max(1, Math.min(60, phonicsMinutes + delta));
    phonicsMinutes = next;
    phonicsRemaining = next * 60;
    await storageBridge.setItem('tm_phonics_minutes', next);
  }

  // Topic Modal Handlers
  function openTopicModal(type, item = null) {
    topicModalType = type;
    if (item) {
      topicModalEditId = item.id;
      topicModalTitle = item.title || '';
      topicModalUrl = item.url || '';
    } else {
      topicModalEditId = null;
      topicModalTitle = '';
      topicModalUrl = '';
    }
    showTopicModal = true;
  }

  function closeTopicModal() {
    showTopicModal = false;
    topicModalEditId = null;
    topicModalTitle = '';
    topicModalUrl = '';
  }

  async function saveTopic() {
    const title = topicModalTitle.trim();
    const url = topicModalUrl.trim();

    if (!title && !url) {
      return;
    }

    if (topicModalType === 'grammar') {
      if (topicModalEditId) {
        grammarTopics = grammarTopics.map((t) =>
          t.id === topicModalEditId
            ? { ...t, title: title || 'Grammar Lesson', url, updatedAt: Date.now() }
            : t
        );
      } else {
        grammarTopics = [
          {
            id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            title: title || 'Grammar Lesson',
            url,
            createdAt: Date.now()
          },
          ...grammarTopics
        ];
      }
      await storageBridge.setItem('grammar_revision_topics_v2', JSON.stringify(grammarTopics));
    } else {
      if (topicModalEditId) {
        phonicsTopics = phonicsTopics.map((t) =>
          t.id === topicModalEditId
            ? { ...t, title: title || 'Phonics Lesson', url, updatedAt: Date.now() }
            : t
        );
      } else {
        phonicsTopics = [
          {
            id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            title: title || 'Phonics Lesson',
            url,
            createdAt: Date.now()
          },
          ...phonicsTopics
        ];
      }
      await storageBridge.setItem('phonics_revision_topics_v1', JSON.stringify(phonicsTopics));
    }

    closeTopicModal();
  }

  async function deleteTopic(id, type) {
    if (!confirm(`Are you sure you want to delete this ${type} topic?`)) return;

    if (type === 'grammar') {
      grammarTopics = grammarTopics.filter((t) => t.id !== id);
      await storageBridge.setItem('grammar_revision_topics_v2', JSON.stringify(grammarTopics));
    } else {
      phonicsTopics = phonicsTopics.filter((t) => t.id !== id);
      await storageBridge.setItem('phonics_revision_topics_v1', JSON.stringify(phonicsTopics));
    }
  }

  // Deep Grammar Guide
  const grammarChapters = [
    {
      id: 'grammar-ch-tenses',
      cat: 'tenses',
      icon: '⏳',
      title: 'Chapter 1: 12 English Tenses & Formulas Matrix',
      desc: 'Master verb forms, time markers, and grammatical formulas for all English tenses.',
      content: `
        <div class="deep-grammar-table-wrap">
          <table class="deep-grammar-table">
            <thead>
              <tr>
                <th>Tense</th>
                <th>Formula / Structure</th>
                <th>Key Time Markers</th>
                <th>Example Sentence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Present Simple</strong></td>
                <td><code>Subject + V1 (s/es)</code></td>
                <td>Always, usually, daily, every day</td>
                <td>She <em>speaks</em> English fluently.</td>
              </tr>
              <tr>
                <td><strong>Present Continuous</strong></td>
                <td><code>Subject + is/am/are + V-ing</code></td>
                <td>Now, at the moment, currently</td>
                <td>They <em>are studying</em> for the test.</td>
              </tr>
              <tr>
                <td><strong>Present Perfect</strong></td>
                <td><code>Subject + have/has + V3</code></td>
                <td>Already, yet, ever, never, since, for</td>
                <td>I <em>have lived</em> here for 5 years.</td>
              </tr>
              <tr>
                <td><strong>Present Perfect Cont.</strong></td>
                <td><code>Subject + have/has + been + V-ing</code></td>
                <td>Since morning, for 3 hours, all day</td>
                <td>He <em>has been waiting</em> since 8 AM.</td>
              </tr>
              <tr>
                <td><strong>Past Simple</strong></td>
                <td><code>Subject + V2 (did + V1 for - / ?)</code></td>
                <td>Yesterday, ago, in 2020, last week</td>
                <td>She <em>visited</em> the museum yesterday.</td>
              </tr>
              <tr>
                <td><strong>Past Continuous</strong></td>
                <td><code>Subject + was/were + V-ing</code></td>
                <td>While, when, at 6 PM yesterday</td>
                <td>I <em>was reading</em> when you called.</td>
              </tr>
              <tr>
                <td><strong>Past Perfect</strong></td>
                <td><code>Subject + had + V3</code></td>
                <td>Before, after, by the time, already</td>
                <td>The train <em>had left</em> before we arrived.</td>
              </tr>
              <tr>
                <td><strong>Future Simple</strong></td>
                <td><code>Subject + will + V1</code></td>
                <td>Tomorrow, next week, soon, probably</td>
                <td>We <em>will finish</em> the project soon.</td>
              </tr>
              <tr>
                <td><strong>Future Continuous</strong></td>
                <td><code>Subject + will be + V-ing</code></td>
                <td>At this time tomorrow</td>
                <td>This time tomorrow, I <em>will be flying</em>.</td>
              </tr>
              <tr>
                <td><strong>Future Perfect</strong></td>
                <td><code>Subject + will have + V3</code></td>
                <td>By 5 PM, by next year, by then</td>
                <td>By next month, I <em>will have completed</em> it.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="deep-grammar-mistake-box">
          <strong>⚠️ Common Mistake:</strong> Don't use Present Perfect with specific past time markers! (Say: <em>"I finished yesterday"</em>, NOT <em>"I have finished yesterday"</em>).
        </div>
      `
    },
    {
      id: 'grammar-ch-conditionals',
      cat: 'conditionals',
      icon: '🔀',
      title: 'Chapter 2: Conditionals (Zero, 1st, 2nd, 3rd & Mixed)',
      desc: 'Conditional clauses express factual truths, future possibilities, hypothetical imaginations, and past regrets.',
      content: `
        <div class="deep-grammar-ex-row">
          <strong>1. Zero Conditional (Scientific / General Facts):</strong>
          <div class="deep-grammar-formula-box">If + Present Simple, ... Present Simple</div>
          <div><em>Example:</em> If you heat ice, it melts. (Whenever condition happens, result is 100% automatic).</div>
        </div>
        <div class="deep-grammar-ex-row">
          <strong>2. First Conditional (Real Future Possibility):</strong>
          <div class="deep-grammar-formula-box">If + Present Simple, ... will / can / may + V1 (Base Form)</div>
          <div><em>Example:</em> If it rains tomorrow, we will stay at home.</div>
        </div>
        <div class="deep-grammar-ex-row">
          <strong>3. Second Conditional (Hypothetical / Unreal Present or Future):</strong>
          <div class="deep-grammar-formula-box">If + Past Simple (were for all subjects), ... would / could + V1</div>
          <div><em>Example:</em> If I had a million dollars, I would travel the world. (I don't have it right now).</div>
          <div><em>Example:</em> If I <strong>were</strong> you, I would accept the job offer. (Always use <em>were</em> with I/he/she in formal English).</div>
        </div>
        <div class="deep-grammar-ex-row">
          <strong>4. Third Conditional (Past Regrets / Unreal Past):</strong>
          <div class="deep-grammar-formula-box">If + Past Perfect (had + V3), ... would have + V3</div>
          <div><em>Example:</em> If she had studied harder, she would have passed the exam. (She didn't study, so she failed).</div>
        </div>
        <div class="deep-grammar-mistake-box">
          <strong>⚠️ Golden Rule:</strong> Never use <em>will</em> or <em>would</em> directly in the <em>If-clause</em>! (Say: <em>"If she comes, I will call you"</em>, NOT <em>"If she will come..."</em>).
        </div>
      `
    },
    {
      id: 'grammar-ch-passive',
      cat: 'passive',
      icon: '🔄',
      title: 'Chapter 3: Active vs. Passive Voice Transformations',
      desc: 'Use passive voice when the action or object is more important than who did it, or when the agent is unknown.',
      content: `
        <div class="deep-grammar-formula-box">
          Passive Formula: Object + Appropriate form of BE + Past Participle (V3) (+ by Subject)
        </div>
        <div class="deep-grammar-table-wrap">
          <table class="deep-grammar-table">
            <thead>
              <tr>
                <th>Tense</th>
                <th>Active Voice</th>
                <th>Passive Voice Transformation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Present Simple</td>
                <td>The chef cooks the meal.</td>
                <td>The meal <strong>is cooked</strong> by the chef.</td>
              </tr>
              <tr>
                <td>Past Simple</td>
                <td>Shakespeare wrote Hamlet.</td>
                <td>Hamlet <strong>was written</strong> by Shakespeare.</td>
              </tr>
              <tr>
                <td>Present Continuous</td>
                <td>They are repairing the road.</td>
                <td>The road <strong>is being repaired</strong>.</td>
              </tr>
              <tr>
                <td>Present Perfect</td>
                <td>Someone has stolen my keys.</td>
                <td>My keys <strong>have been stolen</strong>.</td>
              </tr>
              <tr>
                <td>Modals (can/must/should)</td>
                <td>You must submit the report.</td>
                <td>The report <strong>must be submitted</strong>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'grammar-ch-modals',
      cat: 'modals',
      icon: '🎯',
      title: 'Chapter 4: Modal Verbs & Degrees of Certainty',
      desc: 'Modal auxiliary verbs convey probability, necessity, permission, and regrets.',
      content: `
        <div class="deep-grammar-ex-row">
          <strong>• Must vs Have to:</strong> <em>Must</em> = personal obligation / strong deduction (<em>"You must see this movie!"</em> / <em>"He must be tired"</em>). <em>Have to</em> = external rule/law (<em>"I have to wear a uniform"</em>).
        </div>
        <div class="deep-grammar-ex-row">
          <strong>• Should / Ought to:</strong> Giving advice or recommendation (<em>"You should drink more water daily"</em>).
        </div>
        <div class="deep-grammar-ex-row">
          <strong>• Might / May / Could:</strong> Expressing 30% - 50% possibility (<em>"It might rain later"</em>).
        </div>
        <div class="deep-grammar-ex-row">
          <strong>• Past Modals (Deductions &amp; Regrets):</strong>
          <div>- <code>Must have + V3</code>: 99% certainty in past (<em>"She must have forgotten her phone"</em>).</div>
          <div>- <code>Can't have + V3</code>: 99% impossibility in past (<em>"He can't have said that!"</em>).</div>
          <div>- <code>Should have + V3</code>: Regret about past (<em>"I should have left earlier"</em>).</div>
        </div>
      `
    },
    {
      id: 'grammar-ch-agreement',
      cat: 'agreement',
      icon: '⚖️',
      title: 'Chapter 5: Subject-Verb Agreement & Tricky Plurals',
      desc: 'Rules to avoid common subject and verb mismatch errors.',
      content: `
        <div class="deep-grammar-ex-row">
          <strong>1. Neither / Either:</strong> When connecting two singular nouns with <em>neither...nor</em> or <em>either...or</em>, the verb agrees with the closer subject! (<em>"Neither the teacher nor the students <strong>were</strong> ready"</em>).
        </div>
        <div class="deep-grammar-ex-row">
          <strong>2. Collective Nouns &amp; Quantifiers:</strong> <em>"Everyone / Everybody / Each / Nobody"</em> always take a <strong>singular verb</strong>! (<em>"Everyone <strong>has</strong> submitted their test"</em>, NOT <em>have</em>).
        </div>
        <div class="deep-grammar-ex-row">
          <strong>3. Uncountable Nouns:</strong> <em>Information, advice, furniture, luggage, bread, news, weather</em> are uncountable and take singular verbs! (<em>"The news <strong>is</strong> exciting"</em>, NOT <em>are</em>).
        </div>
      `
    },
    {
      id: 'grammar-ch-prepositions',
      cat: 'prepositions',
      icon: '📍',
      title: 'Chapter 6: Prepositions of Time, Place & Dependent Prepositions',
      desc: 'Master the rules for AT, ON, IN and tricky preposition combinations.',
      content: `
        <div class="deep-grammar-table-wrap">
          <table class="deep-grammar-table">
            <thead>
              <tr>
                <th>Preposition</th>
                <th>Time Rules</th>
                <th>Place Rules</th>
                <th>Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>AT</strong></td>
                <td>Exact clock time, night, weekend</td>
                <td>Exact points, addresses</td>
                <td>at 5:00 PM, at night, at the station</td>
              </tr>
              <tr>
                <td><strong>ON</strong></td>
                <td>Days, dates, specific holidays</td>
                <td>Surfaces, streets, transport (bus/train)</td>
                <td>on Monday, on May 12th, on the table</td>
              </tr>
              <tr>
                <td><strong>IN</strong></td>
                <td>Months, years, seasons, decades</td>
                <td>Enclosed spaces, cities, countries</td>
                <td>in July, in 2025, in the room, in London</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="deep-grammar-ex-row">
          <strong>• For vs Since:</strong> <em>For</em> = duration / period of time (<em>for 3 hours, for 10 years</em>). <em>Since</em> = starting point in time (<em>since Monday, since 2018, since 9 AM</em>).
        </div>
        <div class="deep-grammar-ex-row">
          <strong>• Fixed Dependent Prepositions:</strong> <em>Depend on, interested in, good at, afraid of, insist on, believe in, listen to, fond of, proud of</em>.
        </div>
      `
    },
    {
      id: 'grammar-ch-reported',
      cat: 'reported',
      icon: '💬',
      title: 'Chapter 7: Direct & Indirect (Reported) Speech',
      desc: 'When reporting what someone said in the past, shift tenses one step back (Backshifting).',
      content: `
        <div class="deep-grammar-table-wrap">
          <table class="deep-grammar-table">
            <thead>
              <tr>
                <th>Direct Speech</th>
                <th>Reported / Indirect Speech</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>"I am tired." (Present Simple)</td>
                <td>He said that he <strong>was</strong> tired. (Past Simple)</td>
              </tr>
              <tr>
                <td>"I will help you." (Will)</td>
                <td>She promised that she <strong>would</strong> help me. (Would)</td>
              </tr>
              <tr>
                <td>"I have lost my key." (Present Perfect)</td>
                <td>He said that he <strong>had lost</strong> his key. (Past Perfect)</td>
              </tr>
              <tr>
                <td>"I bought a car." (Past Simple)</td>
                <td>She said that she <strong>had bought</strong> a car. (Past Perfect)</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'grammar-ch-errors',
      cat: 'errors',
      icon: '⚠️',
      title: 'Chapter 8: Tricky Common Mistakes & Collocations',
      desc: 'Common confusing word pairs and traps.',
      content: `
        <div class="deep-grammar-ex-row">
          <strong>• Make vs Do:</strong> 
          <div>- <strong>Do:</strong> <em>do homework, do business, do a favor, do exercise, do the laundry.</em></div>
          <div>- <strong>Make:</strong> <em>make a mistake, make a decision, make coffee, make money, make progress.</em></div>
        </div>
        <div class="deep-grammar-ex-row">
          <strong>• Say vs Tell:</strong> <em>Say something (to someone)</em> (<em>"She said that she was happy"</em>). <em>Tell someone something</em> (<em>"She told me a story"</em>). Never say <em>"She told to me"</em>!
        </div>
        <div class="deep-grammar-ex-row">
          <strong>• Affect vs Effect:</strong> <em>Affect</em> is usually a <strong>verb</strong> (<em>"The weather affects my mood"</em>). <em>Effect</em> is usually a <strong>noun</strong> (<em>"The side effect of the medicine"</em>).
        </div>
      `
    }
  ];

  const filteredChapters = $derived.by(() => {
    return grammarChapters.filter((ch) => {
      const matchCat = deepGrammarCat === 'all' || ch.cat === deepGrammarCat;
      if (!matchCat) return false;
      if (!deepGrammarSearch.trim()) return true;
      const q = deepGrammarSearch.toLowerCase();
      return (
        ch.title.toLowerCase().includes(q) ||
        ch.desc.toLowerCase().includes(q) ||
        ch.content.toLowerCase().includes(q)
      );
    });
  });
</script>

<div class="tab-content active" id="tab-english" style="display: block;">
  <!-- Section Title Badge -->
  <div class="section-title english-title">
    <span>🇬🇧</span> DAILY ENGLISH TOOLKIT
  </div>

  <!-- 1. GRAMMAR SESSION -->
  <div class="english-module-card">
    <div class="english-module-header">
      <div class="english-module-title-wrap">
        <div class="english-module-icon">📝</div>
        <div>
          <div class="english-module-name">Grammar Session</div>
          <div style="font-size: 11px; color: #64748b">Daily lessons &amp; exercises</div>
        </div>
      </div>
      <a
        class="yt-link"
        href="https://www.youtube.com/@letstalk"
        target="_blank"
        rel="noopener noreferrer"
        style="margin: 0"
      >
        <span>▶</span> @letstalk
      </a>
    </div>

    <!-- Grammar Revision Topics Hub Card -->
    <div class="grammar-revision-card" style="margin: 12px 0">
      <div class="grammar-revision-header-row">
        <div class="grammar-revision-title-wrap">
          <span class="grammar-pulse-dot"></span>
          <span class="grammar-revision-title">REVISION TOPICS &amp; RULES</span>
          <span class="grammar-revision-count-badge" id="grammarRevisionCountBadge-hub">
            {grammarTopics.length} {grammarTopics.length === 1 ? 'topic' : 'topics'}
          </span>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button
            type="button"
            class="grammar-add-topic-btn"
            onclick={() => (showDeepGrammarModal = true)}
            title="Read comprehensive English grammar rules, formulas & examples"
            style="background: #ede9fe; color: #5b21b6; border-color: #8b5cf6;"
          >
            <span>📖</span> Deep Grammar Guide
          </button>
          <button
            type="button"
            class="grammar-add-topic-btn"
            onclick={() => openTopicModal('grammar')}
            title="Add new revision topic, link & notes"
          >
            <span>➕</span> Add Topic
          </button>
        </div>
      </div>

      <div class="grammar-topics-list" id="grammarTopicsList-hub">
        {#if grammarTopics.length === 0}
          <div class="grammar-topics-empty">
            <span style="font-size: 22px;">📚</span>
            <div style="font-weight: 600; color: #475569;">No grammar topics added yet</div>
            <div style="font-size: 11.5px; color: #94a3b8;">Save revision video links &amp; lesson topics here</div>
            <button
              type="button"
              class="grammar-empty-add-btn"
              onclick={() => openTopicModal('grammar')}
            >
              + Add Your First Topic
            </button>
          </div>
        {:else}
          {#each grammarTopics as item (item.id)}
            {@const normUrl = getNormalizedUrl(item.url)}
            <div class="grammar-topic-item">
              <div class="grammar-topic-item-header">
                <button
                  type="button"
                  class="grammar-topic-item-left"
                  onclick={() => normUrl && window.open(normUrl, '_blank', 'noopener,noreferrer')}
                  style="background: transparent; border: none; padding: 0; text-align: left; {normUrl ? 'cursor: pointer;' : 'cursor: default;'}"
                >
                  <div class="grammar-topic-badge-icon">
                    <span>📚</span>
                  </div>
                  <div class="grammar-topic-name">{item.title || 'Grammar Lesson'}</div>
                </button>
                <div class="grammar-topic-item-actions">
                  {#if normUrl}
                    <a
                      class="grammar-topic-circle-btn"
                      href={normUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Link ↗"
                    >
                      <span>↗</span>
                    </a>
                  {:else}
                    <span class="grammar-topic-circle-btn disabled" title="No link attached">
                      <span>—</span>
                    </span>
                  {/if}
                  <button
                    type="button"
                    class="grammar-item-action-btn"
                    onclick={() => openTopicModal('grammar', item)}
                    title="Edit Topic"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="grammar-item-action-btn delete-btn"
                    onclick={() => deleteTopic(item.id, 'grammar')}
                    title="Delete Topic"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Grammar Timer -->
    <div class="timer-wrap" style="margin-top: 6px">
      <div
        class="timer-display"
        id="timer-display-grammar-hub"
        class:done={grammarRemaining === 0}
      >
        {formatTimer(grammarRemaining)}
      </div>
      <div class="timer-info">
        <div class="adhkar-label" style="margin-bottom: 2px">⏱️ Grammar Timer</div>
        <div class="timer-controls">
          <button class="timer-btn" onclick={toggleGrammarTimer}>
            {isGrammarRunning ? 'Pause' : 'Start'}
          </button>
          <button class="timer-reset-btn" onclick={resetGrammarTimer} title="Reset">
            ↺
          </button>
          <div class="timer-adjust">
            <button
              class="timer-adjust-btn"
              disabled={isGrammarRunning || grammarMinutes <= 1}
              onclick={() => adjustGrammarMinutes(-1)}
            >
              −
            </button>
            <span class="timer-minutes">{grammarMinutes}m</span>
            <button
              class="timer-adjust-btn"
              disabled={isGrammarRunning || grammarMinutes >= 60}
              onclick={() => adjustGrammarMinutes(1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. PHONICS -->
  <div class="english-module-card">
    <div class="english-module-header">
      <div class="english-module-title-wrap">
        <div
          class="english-module-icon"
          style="display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; background: #38bdf8; color: #ffffff; border-radius: 8px; border: 1.5px solid #0284c7;"
        >
          abc
        </div>
        <div>
          <div class="english-module-name">Phonics &amp; Pronunciation</div>
          <div style="font-size: 11px; color: #64748b">Alphabet sounds &amp; drills</div>
        </div>
      </div>
      <a
        class="yt-link"
        href="https://www.instagram.com/the.alphabet_/"
        target="_blank"
        rel="noopener noreferrer"
        style="margin: 0"
      >
        <span>📷</span> @the.alphabet_
      </a>
    </div>

    <!-- Phonics Revision Topics Hub Card -->
    <div class="grammar-revision-card" style="margin: 12px 0">
      <div class="grammar-revision-header-row">
        <div class="grammar-revision-title-wrap">
          <span class="grammar-pulse-dot"></span>
          <span class="grammar-revision-title">PHONICS TOPICS &amp; LINKS</span>
          <span class="grammar-revision-count-badge" id="phonicsRevisionCountBadge-hub">
            {phonicsTopics.length} {phonicsTopics.length === 1 ? 'topic' : 'topics'}
          </span>
        </div>
        <button
          type="button"
          class="grammar-add-topic-btn"
          onclick={() => openTopicModal('phonics')}
          title="Add new phonics topic & link"
        >
          <span>➕</span> Add Topic
        </button>
      </div>

      <div class="grammar-topics-list" id="phonicsTopicsList-hub">
        {#if phonicsTopics.length === 0}
          <div class="grammar-topics-empty">
            <div
              style="width: 32px; height: 32px; background: #38bdf8; color: #ffffff; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; margin-bottom: 4px;"
            >
              abc
            </div>
            <div style="font-weight: 600; color: #475569;">No phonics topics added yet</div>
            <div style="font-size: 11.5px; color: #94a3b8;">Save pronunciation drills &amp; phonics video links here</div>
            <button
              type="button"
              class="grammar-empty-add-btn"
              onclick={() => openTopicModal('phonics')}
            >
              + Add Your First Topic
            </button>
          </div>
        {:else}
          {#each phonicsTopics as item (item.id)}
            {@const normUrl = getNormalizedUrl(item.url)}
            <div class="grammar-topic-item">
              <div class="grammar-topic-item-header">
                <button
                  type="button"
                  class="grammar-topic-item-left"
                  onclick={() => normUrl && window.open(normUrl, '_blank', 'noopener,noreferrer')}
                  style="background: transparent; border: none; padding: 0; text-align: left; {normUrl ? 'cursor: pointer;' : 'cursor: default;'}"
                >
                  <div class="grammar-topic-badge-icon">
                    <span>🔤</span>
                  </div>
                  <div class="grammar-topic-name">{item.title || 'Phonics Lesson'}</div>
                </button>
                <div class="grammar-topic-item-actions">
                  {#if normUrl}
                    <a
                      class="grammar-topic-circle-btn"
                      href={normUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Link ↗"
                    >
                      <span>↗</span>
                    </a>
                  {:else}
                    <span class="grammar-topic-circle-btn disabled" title="No link attached">
                      <span>—</span>
                    </span>
                  {/if}
                  <button
                    type="button"
                    class="grammar-item-action-btn"
                    onclick={() => openTopicModal('phonics', item)}
                    title="Edit Topic"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="grammar-item-action-btn delete-btn"
                    onclick={() => deleteTopic(item.id, 'phonics')}
                    title="Delete Topic"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Phonics Timer -->
    <div class="timer-wrap" style="margin-top: 6px">
      <div
        class="timer-display"
        id="timer-display-phonics-hub"
        class:done={phonicsRemaining === 0}
      >
        {formatTimer(phonicsRemaining)}
      </div>
      <div class="timer-info">
        <div class="adhkar-label" style="margin-bottom: 2px">⏱️ Phonics Timer</div>
        <div class="timer-controls">
          <button class="timer-btn" onclick={togglePhonicsTimer}>
            {isPhonicsRunning ? 'Pause' : 'Start'}
          </button>
          <button class="timer-reset-btn" onclick={resetPhonicsTimer} title="Reset">
            ↺
          </button>
          <div class="timer-adjust">
            <button
              class="timer-adjust-btn"
              disabled={isPhonicsRunning || phonicsMinutes <= 1}
              onclick={() => adjustPhonicsMinutes(-1)}
            >
              −
            </button>
            <span class="timer-minutes">{phonicsMinutes}m</span>
            <button
              class="timer-adjust-btn"
              disabled={isPhonicsRunning || phonicsMinutes >= 60}
              onclick={() => adjustPhonicsMinutes(1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ==================== TOPIC MODAL (GRAMMAR & PHONICS) ==================== -->
{#if showTopicModal}
  <div
    class="modal-overlay show"
    role="presentation"
    onclick={(e) => e.target === e.currentTarget && closeTopicModal()}
    onkeydown={(e) => e.key === 'Escape' && closeTopicModal()}
  >
    <div class="modal-card">
      <div class="modal-title">
        {topicModalEditId ? '✏️ Edit' : '📝 Add'} {topicModalType === 'grammar' ? 'Grammar' : 'Phonics'} Topic
      </div>
      <div class="modal-subtitle">
        Save a {topicModalType === 'grammar' ? 'grammar lesson' : 'phonics & pronunciation'} link with its title
      </div>

      <div class="input-group">
        <label class="input-label" for="topicTitleInput">
          {topicModalType === 'grammar' ? 'Topic / Lesson Title' : 'Topic / Drill Title'}
        </label>
        <input
          type="text"
          class="input-field"
          id="topicTitleInput"
          placeholder={topicModalType === 'grammar' ? 'e.g. Past Continuous & Perfect Tense' : 'e.g. Vowel Sounds / Letter Blends / Silent Letters'}
          bind:value={topicModalTitle}
        />
      </div>

      <div class="input-group">
        <label class="input-label" for="topicUrlInput">Revision Video / Web Link</label>
        <input
          type="url"
          class="input-field"
          id="topicUrlInput"
          placeholder="e.g. https://youtu.be/... or www.instagram.com/..."
          bind:value={topicModalUrl}
        />
      </div>

      <div class="modal-buttons">
        <button class="modal-btn modal-btn-cancel" type="button" onclick={closeTopicModal}>
          Cancel
        </button>
        <button class="modal-btn modal-btn-save" type="button" onclick={saveTopic}>
          {topicModalEditId ? 'Save Changes' : 'Save Topic'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- ==================== DEEP GRAMMAR GUIDE MODAL ==================== -->
{#if showDeepGrammarModal}
  <div
    class="modal-overlay show"
    id="deepGrammarModal"
    role="presentation"
    onclick={(e) => e.target === e.currentTarget && (showDeepGrammarModal = false)}
    onkeydown={(e) => e.key === 'Escape' && (showDeepGrammarModal = false)}
  >
    <div class="modal-card deep-grammar-modal">
      <!-- Modal Top Header -->
      <div class="deep-grammar-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div
            style="width: 38px; height: 38px; border-radius: 12px; background: #ede9fe; color: #6d28d9; border: 2px solid var(--ink); display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 2px 0 var(--ink);"
          >
            📖
          </div>
          <div>
            <div style="font-size: 16px; font-weight: 900; color: #1e1b4b;">Comprehensive Deep Grammar Guide</div>
            <div style="font-size: 11.5px; color: #64748b;">
              Formulas • CEFR B1/B2 Rules • Sentence Examples • Mistake Traps
            </div>
          </div>
        </div>
        <button
          type="button"
          class="pdf-action-btn"
          onclick={() => (showDeepGrammarModal = false)}
          style="padding: 5px 10px; font-size: 13px; font-weight: 800; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;"
        >
          ✕
        </button>
      </div>

      <!-- Search & Filter Controls -->
      <div style="margin-bottom: 10px; flex-shrink: 0;">
        <input
          type="text"
          class="input-field"
          id="deepGrammarSearchInput"
          placeholder="🔍 Search grammar topic (e.g. Conditionals, Passive Voice, Since/For, Tenses)..."
          bind:value={deepGrammarSearch}
          style="margin-bottom: 8px; font-size: 13.5px;"
        />
        <div class="deep-grammar-nav-pills" id="deepGrammarPills">
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'all' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'all')}
          >
            📚 All Chapters
          </button>
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'tenses' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'tenses')}
          >
            ⏳ Tenses Matrix
          </button>
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'conditionals' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'conditionals')}
          >
            🔀 Conditionals
          </button>
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'passive' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'passive')}
          >
            🔄 Passive Voice
          </button>
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'modals' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'modals')}
          >
            🎯 Modal Verbs
          </button>
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'agreement' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'agreement')}
          >
            ⚖️ Subject-Verb
          </button>
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'prepositions' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'prepositions')}
          >
            📍 Prepositions
          </button>
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'reported' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'reported')}
          >
            💬 Reported Speech
          </button>
          <button
            type="button"
            class="deep-grammar-pill {deepGrammarCat === 'errors' ? 'active' : ''}"
            onclick={() => (deepGrammarCat = 'errors')}
          >
            ⚠️ Common Traps
          </button>
        </div>
      </div>

      <!-- Scrollable Reference Guide Body -->
      <div class="deep-grammar-scroll-body" id="deepGrammarBody">
        {#each filteredChapters as ch (ch.id)}
          <div class="deep-grammar-card" data-cat={ch.cat} id={ch.id}>
            <div class="deep-grammar-card-title">
              <span>{ch.icon}</span> {ch.title}
            </div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">
              {ch.desc}
            </div>
            {@html ch.content}
          </div>
        {/each}
        {#if filteredChapters.length === 0}
          <div style="text-align: center; padding: 30px; color: #64748b; font-weight: 600;">
            🔍 No grammar chapters found matching "{deepGrammarSearch}"
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div
        style="display: flex; justify-content: flex-end; margin-top: 12px; padding-top: 8px; border-top: 1.5px dashed #cbd5e1; flex-shrink: 0;"
      >
        <button
          type="button"
          class="pdf-action-btn pdf-btn-primary"
          onclick={() => (showDeepGrammarModal = false)}
          style="padding: 8px 22px; font-weight: 800;"
        >
          ✓ Done Reading
        </button>
      </div>
    </div>
  </div>
{/if}
