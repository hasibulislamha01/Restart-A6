// data loaders
async function loadCategories() {
    try {
        const response = await fetch("https://fakestoreapi.com/products/categories")
        const data = await response.json()
        console.log("Categies fetched succesfully")
        displayCats(data)
        // return data
    } catch (error) {
        console.log("Failed to load category data: ", error)
    }
}

async function loadProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products")
        const data = await response.json()
        console.log("products fetched succesfully")
        displayProducts(data)
        // return data
    } catch (error) {
        console.log("Failed to load Products", error)
    }
}



// data
// const categories = await loadCategories().then(data => displayCats(data))
// const products = await loadProducts()

// console.log(categories)
// console.log(products)


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
    <h2 class="card-title">${prodName}</h2>
    <p>${description}</p>
    <div class="card-actions flex items-center justify-evenly">
      <button class="btn btn-primary">Details</button>
      <button class="btn btn-primary">ATC</button>
    </div>
  </div>
</div>
        `
        prodContainer?.append(prodCard)
    })
}

loadCategories()
loadProducts()