const arrowBack = document.querySelector('.arrow')
const ajoutPhoto = document.querySelector('.buttonGalerie')
const cross = document.querySelector('.cross')
const modalAjout = document.querySelector('.modalAjout')
const modalGalerie = document.querySelector('.modalGalerie')
const btnModif = document.querySelector('.modification')
const modalcreate = document.querySelector('.modal')

btnModif.addEventListener('click', () => {
    modalcreate.style.display = 'flex' ;
     setTimeout(() => {
        modalcreate.style.opacity = '1';
    }, 10);
})

ajoutPhoto.addEventListener('click', () => {
    modalGalerie.style.transform = 'translateX(-100%)';
    modalAjout.style.transform = 'translateX(0)';

})

arrowBack.addEventListener('click', () => {  
    modalGalerie.style.transform = 'translateX(0)';
    modalAjout.style.transform = 'translateX(100%)';
})


cross.addEventListener('click', () => {
    modalcreate.style.opacity = '0';
    setTimeout(() => {
        modalcreate.style.display = 'none';
    }, 300);
    modalGalerie.style.transform = 'translateX(0)';
    modalAjout.style.transform = 'translateX(100%)';
});

modalcreate.addEventListener('click', (e) => {
    if (e.target === modalcreate) {
        modalcreate.style.opacity = '0';
        setTimeout(() => {
            modalcreate.style.display = 'none';
        }, 300);
        modalGalerie.style.transform = 'translateX(0)';
        modalAjout.style.transform = 'translateX(100%)';
    }
});

let allWorksMini = [];

function editionModeGallerie(allWorksMini){
    const galleryEdit = document.querySelector('.galerieModal')
    galleryEdit.innerHTML = '';
    
    allWorksMini.forEach(work => {
        const cardMini = document.createElement('div');
        cardMini.className = 'cardMini';

        const cardImg = document.createElement('img');
        cardImg.src = work.imageUrl;
        
        const cardTrash = document.createElement('button');
        cardTrash.className = 'deleteBtn';

        const trashImg = document.createElement('img');
        trashImg.className = 'trash';
        trashImg.src = 'assets/icons/trash.png';
        trashImg.alt = 'Supprimer le projet';


        cardTrash.addEventListener('click', async (e) => {
            e.preventDefault();

            const confirm = window.confirm('Voulez-vous vraiment supprimer ce projet ?');
            if (!confirm) return;

            const token = localStorage.getItem('token');
           
            
            try {
                
                
                const deleteProject = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': '*/*',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!deleteProject.ok) throw new Error(`HTTP ${deleteProject.status}`);
                cardMini.remove();
                const mainCard = document.querySelector(`.gallery [data-id="${work.id}"]`);
                if (mainCard) mainCard.remove();
                
            } catch (e) {
                console.error('Failed to delete:', e);
            }
        });

        galleryEdit.appendChild(cardMini);
        cardMini.appendChild(cardImg);
        cardMini.appendChild(cardTrash);
        cardTrash.appendChild(trashImg);
    });
}
(async () => {
  try {
    const resGalleryMini = await fetch('http://localhost:5678/api/works');
    if (!resGalleryMini.ok) throw new Error(`HTTP ${resGalleryMini.status}`);
    allWorksMini = await resGalleryMini.json();
    editionModeGallerie(allWorksMini);
  } catch (e) {
    console.error('Failed to fetch works:', e);
  }
})();





(async () => {
    try {
        const resCatValue = await fetch('http://localhost:5678/api/categories');     
        if (!resCatValue.ok) throw new Error (`HTTP ${resCatValue.status}`);
        const catOption = await resCatValue.json();  

        catOption.forEach(categories => {
            const imageCatOption = document.querySelector('.selectCat')

            const imageCatValue = document.createElement('option')
            imageCatValue.textContent = categories.name;
            imageCatOption.appendChild(imageCatValue)
      
    });

    } catch (e) {
        console.error('Failed to fetch Categories:', e);
    }
})();
