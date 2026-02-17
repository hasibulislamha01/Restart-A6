/**
 * -----------------------------------------------------------
 * ------------------ DATA LOADER FUNCTIONS ------------------
 * -----------------------------------------------------------
 */

// let cart = []

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
                <div class="card-actions mt-3 flex items-center justify-evenly *:h-8 *:w-32">
                    
                    <button
        class="btn btn-outline text-gray-600 hover:text-black hover:scale-95 active:scale-90 transition-all duration-200"
        onclick="loadSpecificProduct(${product?.id})">
        <i class="fa-regular fa-eye"></i>
        Details
    </button>                    

                    <button class="btn bg-[rgb(var(--primary))] text-white hover:scale-95 active:scale-90 transition-all duration-200" onclick="()=>addToCart(${product})">ATC</button>
                </div>
            </div>
        </div>
    `
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
                    <div class="badge badge-soft badge-info">${product?.category}</div>
                    <div>
                        <i class="fa-solid fa-star" style="color: rgba(230, 178, 26, 1.00);"></i>
                        ${product?.rating?.rate} (${product?.rating?.count})
                    </div>
                </div>
                <h2 class="card-title">${prodName}</h2>
                <p>${description}</p>
                <div class="card-actions mt-3 flex items-center justify-evenly *:h-8 *:w-32">
                    
                    <button
        class="btn btn-outline text-gray-600 hover:text-black hover:scale-95 active:scale-90 transition-all duration-200"
        onclick="loadSpecificProduct(${product?.id})">
        <i class="fa-regular fa-eye"></i>
        Details
    </button>                    

                    <button class="btn bg-[rgb(var(--primary))] text-white hover:scale-95 active:scale-90 transition-all duration-200" onclick="()=>addToCart(${product})">ATC</button>
                </div>
            </div>
        </div>  
        `
        prodContainer?.append(prodCard)
    })
}

function addToCart(product) {
    cart.push(product)
}



loadCategories()
loadProducts()