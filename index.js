// Create order class
class Order {
    constructor(name, color, quantity) {
        this.name = name;
        this.color = color;
        this.quantity = quantity;
    }
}

// Interact with API
class OrderService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';

    static getAllOrders() {
        return $.get(this.url);
    }

    static getOrder(id) {
        return $.get(this.url + `/${id}`);
    }

    static createOrder(order) {
        return $.post(this.url, order);
    }

    static updateOrder(order) {
        return $.ajax({
            url: this.url + `/${order._id}`,
            dataType: 'json',
            data: JSON.stringify(order),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteOrder(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

// Create, read, update, delete from DOM
class DOMManager {
    static orders;

    static getAllOrders() {
        OrderService.getAllOrders().then(orders => this.render(orders));
    }

    static createOrder(name, color, quantity) {
        OrderService.createOrder(new Order(name, color, quantity))
            .then(() => {
                return OrderService.getAllOrders();
            })
            .then((orders) => this.render(orders));
    }

    static deleteOrder(id) {
        OrderService.deleteOrder(id)
        .then(() => {
            return OrderService.getAllOrders();
        })
        .then((orders) => this.render(orders));
    }

    static render(orders) {
        this.orders = orders;
        $('#orders-list').empty();
        for(let order of orders) {
            $('#orders-list').prepend(
                `<div id="${order._id}" class="card">
                    <div class="card-header">
                        <h4>${order.name}</h4>
                        <p>Color: ${order.color}, Quantity: ${order.quantity}</p>
                        <button class="btn btn-warning" onclick="DOMManager.deleteOrder('${order._id}')">Delete</button>
                    </div>                
                </div><br>`
            );
        }
    }
}

$('#create-new-order').click(() => {
    DOMManager.createOrder($('#new-order-name').val(), $('#new-bottle-color').val(), $('#new-bottle-quantity').val());
// Clear input boxes
    $('#new-order-name').val('');
    $('#new-bottle-color').val('');
    $('#new-bottle-quantity').val('');
});

DOMManager.getAllOrders();