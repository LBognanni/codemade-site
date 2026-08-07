document.querySelectorAll('.sw-card').forEach(card => {
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  });
});

document.querySelectorAll('.filter-tag').forEach(tag => {
  const parent = tag.closest('section');
  if (!parent) return;
  tag.addEventListener('click', () => {
    parent.querySelectorAll('.filter-tag').forEach(item => item.classList.remove('active'));
    tag.classList.add('active');
    const filter = tag.dataset.filter;
    parent.querySelectorAll('.sw-card').forEach(card => {
      const tags = (card.dataset.tags || '').split(',');
      card.style.display = filter === 'all' || tags.includes(filter) ? '' : 'none';
    });
  });
});
