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
    // es el array que va a ser utilizado segun interese
    let cart = []

    //verifico si existe el carrito en localstorage
    if(localStorage.getItem('carrito')) {
        cart = JSON.parse(localStorage.getItem('carrito'));
    }

    //a estos dos arrays van a parar los objetos segun hayan sido divididos en el map correspondiente
    articlesToys = [];
    articlesPharma = [];
    
    const articlesArray = data.response;
    const contactPage = document.querySelector('#submitContact');
    const vetePage = document.querySelector('#cardsVetContainer');
    const accesoriesPage = document.querySelector('#cardsAccContainer');
    const arraySelected = vetePage ? articlesPharma : articlesToys;
    const notyf = new Notyf();
    const popbox = new Popbox({
        blur:true,
        overlay:true,
    });
    
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
            <div class="rounded overflow-hidden shadow-md hover:shadow-lg flex flex-col justify-between">
                <div data-desc=${article._id} class="hidden containerImgName contCardInternal text-xs lg:text-sm p-4 pt-4 text-justify">
                    ${article.descripcion}
                </div>
                <div data-container=${article._id} class="containerImgName contCardInternal">
                    <div class="flex justify-center">
                        <div class="cardImgContainer">
                            <div class="cardImgContainer">
                                <div class="cardImage" id="img${article._id}"> </div>
                                </div>
                            </div>
                        </div>
                    <span data-stock="stock${article._id}" id="availability" class="${article.stock > 5 ? 'hidden' : 'p-1 text-gray-100 bg-red-600 text-sm font-semibold'}">Ultimas unidades!</span> </div>
                    <div class="sm:mt-20 border-t-2 mt-5">
                        <div class="articleName mt-5 md:mt-0 px-6 pt-2">
                            <div class="font-bold text-base">${article.nombre}</div>
                        </div>
                    </div>
                    <div class="px-6 pt-2 pb-2">
                        <div class="block">
                            <p data-id="${article._id}" class="px-1 py-2 italic block text-gray-700 cursor-pointer">Leer más</p>
                            <span class="inline-block bg-gray-200 rounded-full px-3 py-2 text-sm text-gray-700 mr-2 mb-2">#${article.tipo === 'Juguete' ? 'Accesorios' : 'Medicamentos'}</span>
                        </div>
                        <div class="flex justify-between items-center">
                        <div class="flex flex-row">
                            <button class="p-2 md:p-1 lg:p-2 bgPurple hover:bg-purple-700 text-sm text-white rounded font-semibold focus:outline-none" id="${article._id}">Agregar al carrito</button>
                        </div>
                        <div>
                            <span class="font-semibold colDarkestPurple text-lg items-center"> <b class="text-1xl md:text-2xl">$</b>${article.precio}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
            container.appendChild(div);

            document.getElementById(`img${article._id}`).style.backgroundImage = `url("${article.imagen}")`;
  
            const openDesc = document.querySelector(`p[data-id="${article._id}"]`);
            openDesc.addEventListener('click', () => {
                const description = document.querySelector(`div[data-desc="${article._id}"]`);
                const containerImgName = document.querySelector(`div[data-container="${article._id}"]`);
                if(description.classList.contains('hidden')) {
                    openDesc.innerText = 'Cerrar'
                    description.classList.remove('hidden')
                    containerImgName.classList.add('hidden')
                } else {
                    openDesc.innerText = 'Leer más'
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
        getTotal();
        popbox.open('mypopbox1');
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

    function getTotal() {
        let totalItems = 0
        let totalPurchase = 0;
        cart.map(article => {
            totalItems += article.cantidad
            totalPurchase += article.cantidad * article.precio
        });
        if(document.querySelector('#totalCart') && document.querySelector('#itemsInCart')) {
            document.querySelector('#totalCart').innerHTML = `$${totalPurchase}`;
            document.querySelector('#itemsInCart').innerHTML = totalItems;
        }
        
        const innerContainer = document.querySelector('#innerContainer');
        const buttonPurchase = document.createElement('button');

        if(totalItems > 0) {
            buttonPurchase.className = 'h-12 w-full mt-5 bgPurple rounded focus:outline-none transition ease-in-out duration-200 text-white hover:bg-purple-700'
            buttonPurchase.innerText = `${totalItems === 1  ? 'Finalizar compra (1 Articulo)' : `Finalizar compra (${totalItems} Articulos)`}`;
        } else {
            buttonPurchase.className = 'h-12 w-full mt-5 cursor-not-allowed text-gray-400 border-gray-300 border rounded focus:outline-none';
            buttonPurchase.innerText = 'El carrito esta vacio'
        }
        buttonPurchase.setAttribute('id', 'btnEndShopping');
        
        if(innerContainer && buttonPurchase) {
            innerContainer.removeChild(innerContainer.lastChild)
            innerContainer.appendChild(buttonPurchase)
            buttonPurchase.addEventListener('click', () => {
                if(totalItems > 0) {
                    cart = [];
                    renderCart();
                    popbox.close('mypopbox1');
                    notify('Muchas gracias por tu compra, esperamos disfrutes los articulos que elegiste!', 10000, 'success');
                }
            });
        }
    }

    function renderProducts(cart) {
        const listItems = document.querySelector('#listItems');
        if(listItems) {
            listItems.innerHTML = ''
            cart.map(article => {
                let div = document.createElement('div');
                div.innerHTML = `
                <div class="flex flex-col mt-6 pt-2">
                    <span class="text-xs md:mb-0 md:text-lg font-medium">${article.nombre}</span>
                    <span class="text-xs md:text-base font-light text-gray-700">Categoria #${article.tipo}</span>
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        <img src="${article.imagen}" width="75" class="rounded-full ">
                    </div>
                    <div class="flex justify-center items-center">
                        <div class="pr-4 flex wFixed100">
                            <span class="font-semibold mr-1 cursor-pointer" data-thisArticle="minus" name="btn${article._id}">-</span> 
                            <span type="text" class="focus:outline-none bg-gray-100 text-center cursor-default border h-6 w-8 rounded text-sm px-2 md:mx-2" data-quanty="${article._id}">${article.cantidad}</span>
                            <span class="font-semibold ml-1 cursor-pointer" data-thisArticle="more" name="btn${article._id}">+</span> 
                        </div>
                        <div class="flex wFixed100">
                            <span class="text-xs md:text-base ml-2 font-medium wFixed50 cursor-default">$${article.precio * article.cantidad}</span>
                            <div class="text-xs md:text-base ml-2 font-bold text-black cursor-pointer" data-remove="${article._id}">X</div> 
                        </div>
                        <div> <i class="fa fa-close text-xs font-medium"></i> </div>
                    </div>
                </div>
                `;
                listItems.appendChild(div);
        
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
        }
    } renderCart();
    
    function renderCart() {
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
                notify(`Tu consulta ha sido enviada correctamente!`, 8000, 'success')
                contactPage.value = 'Hay campos incompletos o erróneos :('
                contactPage.classList.add('bg-red-500', 'cursor-not-allowed')
                contactPage.classList.remove('bg-green-500')
                document.querySelector('#formContact').reset();
            }
        });
    }

    function notify(message, duration, type) {
        notyf.success({
            message: message,
            duration: duration,
            type: type,
            background: type === 'warning' ? 'orange' : ''
        });
    }

    const hamburguerMenu = document.querySelector('#openMobileNav');
    hamburguerMenu.addEventListener('click', () => {
        popbox.open('mypopbox2');
    })

}

