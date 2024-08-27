interface CartItem {
  id: string;
  name: string;
  productType: string;
  quantity: number;
}

interface TransactionItem {
  id: string;
  name: string;
  productType: string;
  quantity: number;
  price: number;
}

export { CartItem, TransactionItem };