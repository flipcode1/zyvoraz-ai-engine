import { ClipboardList } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockOrders = [
  { id: "#ZYV-001", product: "LED Therapy Mask Pro", customer: "Sarah M.", status: "Delivered", price: "$79.99", date: "2025-12-10" },
  { id: "#ZYV-002", product: "Smart Posture Corrector", customer: "James L.", status: "Shipped", price: "$44.99", date: "2025-12-11" },
  { id: "#ZYV-003", product: "Wireless Charging Pad", customer: "Emily R.", status: "Processing", price: "$39.99", date: "2025-12-12" },
  { id: "#ZYV-004", product: "Automatic Pet Feeder", customer: "Mike T.", status: "Pending", price: "$59.99", date: "2025-12-12" },
  { id: "#ZYV-005", product: "Aesthetic Cloud Lamp", customer: "Anna K.", status: "Delivered", price: "$34.99", date: "2025-12-09" },
  { id: "#ZYV-006", product: "Neck Massager", customer: "David P.", status: "Shipped", price: "$54.99", date: "2025-12-11" },
];

const statusColor: Record<string, string> = {
  Delivered: "bg-green-500/20 text-green-400",
  Shipped: "bg-blue-500/20 text-blue-400",
  Processing: "bg-yellow-500/20 text-yellow-400",
  Pending: "bg-muted text-muted-foreground",
};

const Orders = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-display text-3xl font-bold flex items-center gap-2">
        <ClipboardList size={28} className="text-primary" /> Orders
      </h1>
      <p className="text-muted-foreground">Track and manage customer orders</p>
    </div>

    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockOrders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-mono text-sm">{o.id}</TableCell>
              <TableCell>{o.product}</TableCell>
              <TableCell>{o.customer}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[o.status]}`}>
                  {o.status}
                </span>
              </TableCell>
              <TableCell>{o.price}</TableCell>
              <TableCell className="text-muted-foreground">{o.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default Orders;
