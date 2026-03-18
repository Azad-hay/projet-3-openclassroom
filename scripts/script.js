// works fetcher — store works in outer variable
let allWorks = [];



function renderGallery(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
  works.forEach(work => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${work.imageUrl ? `<img src="${work.imageUrl}" alt="${work.title}">` : ''}
      <p class="title">${work.title}</p>`;
    gallery.appendChild(card);
  });
}

(async () => {
  try {
    const resGallery = await fetch('http://localhost:5678/api/works');
    if (!resGallery.ok) throw new Error(`HTTP ${resGallery.status}`);
    allWorks = await resGallery.json();
    renderGallery(allWorks);
  } catch (e) {
    console.error('Failed to fetch works:', e);
  }
})();

(async () => {
  try {
    const resCategorie = await fetch('http://localhost:5678/api/categories');
    if (!resCategorie.ok) throw new Error(`HTTP ${resCategorie.status}`);
    const categorie = await resCategorie.json();

    const button = document.querySelector('.filter');

    const allBtn = document.createElement('button');
    allBtn.className = 'button';
    allBtn.textContent = 'Tous';
    button.appendChild(allBtn);

    categorie.forEach(categories => {
      const buttonFilter = document.createElement('button');
      buttonFilter.className = 'button';
      buttonFilter.dataset.id = categories.id;
      buttonFilter.textContent = categories.name;
      button.appendChild(buttonFilter);
    });

    button.addEventListener('click', function(e) {
      if (!e.target.matches('.button')) return;
      const id = e.target.dataset.id;
      const filtered = id
        ? allWorks.filter(work => work.categoryId == id)
        : allWorks;
      renderGallery(filtered);
    });

  } catch (er) {
    console.error('Failed to fetch Categories:', er);
  }
})();