const removeBtn = document.querySelectorAll('.btn-remove');
const cid = document.getElementById('cid').innerText;
let pid = '';

// Obtenemos el ID del producto que queremos eliminar.
for (const btn of removeBtn) {
    btn.addEventListener("click", function () {
        pid = this.id;
        removeProductCart(cid, pid);
    });
}

function removeProductCart(cid, pid) {
    $.ajax(`/api/carts/${cid}/product/${pid}`, {
        dataType: 'json',
        method: 'DELETE',
        success: function () {
            // eliminar el elemento <li> con el user
            $(`#cart-item-${pid}`).remove()
            window.location.reload(); // Actualiza el monto total (reacarga la pag)
        }
    })
}

const calcTotal = async (cid) => {
    let total = 0;

    for (const product of cart) {
        total += product._id.price * product.quantity;
    }
    return total.toLocaleString()
}

// const total = calcTotal(cart.products);