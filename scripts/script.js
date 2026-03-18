(async () => {
  try {
    const res = await fetch('http://localhost:5678/api/works');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const works = await res.json();

    const gallery = document.querySelector('.gallery');
    works.forEach(work => {
      const card = document.createElement('div');
      card.className = 'card';

      const title = work.title ;
      const imgSrc = work.imageUrl;
      
      card.innerHTML = `
        ${imgSrc ? `<img src="${imgSrc}" alt="${title}">` : ''}
        <p class="title">${title}</p>`;

      gallery.appendChild(card);
    });
  } catch (e) {
    console.error('Failed to fetch works:', e);
  }
})();