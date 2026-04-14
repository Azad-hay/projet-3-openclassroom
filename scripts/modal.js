const arrowBack = document.querySelector('.arrow')
const ajoutPhoto = document.querySelector('.buttonGalerie')

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


document.querySelectorAll('.cross').forEach(btn => {
    btn.addEventListener('click', () => {
        modalcreate.style.opacity = '0';
        setTimeout(() => {
            modalcreate.style.display = 'none';
        }, 300);
        modalGalerie.style.transform = 'translateX(0)';
        modalAjout.style.transform = 'translateX(100%)';
    });
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
            imageCatValue.value = categories.id;
            imageCatValue.textContent = categories.name;
            imageCatOption.appendChild(imageCatValue)
      
    });

    } catch (e) {
        console.error('Failed to fetch Categories:', e);
    }
})();


const previewImg = document.getElementById('inputFile')

previewImg.addEventListener('change', (e) =>{
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('previewImg')
        preview.src = e.target.result;
        preview.style.display = 'block'
    };
    reader.readAsDataURL(file);
})





const btnAjoutPhotoProjet = document.querySelector('.buttonValiderForm')

btnAjoutPhotoProjet.addEventListener('click', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const newImg = document.getElementById("inputFile").files[0];
    const newImgTitle = document.getElementById('imageTitle').value;
    const newImgCat = document.getElementById('imageCategorie').value;


    const formData = new FormData();
    formData.append('image', newImg)
    formData.append('title', newImgTitle)
    formData.append('category', parseInt(newImgCat));
  

    try {
        const resNewImg = await fetch('http://localhost:5678/api/works',{

            method: 'POST',
            headers :{
                   'Accept': '*/*',
                        'Authorization': `Bearer ${token}`,
                      
                    },
            body: formData
            
        });
        if (!resNewImg.ok) throw new Error (`HTTP ${resNewImg.status}`);
        const newWork = await resNewImg.json();

        allWorksMini.push(newWork);

        const resRefresh = await fetch('http://localhost:5678/api/works');
        const updatedWorks = await resRefresh.json()

        allWorksMini = updatedWorks
        renderGallery(allWorksMini)
        editionModeGallerie(allWorksMini)

        
        setTimeout(() => {
        modalGalerie.style.transform = 'translateX(0)';
        modalAjout.style.transform = 'translateX(100%)';
        }, 200);

        document.querySelector('.ajoutForm').reset();
        document.getElementById('previewImg').style.display = 'flex';
        document.getElementById('previewImg').src = 'assets/icons/picture.png' ;
        

    } catch (e) {
        console.error("Echec de l'ajout:", e);
    }

});

function checkForm() {
    const newImg = document.getElementById('inputFile').files[0];
    const newImgTitle = document.getElementById('imageTitle').value;
    const newImgCat = document.getElementById('imageCategorie').value;

    const btnValider = document.querySelector('.buttonValiderForm');

    if (newImg && newImgTitle && newImgCat) {
        btnValider.style.backgroundColor = '#1D6154';
    } else {  
        btnValider.style.backgroundColor = '#a7a7a7';
    }
}

document.getElementById('inputFile').addEventListener('change', checkForm);
document.getElementById('imageTitle').addEventListener('input', checkForm);
document.getElementById('imageCategorie').addEventListener('change', checkForm);