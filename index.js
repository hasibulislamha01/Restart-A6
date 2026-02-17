/**
 * -----------------------------------------------------------
 * ------------------ DATA LOADER FUNCTIONS ------------------
 * -----------------------------------------------------------
 */

let cart = []


function addToCart(product) {
    console.log("adding", product)
    const isExisting = cart?.find(item => item?.id === product?.id)
    if (isExisting) {
        isExisting.quantity += 1;
    } else {
        cart?.push({ quantity: 1, ...product })
    }

    // cart = [product, ...cart]
    console.log("Current Cart Content :", cart);
    console.log("Cart Length:", cart.length);
    displayCartLength(cart?.reduce((sum, curr) => sum + curr?.quantity, 0))
}

function incQuantity(id) {
    console.log("increasing", cart)
    const targetItem = cart?.find(item => item?.id === id)
    if (!targetItem) { return }
    targetItem.quantity += 1
    displayCartItems()
}

function decQuantity(id) {
    console.log("decreasing", cart)
    const targetItem = cart?.find(item => item?.id === id)
    if (!targetItem) { return }
    targetItem.quantity -= 1
    displayCartItems()
}

async function loadCategories() {
    try {
        const response = await fetch("https://fakestoreapi.com/products/categories")
        const data = await response.json()
        console.log("Categies fetched succesfully")
        displayCats(data)
    } catch (error) {
        console.log("Failed to load category data: ", error)
    }
}

async function loadTopRated() {
    const url = "https://fakestoreapi.com/products"
    try {
        const response = await fetch(url)
        const data = await response.json()

        const topRatedProducts = data?.filter(product => product?.rating?.rate > 4.5)
        const sortedTopRated = topRatedProducts?.sort((a, b) => b?.rating?.rate - a?.rating?.rate)
        const firstTopRated = sortedTopRated?.slice(0, 3)
        displayTopRated(firstTopRated)
    } catch (error) {
        console.log("Failed to load top Products", error)
    }
}

async function loadProducts(category = "all") {
    let url = "https://fakestoreapi.com/products"
    if (category !== "all") { url = `https://fakestoreapi.com/products/category/${category}` }
    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log("products fetched succesfully")
        displayProducts(data)
        loadTopRated()

    } catch (error) {
        console.log("Failed to load Products", error)
    }
}

async function loadSpecificProduct(id) {
    if (!id) { return }
    let url = `https://fakestoreapi.com/products/${id}`
    try {
        const res = await fetch(url)
        const data = await res.json()
        console.log("Success: ", data)
        displayModal(data)
    } catch (error) {
        console.error("Failed to load specific product with id", id)
    }
}

// Documents selection using js
const catContainer = document.getElementById("catContainer")
const prodContainer = document.getElementById("prodContainer")
const topRatedContainer = document.getElementById("topRatedContainer")


/**
 * -----------------------------------------------------------
 * ---------DATA >>>>   DISPLAYER   <<< FUNCTIONS ------------
 * -----------------------------------------------------------
 */
function displayTopRated(topRatedProducts) {
    topRatedContainer.innerHTML = ""
    console.log(topRatedProducts, topRatedContainer)
    topRatedProducts?.forEach(product => {
        const prodName = product?.title?.length > 25 ? `${product?.title?.slice(0, 25)} . . .` : product?.title
        const description = product?.description?.length > 100 ? `${product?.description?.slice(0, 100)} ....` : product?.description
        const topRatedCard = document?.createElement("div")
        topRatedCard.innerHTML = `
    <div class="card bg-base-100 w-80 shadow-sm">
            <figure>
                <img
                src=${product?.image}
                alt=${product?.title}
                class="px-4 pt-6 w-60 h-60 object-contain" 
                />
            </figure>
            <div class="card-body">
                <div class="flex items-center justify-between">
                    <div class="badge badge-soft badge-info">${product?.category}</div>
                    <div>
                        <i class="fa-solid fa-star" style="color: rgba(230, 178, 26, 1.00);"></i>
                        ${product?.rating?.rate} (${product?.rating?.count})
                    </div>
                </div>
                <h2 class="card-title">${prodName}</h2>
                <p>${description}</p>
                <div id="prodCard_${product?.id}" class="card-actions mt-3 flex items-center justify-evenly *:h-8 *:w-32">
                    
                    <button
                        class="btn btn-outline text-gray-600 hover:text-black hover:scale-95 active:scale-90 transition-all duration-200"
                        onclick="loadSpecificProduct(${product?.id})">
                        <i class="fa-regular fa-eye"></i>
                        Details
                    </button>                    

                </div>
            </div>
        </div>
    `
        const addToCartButton = document.createElement("button")
        addToCartButton.className = "btn bg-[rgb(var(--primary))] text-white hover:scale-95 active:scale-90 transition-all duration-200"
        addToCartButton.innerText = "Add to cart"
        addToCartButton.onclick = () => addToCart(product)
        topRatedCard.querySelector(`#prodCard_${product?.id}`).append(addToCartButton)

        topRatedContainer?.append(topRatedCard)
    })


}

function displayCats(cats) {
    catContainer.innerHTML = ""
    const categories = ["all", ...cats]
    cats?.length && categories?.forEach(cat => {
        const catBadge = document.createElement("div")
        catBadge.innerText = cat
        catBadge.classList.add(
            "px-6",
            "py-1",
            "border",
            "border-black",
            "rounded-full",
            "font-semibold"
        )
        catBadge.onclick = () => loadProducts(cat)
        catContainer.append(catBadge)
    });
}

