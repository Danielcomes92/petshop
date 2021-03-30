const url = 'https://apipetshop.herokuapp.com/api/articulos';

async function getArticles(url) {
    try {
        await fetch(url)
        .then(res => res.json())
        .then(data => App(data))
    } catch (error) {
        console.log(error)
    }
} getArticles(url)

function App(data) {
    let cart = []
    if(localStorage.getItem('carrito')) {
        cart = JSON.parse(localStorage.getItem('carrito'));
    }

    articlesToys = [];
    articlesPharma = [];

    const contactPage = document.querySelector('#submitContact');
    const vetePage = document.querySelector('#cardsVetContainer');
    const accesoriesPage = document.querySelector('#cardsAccContainer');
    const arraySelected = vetePage ? articlesPharma : articlesToys;
    const btnEndShopping = document.querySelector('#buy');

    const articlesArray = data.response;
        
    
    articlesArray.map(article => {
        if(article.tipo === 'Juguete') {
            articlesToys.push(article)
        } else if(article.tipo === 'Medicamento') {
            articlesPharma.push(article)
        }
    });

    function insertProducts(array, container) {
        array.map(article => {
            let div = document.createElement('div')
            div.innerHTML = `
            <div class="rounded overflow-hidden shadow-lg hover:shadow-xl flex flex-col justify-between">
                <div data-desc=${article._id} class="hidden containerImgName contCardInternal text-sm p-4 pt-6 text-justify">
                    ${article.descripcion}
                </div>
                <div data-container=${article._id} class="containerImgName contCardInternal">
                    <div class="flex justify-center">
                        <div class="relative">
                            <div class="flex justify-center pt-12">
                                <img class="uno" src="${article.imagen}" alt="Foto producto de veterinaria ${article.tipo}">
                            </div>
                            <span data-stock="stock${article._id}" id="availability" class="${article.stock > 5 ? 'hidden' : 'absolute top-0 right-0 p-1 bg-red-700 text-white text-sm font-semibold'}">Ultimas unidades!</span> </div>
                        </div>
                    </div>
                    <div class="mt-20 flex justify-around border-t-2">
                        <div class="articleName mt-5 md:mt-0 px-6 pt-2">
                            <div class="font-bold text-base">${article.nombre}</div>
                        </div>
                    </div>
                    <div class="px-6 pt-2 pb-2">
                        <div class="block">
                            <p data-id="${article._id}" class="px-1 py-2 italic block text-blue-700 cursor-pointer">Leer Descripción</p>
                            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#${article.tipo}</span>
                        </div>
                        <svg id="${article._id}" class="w-8 h-8 inline-block cursor-pointer" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span class="font-bold text-sm">$${article.precio}</span>
                    </div>
                </div>
            </div>
            `;           
            container.appendChild(div); 
  
            const openDesc = document.querySelector(`p[data-id="${article._id}"]`);
            openDesc.addEventListener('click', () => {
                const description = document.querySelector(`div[data-desc="${article._id}"]`);
                const containerImgName = document.querySelector(`div[data-container="${article._id}"]`);
                if(description.classList.contains('hidden')) {
                    description.classList.remove('hidden')
                    containerImgName.classList.add('hidden')
                } else {
                    description.classList.add('hidden')
                    containerImgName.classList.remove('hidden')
                }                
            });

            const addProduct = document.getElementById(article._id);
            addProduct.addEventListener('click', (e) => {
                articlesCart(arraySelected, e.target.id, 'render')
            });
        });
    }

    if(vetePage) {
        insertProducts(articlesPharma, cardsVetContainer)
    } if(accesoriesPage) {
        insertProducts(articlesToys, cardsAccContainer)
    }

    document.querySelector('#cart').addEventListener('click', () => {
        checkCartLength();
        getTotal();
        const cartContainer = document.querySelector('#cartContainer')
         if(cartContainer.classList.contains('hidden')) {
            cartContainer.classList.remove('hidden')
         } else {
            cartContainer.classList.add('hidden')
         }

     })

    function articlesCart(array, id, action) {
        if(action === 'render') {
            array.map(article => {
                if(article._id === ((id).toString())) {
                    if(cart.indexOf(article) === -1) {
                        article.cantidad = 1;
                        cart.push(article)
                        notify('Articulo agregado', 2000, 'success')
                    } else {
                        notify('Este articulo ya esta en el carrito', 2000, 'error')
                    }
                }
            });
        }
        if(action === 'renderFiltered') {
            cart = cart.filter(article => article._id !== ((id).toString()))
            notify('Articulo eliminado', 2000, 'warning')
        }
        renderCart()
    }

    const tHeadElements = document.querySelector('#tHead');
    function checkCartLength() {
        if(cart.length > 0) {
            tHeadElements.classList.remove('hidden')
        } else {
            tHeadElements.classList.add('hidden')
        }
    }

    function getTotal() {
        let totalItems = 0
        let totalPurchase = 0;
        cart.map(article => {
            totalItems += article.cantidad
            totalPurchase += article.cantidad * article.precio
        });
        btnEndShopping.innerHTML = `${totalItems > 0 ? `Finalizar compra: (${totalItems} prod.  $${totalPurchase})` : 'El carrito esta vacio' }`;
        document.querySelector('#itemsInCart').innerHTML = totalItems;
    }

    function renderProducts(cart) {
        const listItems = document.querySelector('#listItems');
        listItems.innerHTML = ''
        cart.map(article => {
            const tr = document.createElement('tr');
            tr.classList.add('py-2')
            tr.innerHTML = `
                <td data-thisArticle="minus" name="btn${article._id}" class="w10 cursor-pointer text-center">-</td>
                <td data-quanty="${article._id}" class="w10 text-center">${article.cantidad}</td>
                <td data-thisArticle="more" name="btn${article._id}" class="w10 cursor-pointer text-center">+</td>
                <td class="pr-4 text-center w80">${article.nombre}</td>
                <td class="w10">$${article.precio * article.cantidad}</td>
                <td> <div class="text-red-700 font-bold text-1xl cursor-pointer" data-remove="${article._id}">X</div></td>
            `;
            listItems.appendChild(tr);
    
            if(document.getElementsByName(`btn${article._id}`)) {
                const currentArticle = Array.from(document.getElementsByName(`btn${article._id}`));
                currentArticle.map(btn => {
                    btn.addEventListener('click', (e) => {
                        if(e.target.getAttribute('data-thisArticle') === 'minus' && article.cantidad > 1) {
                            article.cantidad--;
                        } else if(e.target.getAttribute('data-thisArticle') === 'more') {
                            article.cantidad++;
                        }
                        renderCart();
                    });
                });
            }

            const removeItem = document.querySelector(`div[data-remove="${article._id}"]`);
            removeItem.addEventListener('click', (e) => {
                let id = e.target.getAttribute('data-remove');
                articlesCart(arraySelected, id, 'renderFiltered')
            });
        });
    } renderCart();
    

    function renderCart() {
        checkCartLength();
        getTotal();
        renderProducts(cart);
        localStorage.setItem('carrito', JSON.stringify(cart));
    }
    
    
    if(contactPage) {
        document.querySelector('#formContact').addEventListener('keyup', () => {
            const inputName = document.querySelector('#nameForm').value;
            const inputEmail = document.querySelector('#emailForm').value;
            const checkboxChecked = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
            const messageTextarea = document.querySelector('#messageContent').value;
            const inputWrong = (Array.from(inputName)).some(Number) || inputName === '' || inputEmail === '' || checkboxChecked.length <= 0 || messageTextarea.length === 0;
            
            if(inputWrong) {
                contactPage.value = 'Hay campos incompletos o erróneos :('
                contactPage.classList.add('bg-red-500', 'cursor-not-allowed')
                contactPage.classList.remove('bg-green-500')
            } else {
                contactPage.value = 'Enviar consulta!'
                contactPage.classList.add('bg-green-500', 'cursor-pointer')
                contactPage.classList.remove('cursor-not-allowed')
            }
        });
        
        contactPage.addEventListener('click', () => {
            const inputName = document.querySelector('#nameForm').value;
            const inputEmail = document.querySelector('#emailForm').value;
            const checkboxChecked = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
            const messageTextarea = document.querySelector('#messageContent').value;
            const inputWrong = (Array.from(inputName)).some(Number) || inputName === '' || inputEmail === '' || checkboxChecked.length <= 0 || messageTextarea.length === 0;
            if(!inputWrong) {
                notify(`Tu consulta ha sido enviada correctamente!`, 2000, 'success')
                contactPage.value = 'Hay campos incompletos o erróneos :('
                contactPage.classList.add('bg-red-500', 'cursor-not-allowed')
                contactPage.classList.remove('bg-green-500')
                document.querySelector('#formContact').reset();
            }
        });
    }
    

    let notyf = new Notyf();
    function notify(message, duration, type) {
        notyf.success({
            message: message,
            duration: duration,
            type: type,
            background: type === 'warning' ? 'orange' : ''
        });
    }
    

    btnEndShopping.addEventListener('click', endShopping);
    function endShopping() {
        if(cart.length > 0) {
            cart = [];
            renderCart();
            notify('Muchas gracias por tu compra, esperamos disfrutes los articulos que elegiste!', 6000, 'success');
        }
    }

}


console.log('hola')







