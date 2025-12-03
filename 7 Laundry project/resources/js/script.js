document.addEventListener("DOMContentLoaded", () => {

    emailjs.init("jXBcSzItd8pD0PYCa");

    const cartItems = document.getElementById("cart-items");
    const totalText = document.getElementById("total-amount");
    const serviceList = document.querySelector(".service-items");
    const bookingForm = document.getElementById("booking-form");
    const msg = document.getElementById("confirmation-message");

    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value
        .replace(/\D/g, "")      
        .substring(0, 10);       
        });
     

    const nameInput = document.getElementById("full-name");
    nameInput.addEventListener("input", () => {
    let value = nameInput.value;
    value = value.replace(/[^A-Za-z ]/g, "");
    value = value.replace(/\s+/g, " ");
    value = value.replace(/^\s/, "");
    nameInput.value = value;
    });

    let cart = {};
    serviceList.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const li = btn.closest("li");
        const name = li.dataset.name;
        const price = parseFloat(li.dataset.price);
        if (btn.classList.contains("btn-add")) {
            cart[name] = { name, price };
            btn.textContent = "Remove Item";
            btn.classList.replace("btn-add", "btn-remove");
        } else {
            delete cart[name];
            btn.textContent = "Add Item";
            btn.classList.replace("btn-remove", "btn-add");
        }
        updateCart();
    });
    function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;
        let count = 1;
        const keys = Object.keys(cart);
        if (keys.length === 0) {
            cartItems.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center; color:#888;">No items added</td>
                </tr>`;
        } else {
            keys.forEach(key => {
                const { name, price } = cart[key];
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${count}</td>
                    <td>${name}</td>
                    <td>₹${price.toFixed(2)}</td>
                `;
                cartItems.appendChild(row);
                total += price;
                count++;
            });
        }
        totalText.textContent = `₹${total.toFixed(2)}`;
    }
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = bookingForm.querySelector(".btn-book-now");
        btn.textContent = "Booking...";
        btn.disabled = true;
        let details = "";
        let total = 0;
        let count = 1;

        for (const key in cart) {
            const item = cart[key];
            details += `${count}. ${item.name} - ₹${item.price}\n`;
            total += item.price;
            count++;
        }

        if (Object.keys(cart).length === 0) {
        alert("Please add at least one service before booking.");
        return;
    }
        const data = {
            from_name: document.getElementById("full-name").value,
            from_email: document.getElementById("email").value,
            phone_number: document.getElementById("phone").value,
            cart_details: details,
            total_amount: `₹${total.toFixed(2)}`
        };
        emailjs.send("service_u4fkyok", "template_gy17rvl", data)
            .then(() => {
                msg.textContent = "Thank you for booking! We'll contact you soon.";
                msg.style.display = "block";
                bookingForm.reset();
                cart = {};
                document.querySelectorAll(".btn-remove").forEach(b => {
                    b.textContent = "Add Item";
                    b.classList.replace("btn-remove", "btn-add");
                });
                updateCart();
                setTimeout(() => msg.style.display = "none", 6000);
            })
            .catch(() => {
                alert("Something went wrong. Please try again.");
            })
            .finally(() => {
                btn.textContent = "Book now";
                btn.disabled = false;
            });
    });
    updateCart();
});
