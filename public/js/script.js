const heroPoster = document.querySelector('.hero-poster');
const heroVideo = document.querySelector('.hero-video');

if (heroPoster) {
  const revealPoster = () => heroPoster.classList.add('is-ready');
  heroPoster.addEventListener('load', revealPoster, { once: true });
  if (heroPoster.complete && heroPoster.naturalWidth > 0) revealPoster();
}

if (heroVideo) {
  const revealVideo = () => {
    if (!heroVideo.error) heroVideo.classList.add('is-ready');
  };

  // Keep the poster underneath until a decoded video frame reaches the compositor.
  if ('requestVideoFrameCallback' in heroVideo) {
    heroVideo.requestVideoFrameCallback(revealVideo);
  } else {
    const revealAfterPaint = () => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(revealVideo));
    };
    if (heroVideo.readyState >= 2) revealAfterPaint();
    else heroVideo.addEventListener('loadeddata', revealAfterPaint, { once: true });
  }

  heroVideo.addEventListener('error', () => heroVideo.classList.remove('is-ready'));
}

const experienceTeaser = document.querySelector('.section-teaser[href="#experience"]');
experienceTeaser?.addEventListener('click', (event) => {
  const experienceHeading = document.querySelector('#experience .section-heading');
  if (!experienceHeading) return;

  event.preventDefault();
  experienceHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.pushState(null, '', '#experience');
});

document.querySelectorAll?.('[data-story-toggle]').forEach((button) => {
  const card = button.closest('.experience-card');
  const story = card?.querySelector('.experience-story');
  if (!story) return;
  card.classList.add('is-interactive');
  let storyFrame;

  button.addEventListener('click', () => {
    if (storyFrame) window.cancelAnimationFrame(storyFrame);
    storyFrame = undefined;
    const wasExpanded = button.getAttribute('aria-expanded') === 'true';
    story.style.height = `${story.getBoundingClientRect().height}px`;
    story.classList.toggle('is-expanded', !wasExpanded);
    button.setAttribute('aria-expanded', String(!wasExpanded));
    button.textContent = wasExpanded ? 'Read more' : 'Show less';
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      story.style.height = '';
      return;
    }
    storyFrame = window.requestAnimationFrame(() => {
      storyFrame = undefined;
      const styles = getComputedStyle(story);
      const previewHeight = Number.parseFloat(styles.getPropertyValue('--preview-height'));
      story.style.height = `${wasExpanded ? previewHeight : story.scrollHeight}px`;
    });
  });

  story.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'height') story.style.height = '';
  });
});

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
