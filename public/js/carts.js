const removeBtn = document.querySelectorAll('.btn-remove');
const checkoutBtn = document.getElementById('btn-checkout');
const cid = document.getElementById('cid').innerText;
let pid = '';

// Obtenemos el ID del producto que queremos eliminar.
for (const btn of removeBtn) {
    btn.addEventListener("click", function () {
        pid = this.id;
        removeProductCart(cid, pid);
    });
}

checkoutBtn.addEventListener('click', function () {
    purchaseCart(cid);
});


function purchaseCart(cid) {
    $.ajax(`/api/carts/${cid}/purchase`, {
        dataType: 'json',
        method: 'POST',
        success: function (res) {
            console.log(res);
            alert('Compra realizada!');
            window.location.reload();
        }
    })
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
