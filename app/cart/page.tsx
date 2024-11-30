"use client";

import CartOrderDisplay from "@/components/cart-orders";
import { CartOrder } from "@/constants/type";
import { createClient } from "@/supabase/clients/createClient";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState<CartOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: cart, error } = await supabase
        .from("cart_orders")
        .select(
          `
          id,
          user_id,
          quantity,
          variant_id,
          merchandises(id, name, online_payment, physical_payment, receiving_information, variant_name, merchandise_pictures(picture_url), variants(id, name, picture_url, original_price, membership_price)),
          shops(id, acronym)
        `,
        )
        .eq("user_id", user?.id)
        .returns<CartOrder[]>();
      setCart(cart?.sort() ?? []);
    };
    getData();
  }, []);

  const handleCheckboxChange = (orderId: string) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      }
      return [...prev, orderId];
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold text-emerald-800">My Shopping Cart</h1>

      <form className="w-full max-w-3xl space-y-4">
        {cart ? (
          cart.map((item) => (
            <CartOrderDisplay
              key={item.id}
              order={item}
              selectedOrders={selectedOrders}
              handleCheckboxChange={handleCheckboxChange}
              setCart={setCart}
            />
          ))
        ) : (
          <div>No cart orders found!</div>
        )}
      </form>
    </div>
  );
};

export default Cart;