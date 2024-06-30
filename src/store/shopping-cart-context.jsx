import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

// Cart Context 的初始结构
export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
}); // CartContext 是一个对象

function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  return state;
}

// 这个组件函数将全部用于管理上下文数据并将数据提供给应用程序
export default function CartContextProvider({ children }) {
  // useReducer 是一种替代 useState 的方法,特别适用于状态逻辑复杂或多个子值依赖于彼此的情况
  // shoppingCartState 表示购物车的当前状态,
  // shoppingCartDispatch 使用这个函数发送动作，以便更新购物车的状态
  // shoppingCartReducer 接收当前状态和一个动作（action），并返回新的状态
  // {items: [],} 为状态的初始值
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );

  // 将 type, id 传递给 reducer
  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }

  //对应 Shopping cart context的结构，并放入需要的内容
  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    //Context 提供了一种通过组件树传递数据的方法，而不用逐层传递 props。
    //它主要用于共享那些被认为是“全局”的数据，例如当前认证的用户、主题、语言等
    // Context 组件的特殊写法,value 是必须的,用来传递上下文的值, 关联 ctxValue 里的状态
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
