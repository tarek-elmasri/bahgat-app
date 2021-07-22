import { Order, PaymentMethod } from "../../entity/orders/Order";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../types";
import { OrderItem } from "../../entity/orders/OrderItem";
import { CartsItems } from "../../entity";

@InputType()
export class CreateOrderInput {
  @Field()
  phoneNo: number;

  @Field()
  city: string;

  @Field()
  address: string;

  @Field()
  street: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  comments?: string;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;
}

@Resolver()
export class CreateOrder {
  @Mutation(() => String)
  async createOrder(
    @Arg("input") input: CreateOrderInput,
    @Ctx() { req }: MyContext
  ) {
    const { cart } = req;
    // TODO input validation

    const fetchItem = async (cartItem: CartsItems) => {
      return OrderItem.create({
        quantity: cartItem.quantity,
        price: (await cartItem.item).price,
        name: (await cartItem.item).name,
        description: "descriped item",
      });
    };
    const orderTargetItems: OrderItem[] = await Promise.all(
      cart.cartItems.map((ci) => fetchItem(ci))
    );

    const order = await Order.create({
      ...input,
      orderItems: orderTargetItems,
    }).save();
    console.log(order.orderItems);
    console.log(orderTargetItems);
    if (cart.cartItems.length < 1) return "error";

    return "resolved";
    // const orderAttempt =  Order.create({
    //     ...input,
    //     //orderItems: [cartItems.formatToOrderItems()]
    //     userId: user ? user.id : undefined,

    //     // to calculate order total value
    //   })

    // const cartItems = await CartsItems.find({
    //   where: { cartId: req.session.cartId },
    // });
    // if (cartItems.length < 1) return "error";

    //format cartItems to match OrderItems value

    // add order items from cartId
    // calculate order total value

    // if order.paymentmethod === PaymentMethod.card --> request stripe.createPaymentIntent
    // client_secret
    // order.paymentIntentId save
    // return res = client secret , code : 'furthor_actions_required'

    //else return code: 'created successfully', order
  }
}
