

function filterProducts(array, id, action) {
    if(action === 'render') {
        array.map(article => {
            if(article._id === ((id).toString())) {
                if(cart.indexOf(article) === -1) {
                    article.cantidad = 1;
                    cart.push(article)
                }
            }
        });
    }

    if(action === 'renderFiltered') {
        cart = cart.filter(article => article._id !== ((id).toString()))
    }

    if(action === 'addOne') {
        array.map(article => {
            if(article._id === ((id).toString())) {
                console.log(article)
                    article.cantidad++;
            }
        });
    }

    if(action === 'removeOne') {
        array.map(article => {
            if(article._id === ((id).toString())) {
                if(article.cantidad > 1) {
                    article.cantidad--;
                }
            }
        });
    }
    
    localStorage.setItem('carrito', JSON.stringify(cart))
    checkCartLength();
    renderProducts(cart);
    getTotal();
}


function renderProducts(cart) {
    const listItems = document.querySelector('#listItems');
    listItems.innerHTML = ''
    cart.map(article => {
        const tr = document.createElement('tr');
        tr.classList.add('py-2')
        tr.innerHTML = `
            <td data-removeOne="${article._id}" class="w10 cursor-pointer text-center">-</td>
            <td data-quanty="${article._id}" class="w10 text-center">${article.cantidad}</td>
            <td data-addOne="${article._id}" class="w10 cursor-pointer text-center">+</td>
            <td class="pr-4 text-center w80">${article.nombre}</td>
            <td class="w10">$${article.precio * article.cantidad}</td>
            <td> <div class="text-red-700 font-bold text-1xl cursor-pointer" data-remove="${article._id}">X</div></td>
        `;
        listItems.appendChild(tr);
        
        const removeItem = document.querySelector(`div[data-remove="${article._id}"]`);
        removeItem.addEventListener('click', (e) => {
            let id = e.target.getAttribute('data-remove');
            filterProducts(arraySelected, id, 'renderFiltered')
        });

        const addOne = document.querySelector(`td[data-addOne="${article._id}"]`);
        addOne.addEventListener('click', (e) => {
            let id = e.target.getAttribute('data-addOne');
            filterProducts(arraySelected, id, 'addOne')
        });

        const removeOne = document.querySelector(`td[data-removeOne="${article._id}"]`);
        removeOne.addEventListener('click', (e) => {
            let id = e.target.getAttribute('data-removeOne');
            filterProducts(arraySelected, id, 'removeOne')
        });
    });
}
renderProducts(cart)  





/**


 if(document.getElementsByName(`btn${article._id}`)) {
                const currentArticle = Array.from(document.getElementsByName(`btn${article._id}`));
                currentArticle.map(btn => {
                    btn.addEventListener('click', (e) => {
                        if(e.target.getAttribute('data-addremove') === 'minus' && article.cantidad > 1) {
                            article.cantidad--;
                        } else if(e.target.getAttribute('data-addremove') === 'more') {
                            article.cantidad++;
                        } else if(e.target.getAttribute('data-addremove') === 'removeItem') {
                            cart = cart.filter(article => article._id !== e.target.id);
                        }
                    });
                });
            }


 */


function showAlert(message) {
    const p = document.querySelector('#alert');
    p.classList.add('alertSuccess');
    p.innerHTML = message;
    setTimeout(() => {
        p.classList.remove('alertSuccess');
        window.location.replace("http://127.0.0.1:5500/contacto.html");
    }, 4000);
}





if(inputWrong) {
    contactPage.value = 'Hay campos incompletos o erróneos :('
    contactPage.classList.add('bg-red-500', 'cursor-not-allowed')
    contactPage.classList.remove('bg-green-500')
} else {
    contactPage.value = 'Enviar consulta!'
    contactPage.classList.add('bg-green-500', 'cursor-pointer')
    contactPage.classList.remove('cursor-not-allowed')
    contactPage.addEventListener('click', () => {
        if(!inputWrong) {
            notifyContact(`${inputName} tu consulta ha sido enviada correctamente!`)
            contactPage.value = 'Hay campos incompletos o erróneos :('
            contactPage.classList.add('bg-red-500', 'cursor-not-allowed')
            contactPage.classList.remove('bg-green-500')
            document.querySelector('#formContact').reset();
        }
    });
}
