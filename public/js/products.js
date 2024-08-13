initProducts();

function initProducts() {
    if (!(component = document.querySelector("[data-component]"))) {
        return;
    }

    if (component.hasAttribute("data-initialize")) {
        return;
    }

    component.addEventListener(
        "click",
        (event) => {
            buy(event, component);
        }
    )

    component.setAttribute("data-initialize", "");
}

function buy(event, component) {
    if (!(buyBtn = event.target.closest("button[data-action]"))) {
        return
    }

    if (buyBtn.getAttribute("data-action") === "login") {
        return redirectTo(component, "/login");
    }

    const url = component.getAttribute('data-url');

    const cid = buyBtn.getAttribute('data-cart-id');

    const pid = buyBtn.getAttribute('data-product-id');

    addProductInCart(cid, pid, url)
}

function redirectTo(form, route) {
    form.action = route;

    form.method = "GET";

    return form.submit();
}

function addProductInCart(cartId, productId, url) {
    Swal.fire({
        title: 'Product add in cart!',
        text: 'Thank you for your purchase!',
        icon: 'success',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax(
                `${url}/${cartId}/product/${productId}`,
                {
                    dataType: 'json',
                    method: 'POST'
                }
            );
        }
    });
}