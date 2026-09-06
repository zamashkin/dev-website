const experienceTeaser = document.querySelector('.section-teaser[href="#experience"]');
experienceTeaser?.addEventListener('click', (event) => {
  const experienceHeading = document.querySelector('#experience .section-heading');
  if (!experienceHeading) return;

  event.preventDefault();
  experienceHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.pushState(null, '', '#experience');
});

const timeline = document.querySelector('.timeline');
const timelineCards = timeline ? [
  timeline.querySelector('.work-one'),
  timeline.querySelector('.work-two'),
  timeline.querySelector('.work-three'),
] : [];
const contractCard = timeline?.querySelector('.contract-card');
const graph = timeline?.querySelector('.git-graph');
const graphTrunk = graph?.querySelector('.graph-main-trunk');
const graphBranches = graph?.querySelector('.graph-main-branches');
const contractBranches = graph?.querySelector('.graph-contract-branches');
const graphNodes = [...(graph?.querySelectorAll('.graph-nodes circle') || [])];

const layoutTimeline = () => {
  if (!timeline || !graph || !contractCard || timelineCards.some((card) => !card)) return;

  if (window.innerWidth < 1100) {
    const isMobile = window.innerWidth <= 640;
    const cards = [...timelineCards, contractCard];
    const nodeX = isMobile ? 28 : 48;
    const firstCardTop = 24;
    const cardGap = isMobile ? 14 : 18;
    const nodeOffset = isMobile ? 58 : 68;
    let nextCardTop = firstCardTop;

    const nodePositions = cards.map((card) => {
      card.style.top = `${nextCardTop}px`;
      const nodePosition = nextCardTop + Math.min(nodeOffset, card.offsetHeight / 2);
      nextCardTop += card.offsetHeight + cardGap;
      return nodePosition;
    });

    const graphWidth = timeline.clientWidth;
    const cardLeft = timelineCards[0].offsetLeft;
    const timelineHeight = nextCardTop + 6;
    const lastNodePosition = nodePositions[nodePositions.length - 1];
    timeline.style.height = `${timelineHeight}px`;
    graph.setAttribute('viewBox', `0 0 ${graphWidth} ${timelineHeight}`);
    graphTrunk?.setAttribute('d', `M${nodeX} 28V${lastNodePosition}`);
    graphBranches?.setAttribute('d', nodePositions.slice(0, -1).map((position) => `M${nodeX} ${position}H${cardLeft}`).join(''));
    contractBranches?.setAttribute('d', `M${nodeX} ${lastNodePosition}H${cardLeft}`);

    graphNodes.forEach((node, index) => {
      node.setAttribute('cx', nodeX);
      node.setAttribute('cy', nodePositions[index]);
      node.setAttribute('r', isMobile ? 7 : 8);
    });
    return;
  }

  const firstCardTop = 80;
  const cardGap = 24;
  const nodeOffset = 90;
  const contractOffset = 110;
  const contractEntryOffset = 30;
  const returnGap = 35;
  let nextCardTop = firstCardTop;

  const nodePositions = timelineCards.map((card) => {
    card.style.top = `${nextCardTop}px`;
    const nodePosition = nextCardTop + Math.min(nodeOffset, card.offsetHeight / 2);
    nextCardTop += card.offsetHeight + cardGap;
    return nodePosition;
  });

  const thirdCard = timelineCards[2];
  const thirdCardTop = Number.parseFloat(thirdCard.style.top);
  const contractTop = thirdCardTop + contractOffset;
  contractCard.style.top = `${contractTop}px`;

  const contractEntry = contractTop + contractEntryOffset;
  const contractBottom = contractTop + contractCard.offsetHeight;
  const thirdCardBottom = thirdCardTop + thirdCard.offsetHeight;
  const returnPosition = Math.max(contractBottom, thirdCardBottom) + returnGap;
  const timelineHeight = returnPosition + 75;

  timeline.style.height = `${timelineHeight}px`;
  graph.setAttribute('viewBox', `0 0 1100 ${timelineHeight}`);
  graphTrunk?.setAttribute('d', `M56 70V${returnPosition}`);
  graphBranches?.setAttribute('d', nodePositions.map((position) => `M56 ${position}H140`).join(''));
  contractBranches?.setAttribute('d', `M570 ${contractEntry}H650M865 ${contractBottom}C865 ${contractBottom + 30} 828 ${returnPosition} 760 ${returnPosition}H56`);

  [...nodePositions, returnPosition].forEach((position, index) => {
    graphNodes[index]?.setAttribute('cx', 56);
    graphNodes[index]?.setAttribute('cy', position);
    graphNodes[index]?.setAttribute('r', 10);
  });
};

let timelineLayoutFrame;
const scheduleTimelineLayout = () => {
  if (timelineLayoutFrame) return;
  timelineLayoutFrame = window.requestAnimationFrame(() => {
    timelineLayoutFrame = undefined;
    layoutTimeline();
  });
};

if (timeline) {
  layoutTimeline();
  window.addEventListener('resize', scheduleTimelineLayout);
  if ('ResizeObserver' in window) {
    const timelineResizeObserver = new ResizeObserver(scheduleTimelineLayout);
    [...timelineCards, contractCard].forEach((card) => card && timelineResizeObserver.observe(card));
  }
}

const copyButton = document.querySelector('.copy-email');
const copyText = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch { /* Use the local-preview fallback below. */ }

  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  const previousFocus = document.activeElement;
  document.body.append(field);
  try {
    field.select();
    if (!document.execCommand('copy')) {
      throw new Error('Email could not be copied');
    }
  } finally {
    field.remove();
    previousFocus?.focus();
  }
};

const copyButtonLabel = copyButton?.innerHTML;
let copyResetTimer;

copyButton?.addEventListener('click', async () => {
  if (copyButton.disabled) return;

  window.clearTimeout(copyResetTimer);
  copyButton.disabled = true;
  copyButton.classList.remove('is-copied');
  copyButton.textContent = 'Copying…';

  try {
    await copyText(copyButton.dataset.email);
    copyButton.classList.add('is-copied');
    copyButton.innerHTML = '<span aria-hidden="true">✓</span> Copied';
  } catch {
    copyButton.textContent = 'Copy failed — retry';
  } finally {
    copyButton.disabled = false;
    copyResetTimer = window.setTimeout(() => {
      copyButton.classList.remove('is-copied');
      copyButton.innerHTML = copyButtonLabel;
    }, 1800);
  }
});
