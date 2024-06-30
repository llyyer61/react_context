import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import Cart from "./Cart";

//使用 forwardRef 和 useImperativeHandle 将 open 方法暴露给父组件
const CartModal = forwardRef(function Modal({ title, actions }, ref) {
  const dialog = useRef(); // 创建一个引用，用于引用 <dialog> 元素

  //使用 useImperativeHandle 暴露方法
  useImperativeHandle(ref, () => {
    return {
      // 暴露 open 方法，调用 dialog.current.showModal() 打开对话框
      open: () => {
        dialog.current.showModal();
      },
    };
  });

  //createPortal 将模态框内容渲染到 DOM 的特定节点
  return createPortal(
    <dialog id="modal" ref={dialog}>
      <h2>{title}</h2>
      <Cart />
      <form method="dialog" id="modal-actions">
        {actions}
      </form>
    </dialog>,
    document.getElementById("modal")
  );
});

export default CartModal;
