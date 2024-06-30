import { useRef, useContext } from "react";

import CartModal from "./CartModal.jsx";
import { CartContext } from "../store/shopping-cart-context.jsx";

export default function Header() {
  const modal = useRef(); // 使用 useRef 引用 CartModal 组件
  const { items } = useContext(CartContext); // 从购物车上下文中获取 items，表示购物车中的商品

  const cartQuantity = items.length; // 计算购物车中商品的数量

  function handleOpenCartClick() {
    modal.current.open(); // 调用 CartModal 组件的 open 方法，打开模态框
  }

  let modalActions = <button>Close</button>; // 默认的模态框操作按钮

  if (cartQuantity > 0) {
    modalActions = (
      <>
        <button>Close</button>
        <button>Checkout</button>
      </>
    );
  }

  return (
    <>
      <CartModal ref={modal} title="Your Cart" actions={modalActions} />
      <header id="main-header">
        <div id="main-title">
          <img src="logo.png" alt="Elegant model" />
          <h1>Elegant Context</h1>
        </div>
        <p>
          <button onClick={handleOpenCartClick}>Cart ({cartQuantity})</button>
        </p>
      </header>
    </>
  );
}
