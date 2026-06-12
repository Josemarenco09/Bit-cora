const catalog_html = document.getElementById("product_catalog")

async function productos_catalog() {
    try {
    const response = await fetch("http://localhost:3000/productos");
    const data = await response.json();

    if (data) {
        let htmlResults = '<div class="row g-4">';

        for (const element of data) {
            htmlResults += `
                <div class="col-4">
                    <div class="box_product_html">
                        <h3>${element.name_product}</h3>
                        <p> $${element.price_product}</p>
                        <img class="img_product_html" src="${element.img}" alt="imagen">
                    </div>
                </div>
                `;
            }

        htmlResults += '</div>';
        catalog_html.innerHTML = htmlResults;
        }

    } catch (e) {
    console.log("error: ", e);
    }
}

productos_catalog()