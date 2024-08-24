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
    );

    component.setAttribute("data-initialize", "");
}

function buy(event, component) {
    if (!(buyBtn = event.target.closest("button[data-action]"))) {
        return
    }

    if (buyBtn.getAttribute("data-action") === "login") {
        return launchLoginModal();
    }

    addProductInCart(
        buyBtn.getAttribute('data-product-id'),
        buyBtn.getAttribute('data-cart-id'),
        component.getAttribute('data-url')
    )
}

// Crea un formulario de manera dinamica para realizar una redirección
async function launchLoginModal(form, route) {
    // console.log(form);
    // form.action = route;
    // form.method = "GET";
    // return form.submit();

    const inputsForm = await Swal.fire({
        title: "Sig in",
        html: `
          <input id="email" class="swal2-input">
          <input id="password" class="swal2-input">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };
        }
    });
    if (inputsForm) {
        Swal.fire(JSON.stringify(inputsForm));
    }
}

function addProductInCart(productId, cartId, url) {
    console.log('Verificnado URL, en addProductInCart');

    Swal.fire(
        {
            title: 'Are you sure you want to make the purchase?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "Proceed to checkout",
        }
    ).then((result) => {
        if (result.isDismissed) {
            return;
        }

        $.ajax(
            `${url}/${cartId}/product/${productId}`,
            {
                dataType: 'json',
                method: 'POST'
            }
        );

        return Swal.fire({
            title: 'Added to cart',
            icon: 'success',
            showConfirmButton: false,
            timer: 1050
        });
    });
}