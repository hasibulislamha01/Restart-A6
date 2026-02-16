// data loaders
let currentCategory = "all"

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

async function loadProducts(category = "all") {
    let url = "https://fakestoreapi.com/products"
    if (category !== "all") { url = `https://fakestoreapi.com/products/category/${category}` }
    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log("products fetched succesfully")
        displayProducts(data)
    } catch (error) {
        console.log("Failed to load Products", error)
    }
}



const catContainer = document.getElementById("catContainer")
const prodContainer = document.getElementById("prodContainer")


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
                    
                    
                    <!-- Open the modal using ID.showModal() method -->
                        <button class="btn btn-outline text-gray-600 hover:text-black hover:scale-95 active:scale-90 transition-all duration-200" onclick="my_modal_2.showModal()">
                            <i class="fa-regular fa-eye";"></i>
                            Details
                        </button>
                        <dialog id="my_modal_2" class="modal">
                        <div class="modal-box">
                            <h3 class="text-lg font-bold">Hello!</h3>
                            <p class="py-4">Press ESC key or click outside to close</p>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                            <button>close</button>
                        </form>
                        </dialog>

                    <button class="btn bg-[rgb(var(--primary))] text-white hover:scale-95 active:scale-90 transition-all duration-200">ATC</button>
                </div>
            </div>
        </div>  
        `
        prodContainer?.append(prodCard)
    })
}

loadCategories()
loadProducts()