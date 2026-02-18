import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ShoppingCart, BarChart3, AlertTriangle, Send } from "lucide-react";

export default function KiosqueManager() {
  const initialProducts = [
    { id: 1, name: "Coca-Cola", price: 2, stock: 10, category: "Boissons" },
    { id: 2, name: "Eau", price: 1, stock: 15, category: "Boissons" },
    { id: 3, name: "Chips", price: 1.5, stock: 8, category: "Snacks" },
    { id: 4, name: "Barre Chocolat", price: 1.2, stock: 6, category: "Snacks" },
    { id: 5, name: "Acajous", price: 3, stock: 7, category: "Acajous" },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("Boissons");
  const [cashGiven, setCashGiven] = useState("");
  const [debts, setDebts] = useState([]);
  const [clientName, setClientName] = useState("");
  const [sales, setSales] = useState([]);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);
  const change = cashGiven ? (parseFloat(cashGiven) - total).toFixed(2) : 0;

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart([...cart, product]);
    setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p ));
  };

  const finalizeSale = () => {
    if (cart.length === 0) return;
    setSales([...sales, ...cart]);
    setCart([]);
    setCashGiven("");
  };

  const addDebt = () => {
    if (!clientName || total === 0) return;
    setDebts([...debts, { name: clientName, amount: total }]);
    setCart([]);
    setClientName("");
  };

  const dailyRevenue = sales.reduce((sum, item) => sum + item.price, 0);

  const topProducts = Object.values(
    sales.reduce((acc, item) => {
      acc[item.name] = acc[item.name] ? { ...acc[item.name], count: acc[item.name].count + 1 } : { name: item.name, count: 1 };
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count).slice(0, 3);

  const exportWhatsApp = () => {
    const receipt = 🧾 Ticket Kiosque\n\n${cart.map(item => `- ${item.name} : ${item.price}€).join("\n")}\n\nTotal : ${total}€\nMonnaie : ${change}€`;
    const url = https://wa.me/?text=${encodeURIComponent(receipt)};
    window.open(url, "_blank");
  };

  const categoryColor = (category) => {
    if (category === "Boissons") return "bg-blue-600";
    if (category === "Acajous") return "bg-orange-500";
    return "bg-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 space-y-4">
      <h1 className="text-2xl font-bold">Gestion Kiosque</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 bg-gray-800">
          <TabsTrigger value="Boissons">Boissons</TabsTrigger>
          <TabsTrigger value="Snacks">Snacks</TabsTrigger>
          <TabsTrigger value="Acajous">Acajous</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-2 gap-3">
        {products.filter(p => p.category === activeTab).map(product => (
          <motion.div key={product.id} whileTap={{ scale: 0.95 }}>
            <Card className={p-4 rounded-2xl shadow-lg ${categoryColor(product.category)} ${product.stock < 5 ? "border-2 border-red-500" : ""}} onClick={() => addToCart(product)}>
              <CardContent className="space-y-1">
                <p className="font-bold">{product.name}</p>
                <p>{product.price}€</p>
                <p className="text-sm">Stock: {product.stock}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card className="bg-gray-900 rounded-2xl p-4">
        <CardContent className="space-y-2">
          <p>Total: {total.toFixed(2)}€</p>
          <Input placeholder="Montant donné" value={cashGiven} onChange={e => setCashGiven(e.target.value)} type="number" />
          <p>Monnaie: {change}€</p>
          <Button className="bg-green-600 w-full" onClick={finalizeSale}>Encaisser</Button>
          <Button variant="outline" className="w-full" onClick={exportWhatsApp}><Send size={16} className="mr-2"/> WhatsApp</Button>
        </CardContent>
      </Card>
    </div>
  );
}
