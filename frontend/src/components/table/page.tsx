import { useEffect, useState } from "react";
import { columns, Posttype } from "./columns";
import { DataTable } from "./data-table";

function DemoPage() {
  return (
    <div>
      <DataTable columns={columns} />
    </div>
  );
}

export default DemoPage;