const displayModal = (product) => {
    console.log("found product with id ", product)
    const detailsBox = document.getElementById("detailsContainer")
    detailsBox.innerHTML = `
    <div class="space-y-3">
        <div
                    class="px-5 flex flex-col md:flex-row items-center justify-evenly gap-4">
                    <div class="flex flex-col justify-between gap-5">
                        <img class="flex-1 object-cover max-w-40 rounded-md"
                            src=${product?.image} />
                        <button class="btn btn-xs sm:btn-sm btn-primary">Add to cart</button>
                    </div>

                    <div class="h-full flex flex-col justify-between gap-3">

                        <div class="badge badge-soft badge-primary">${product?.category}</div>
                        <div class="space-y-2">
                            <h1 class="text-lg font-bold">${product?.title}</h1>

                            <div class="flex items-center gap-3">
                                <div class="rating rating-xs">
                                    <div class="mask mask-star bg-orange-500" name="rating-2" aria-label="1 star"></div>
                                    <div class="mask mask-star bg-orange-500" name="rating-2" aria-label="2 star"></div>
                                    <div class="mask mask-star bg-orange-500" name="rating-2" aria-label="3 star"
                                        aria-current="true"></div>
                                    <div class="mask mask-star bg-orange-500" name="rating-2" aria-label="4 star"></div>
                                    <div class="mask mask-star bg-orange-500" name="rating-5" aria-label="5 star"></div>
                                </div>
                                <p>${product?.rating?.count}</p>
                            </div>
                            <h3 class="text-3xl font-bold">$${product?.price}</h3>
                        </div>


                        <!-- <h3>Rating: 4.7</h3> -->
                    </div>
                </div>
                <p>${product?.description}</p>
    </div>
    `
    document.getElementById("my_modal_5").showModal()
}

function displayProducts(products) {
    console.log("wow", products)
    prodContainer.innerHTML = ""
    products?.forEach(product => {
        const prodName = product?.title?.length > 25 ? `${product?.title?.slice(0, 25)} . . .` : product?.title
        const description = product?.description?.length > 100 ? `${product?.description?.slice(0, 100)} ....` : product?.description

        const prodCard = document.createElement("div")
        prodCard.innerHTML = `
        <div class="card bg-base-100 w-80 shadow-sm">
            <figure>
                <img
                src=${product?.image}
                alt=${product?.title}
                class="px-4 pt-6 w-60 h-60 object-contain" 
                />
            </figure>
            <div class="card-body">
                <div class="flex items-center justify-between">
                    <div class="badge badge-soft badge-primary">${product?.category}</div>
                    <div>
                        <i class="fa-solid fa-star" style="color: rgba(230, 178, 26, 1.00);"></i>
                        ${product?.rating?.rate} (${product?.rating?.count})
                    </div>
                </div>
                <h2 class="card-title">${prodName}</h2>
                <p>${description}</p>
                <div id="prodCard_${product?.id}" class="card-actions mt-3 flex items-center justify-evenly *:h-8 *:w-32">
                    
                    <button
                        class="btn btn-outline text-gray-600 hover:text-black hover:scale-95 active:scale-90 transition-all duration-200"
                        onclick="loadSpecificProduct(${product?.id})">
                        <i class="fa-regular fa-eye"></i>
                        Details
                    </button>                    
                </div>
            </div>
        </div>  
        `
        const addToCartButton = document.createElement("button")
        addToCartButton.className = "btn bg-[rgb(var(--primary))] text-white hover:scale-95 active:scale-90 transition-all duration-200"
        addToCartButton.innerText = "Add to cart"
        addToCartButton.onclick = () => addToCart(product)
        prodCard.querySelector(`#prodCard_${product?.id}`).append(addToCartButton)

        prodContainer?.append(prodCard)
    })
}

function displayCartLength(length) {
    const cartBadge = document.querySelectorAll("#cart")
    cartBadge?.forEach(badge => {
        badge.innerHTML = ""
        badge.innerText = length
    })
}
function displayCartItems() {
    const cartItemsContainer = document.getElementById("cartItems")
    cartItemsContainer.innerHTML = ""
    cart?.forEach(item => {
        const cartCard = document?.createElement("div")
        cartCard.innerHTML = `
                <div class="card card-side bg-base-100 shadow-sm">
                    <figure class="px-3">
                        <img src=${item.image} class="h-24 w-24 rounded-md object-contain" alt="Movie" />
                    </figure>
                    <div class="card-body flex flex-row items-center justify-between">
                        <div class="space-y-2">
                            <h2 class="text-base font-semibold">${item.title}</h2>
                            <div class="flex items-center">
                                <button class="btn btn-xs" onclick="decQuantity(${item?.id})">-</button>
                                <div id="qIndicator" class="badge badge-soft badge-primary">Quantity: ${item?.quantity}</div>
                                <button class="btn btn-xs" onclick="incQuantity(${item?.id})">+</button>
                            </div>
                        </div>
                        <i class="fa-regular fa-trash-can" style="color: rgba(87, 82, 99, 1.00);"></i>
                    </div>
                </div>
        `
        cartItemsContainer.append(cartCard)
    })
    my_modal.showModal()
}


loadCategories()
loadProducts()