const catalog_html = document.getElementById("product_catalog")

async function productos_catalog() {
    try{
        const response = await fetch("http://localhost:3000/productos");
        const data = await response.json();
        const results = data;

        if (results) {
            let htmlResults = ""

            for (const element of results) {
                htmlResults += `
                    <div class="tarjeta">
                    <h3>${element.name_product}</h3>
                    <p>${element.price_product}</p>
                    <img src="${element.img}" alt="imagen">
                    </div>
                `;
            }

            catalog_html.innerHTML = htmlResults;

            }

    } catch (e){
        console.log("error: ", e)
    }
    
}

productos_catalog()