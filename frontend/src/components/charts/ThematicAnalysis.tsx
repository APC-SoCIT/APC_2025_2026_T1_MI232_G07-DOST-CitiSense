import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

// From shadcn docs, initial thematic analysis look and values
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
];

const ThematicAnalysisTable = () => {
  return (
    <div>
      <h1 className="font-sans font-medium text-xl mb-5">Thematic Analysis</h1>
      <Table>
        <TableCaption className="mt-7">
          This is the list of the most talked about topic/theme.
        </TableCaption>

        <TableHeader>
          <TableRow className="border-b border-gray-300">
            <TableHead className="text-center text-xl border-r border-gray-300">
              Topic
            </TableHead>
            <TableHead className="text-center text-xl">Percent</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="text-center font-medium border-r border-gray-300">
                {invoice.invoice}
              </TableCell>
              <TableCell className="text-center">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter></TableFooter>
      </Table>
    </div>
  );
};

export default ThematicAnalysisTable;
