import { columns } from "./columns";
import { DataTable } from "./data-table";

function DemoPage() {
  return (
    <div>
      <DataTable columns={columns} />
    </div>
  );
}

export default DemoPage;
