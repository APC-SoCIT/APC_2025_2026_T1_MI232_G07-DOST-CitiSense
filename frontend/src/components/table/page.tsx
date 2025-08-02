import { columns } from "./columns";
import { DataTable } from "./data-table";

function DemoPage() {
  return (
    <div className="scale-80">
      <DataTable columns={columns} />
    </div>
  );
}

export default DemoPage;
