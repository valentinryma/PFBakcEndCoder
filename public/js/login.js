initLogin();

function initLogin() {
    if (!(actionContainer = document.querySelector("[data-action-container]"))) {
        return;
    }

    if (actionContainer.hasAttribute("data-initialize")) {
        return;
    }

    if (!(actionForm = document.querySelector("[data-action-form]"))) {
        return;
    }

    actionContainer.addEventListener(
        "click",
        (event) => {
            buy(actionContainer, actionForm, event.target);
        }
    )

    actionContainer.setAttribute("data-initialize", "");
}

function redirectTo(form, route) {
    form.action = route;

    form.method = "GET";

    return form.submit();
}