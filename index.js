class Order {
    constructor(name) {
        this.name = name;
        this.bottles = [];
    }

    addBottle(color, quantity) {
        this.bottles.push(new Bottle(color, quantity));
    }
}

class Bottle {
    constructor(color, quantity) {
        this.color = color;
        this.quantity = quantity;
    }
}

// Interact with API
class OrderService {
    static url = 'https://630105c89a1035c7f8fc9ddd.mockapi.io/api/orders';

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

    static createOrder(name) {
        OrderService.createOrder(new Order(name))
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

    static addBottle(id) {
        for (let order of this.orders) {
            if(order._id == id) {
                order.bottles.push(new Bottle($(`#${order._id}-bottle-color`).val(), $(`#${order._id}-bottle-quantity`).val()));
                OrderService.updateOrder(order)
                    .then(() => {
                        return OrderService.getAllOrders()
                    })
                    .then((orders) => this.render(orders));
                    }
                }
            }

    static deleteBottle(orderId, bottleId) {
        for (let order of this.orders) {
            if (order._id == orderId) {
                for (let bottle of order.bottles) {
                    if (bottle._id == bottleId) {
                        order.bottles.splice(order.bottles.indexOf(bottle), 1);
                        OrderService.updateOrder(order)
                            .then(() => {
                                return OrderService.getAllOrders();
                            })
                            .then((orders) => this.render(orders));
                    }
                }
            }
        }
    }

    static render(orders) {
        this.orders = orders;
        $('#inventory').empty();
        for(let order of orders) {
            $('#inventory').append(
                `<div id="${order._id}" class="card">
                    <div class="card-header">
                        <h4>${order.name}</h4>
                        <button class="btn btn-warning" onclick="DOMManager.deleteOrder('${order._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${order._id}-bottle-color" class="form-control" placeholder="Bottle Color">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${order._id}-bottle-quantity" class="form-control" placeholder="Quantity">
                                </div>
                            </div>
                            <button id="${order._id}-new-bottle" onclick="DOMManager.addBottle('${order._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let bottle of order.bottles) {
                $(`#${order._id}`).find('.card-body').prepend(
                    `<p>
                        <span id="color-${bottle._id}"><strong>Color: </strong> ${bottle.color}</span>
                        <span id="quantity-${bottle._id}"><strong>Quantity: </strong> ${bottle.quantity}</span>
                        <button class="btn btn-warning" onclick="DOMManager.deleteBottle('${order._id}', '${bottle._id}')">
                        Delete Bottle</button>`
                );
            }
        }
    }
}

$('#create-new-order').click(() => {
    DOMManager.createOrder($('#new-order-name').val());
    $('#new-order-name').val('');
});

DOMManager.getAllOrders();